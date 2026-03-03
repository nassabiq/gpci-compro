<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick, computed} from "vue";
import {useIntersectionObserver} from "@vueuse/core";
import {storeToRefs} from "pinia";
import {useProductCategoriesStore} from "~/stores/product_categories";

// Root & state
const root = ref<HTMLElement | null>(null);
const sliderEl = ref<HTMLElement | null>(null);
const keen = ref<any>(null);
const sliderReady = ref(false);

const product_categories = useProductCategoriesStore();
const {homeCards, homePending, homeError} = storeToRefs(product_categories);

// current slide (rel index)
const current = ref(0);
const total = computed(() => keen.value?.track?.details?.slides?.length ?? homeCards.value.length ?? 0);
const canPrev = computed(() => !!keen.value); // loop = true → selalu bisa
const canNext = computed(() => !!keen.value);

async function initKeen() {
	if (!sliderEl.value || keen.value) return;

	// CSS keen (client-only) — impor di sini agar aman SSR
	await import("keen-slider/keen-slider.min.css");

	// import modulnya secara dinamis (client)
	const KeenSlider = (await import("keen-slider")).default;

	keen.value = new KeenSlider(sliderEl.value, {
		loop: true,
		initial: 0,
		slides: {perView: 1.1, spacing: 16},
		breakpoints: {
			"(min-width: 768px)": {slides: {perView: 2.1, spacing: 16}},
			"(min-width: 1024px)": {slides: {perView: 3, spacing: 16}},
		},
		created(s) {
			sliderReady.value = true;
			current.value = s.track.details.rel;
		},
		slideChanged(s) {
			current.value = s.track.details.rel;
		},
	});
}

const toIndex = (idx: number) => keen.value?.moveToIdx(idx);
const onPrev = () => keen.value?.prev();
const onNext = () => keen.value?.next();

const hasInitialized = ref(false); // cegah init ganda
const autoTimer = ref<ReturnType<typeof setInterval> | null>(null);

// --- autoplay helpers
function startAuto() {
	if (autoTimer.value) return; // jangan start dua kali
	autoTimer.value = setInterval(() => keen.value?.next?.(), 4000);
}
function stopAuto() {
	if (!autoTimer.value) return;
	clearInterval(autoTimer.value);
	autoTimer.value = null;
}

onMounted(() => {
	const {stop} = useIntersectionObserver(
		root,
		async ([entry]) => {
			if (!entry?.isIntersecting || hasInitialized.value) return;
			hasInitialized.value = true;

			await product_categories.fetchHomeIfNeeded(9); // data
			await nextTick();
			await initKeen(); // slider

			const el = sliderEl.value;
			if (el) {
				el.addEventListener("mouseenter", stopAuto);
				el.addEventListener("mouseleave", startAuto);
			}
			startAuto();

			// observer cukup sekali saja
			stop();
		},
		{threshold: 0.15}
	);
});

onBeforeUnmount(() => {
	// bersihkan autoplay & listener
	stopAuto();
	const el = sliderEl.value;
	if (el) {
		el.removeEventListener("mouseenter", stopAuto);
		el.removeEventListener("mouseleave", startAuto);
	}
	// hancurkan instance keen
	keen.value?.destroy();
	keen.value = null;
});
</script>

<template>
	<section id="products" class="py-24 bg-gradient-to-br from-green-50 to-emerald-50" ref="root" aria-labelledby="products-heading">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 id="products-heading" class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Certified Product Categories</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">Discover our certified sustainable products across industries and applications.</p>
			</div>

			<!-- Skeleton (slide-style) -->
			<div v-if="homePending && !homeCards.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="i in 3" :key="i" class="rounded-2xl overflow-hidden bg-white border border-gray-100">
					<div class="aspect-video bg-gray-200 animate-pulse"></div>
					<div class="p-6 space-y-3">
						<div class="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
						<div class="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
						<div class="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
						<div class="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
						<div class="h-10 w-full bg-gray-200 animate-pulse rounded mt-4"></div>
					</div>
				</div>
			</div>

			<!-- KEEN SLIDER -->
			<div v-else ref="sliderEl" class="keen-slider pb-10" role="region" aria-label="Products carousel">
				<div v-for="p in homeCards" :key="p.id" class="keen-slider__slide">
					<article class="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow border border-gray-100">
						<div class="aspect-video overflow-hidden">
							<img :src="p.image" :alt="p.title || p.category" class="w-full h-full object-cover" loading="lazy" decoding="async" />
						</div>

						<!-- flex-1 agar kolom ini mengambil sisa tinggi kartu -->
						<div class="flex-1 p-6 flex flex-col">
							<div class="flex items-center justify-between mb-2">
								<h3 class="text-xl font-semibold text-gray-900">{{ p.title || p.category }}</h3>
								<span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">{{ p.count }}</span>
							</div>

							<p class="text-gray-600 mb-4">{{ p.description }}</p>

							<!-- mt-auto mendorong tombol ke bawah -->
							<div class="mt-auto pt-4">
								<NuxtLink to="/products" class="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"> Lihat Produk </NuxtLink>
							</div>
						</div>
					</article>

					<!-- <article class="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 h-full">
						<div class="aspect-video overflow-hidden">
							<img :src="p.image" :alt="p.title || p.category" class="w-full h-full object-cover" loading="lazy" decoding="async" />
						</div>
						<div class="p-6 flex flex-col">
							<div class="flex items-center justify-between mb-2">
								<h3 class="text-xl font-semibold text-gray-900">{{ p.title || p.category }}</h3>
								<span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">{{ p.count }}</span>
							</div>
							<p class="text-gray-600 mb-4">{{ p.description }}</p>
							<div class="mt-auto">
								<NuxtLink :to="`/products/${p.id}`" class="w-full inline-flex items-center justify-center rounded-xl px-4 py-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"> View Details </NuxtLink>
							</div>
						</div>
					</article> -->
				</div>
			</div>

			<!-- Controls + Dots -->
			<div v-if="sliderReady && homeCards.length" class="mt-6 flex items-center justify-between">
				<button class="px-4 py-2 rounded-lg border border-green-300 hover:bg-green-300 cursor-pointer text-green-600 transition" :disabled="!canPrev" @click="onPrev" aria-label="Previous slide">← Prev</button>

				<div class="flex items-center gap-2" role="tablist" aria-label="Carousel pagination">
					<button v-for="(_, idx) in total" :key="idx" class="h-2.5 w-2.5 rounded-full" :class="idx === current ? 'bg-green-600 scale-110' : 'bg-green-300'" @click="toIndex(idx)" :aria-selected="idx === current" role="tab" />
				</div>

				<button class="px-4 py-2 rounded-lg border border-green-300 hover:bg-green-300 cursor-pointer text-green-600 transition" :disabled="!canNext" @click="onNext" aria-label="Next slide">Next →</button>
			</div>

			<!-- Error (opsional) -->
			<p v-if="homeError && !homeCards.length" class="text-center text-red-600 mt-4">{{ homeError }}</p>
			<p v-else-if="homeError && homeCards.length" class="text-center text-amber-600 mt-4 text-sm">{{ homeError }}</p>
		</div>
	</section>
</template>
