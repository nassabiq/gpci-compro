<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronLeft, ChevronRight, ExternalLink } from "@lucide/vue";
import { useSponsorsStore } from "~/stores/sponsors";
import { storeToRefs } from "pinia";

const FALLBACK_IMG = "/img/empty-image.png";

const sponsorsStore = useSponsorsStore();
const { pending } = storeToRefs(sponsorsStore);
const sponsors = computed(() => sponsorsStore.activeSponsors);

const active = ref(0);
const direction = ref(1);
let timer: ReturnType<typeof setInterval> | undefined;

function move(step: number) {
	if (!sponsors.value.length) return;
	direction.value = step;
	active.value = (active.value + step + sponsors.value.length) % sponsors.value.length;
}

function handleImageError(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}

onMounted(async () => {
	await sponsorsStore.fetchSponsors();
	if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		timer = setInterval(() => {
			if (sponsors.value.length > 1) {
				move(1);
			}
		}, 5000);
	}
});

onUnmounted(() => {
	if (timer) clearInterval(timer);
});
</script>

<template>
	<section aria-label="Banner sponsor" class="bg-white">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Skeleton Loading -->
			<div v-if="pending && !sponsors.length" class="aspect-[10/3] w-full rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
				<div class="h-8 w-48 rounded bg-gray-300"></div>
			</div>

			<!-- Main Banner Carousel -->
			<div v-else-if="sponsors.length" class="group relative aspect-[10/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm border border-gray-100">
				<Transition :name="direction > 0 ? 'slide-next' : 'slide-prev'">
					<a
						:key="active"
						:href="sponsors[active]?.website_url || undefined"
						:target="sponsors[active]?.website_url ? '_blank' : undefined"
						:rel="sponsors[active]?.website_url ? 'noopener noreferrer' : undefined"
						class="absolute inset-0 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-700 group/link"
					>
						<img
							:src="sponsors[active]?.logo_url || FALLBACK_IMG"
							:alt="sponsors[active]?.name || `Banner sponsor ${active + 1}`"
							class="h-full w-full object-cover transition duration-300"
							@error="handleImageError"
						/>
						<!-- Hover badge if website exists -->
						<div
							v-if="sponsors[active]?.website_url"
							class="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<span>{{ sponsors[active]?.name }}</span>
							<ExternalLink class="h-3.5 w-3.5" />
						</div>
					</a>
				</Transition>

				<!-- Controls -->
				<button
					v-if="sponsors.length > 1"
					type="button"
					aria-label="Banner sebelumnya"
					class="absolute z-10 left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 hover:bg-white"
					@click="move(-1)"
				>
					<ChevronLeft class="h-5 w-5" />
				</button>
				<button
					v-if="sponsors.length > 1"
					type="button"
					aria-label="Banner berikutnya"
					class="absolute z-10 right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 hover:bg-white"
					@click="move(1)"
				>
					<ChevronRight class="h-5 w-5" />
				</button>

				<!-- Dots Indicator -->
				<div v-if="sponsors.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
					<button
						v-for="(_, idx) in sponsors"
						:key="idx"
						type="button"
						:aria-label="`Pergi ke banner ${idx + 1}`"
						class="h-2 rounded-full transition-all duration-300"
						:class="idx === active ? 'w-6 bg-emerald-600' : 'w-2 bg-white/70 hover:bg-white'"
						@click="active = idx"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
	transition: transform 0.5s ease;
}
.slide-next-enter-from,
.slide-prev-leave-to {
	transform: translateX(100%);
}
.slide-next-leave-to,
.slide-prev-enter-from {
	transform: translateX(-100%);
}
@media (prefers-reduced-motion: reduce) {
	.slide-next-enter-active,
	.slide-next-leave-active,
	.slide-prev-enter-active,
	.slide-prev-leave-active {
		transition: none;
	}
}
</style>
