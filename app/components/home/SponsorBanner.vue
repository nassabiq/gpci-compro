<script setup lang="ts">
import {ChevronLeft, ChevronRight} from "@lucide/vue";
import sponsor1 from "~/assets/img/sponsors/sponsors-1.webp";
import sponsor2 from "~/assets/img/sponsors/sponsors-2.webp";
import sponsor3 from "~/assets/img/sponsors/sponsors-3.webp";
import sponsor4 from "~/assets/img/sponsors/sponsors-4.webp";

// Ganti gambar dan URL contoh ini dengan banner sponsor berukuran 10:3.
const banners = [
	{image: sponsor1, url: "https://iapmoindonesia.org/"},
	{image: sponsor2, url: "https://www.toto.co.id/"},
	{image: sponsor3, url: "https://bataramahlingkungan.co.id/"},
	{image: sponsor4, url: "https://thermo.co.id/id/"},
];

const active = ref(0);
const direction = ref(1);
let timer: ReturnType<typeof setInterval> | undefined;

function move(step: number) {
	direction.value = step;
	active.value = (active.value + step + banners.length) % banners.length;
}

onMounted(() => {
	if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		timer = setInterval(() => move(1), 5000);
	}
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
	<section aria-label="Banner sponsor" class="bg-white">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="group relative aspect-[10/3] overflow-hidden rounded-xl bg-gray-100">
				<Transition :name="direction > 0 ? 'slide-next' : 'slide-prev'">
					<a :key="active" :href="banners[active]?.url || undefined" target="_blank" rel="noopener noreferrer" class="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-700">
						<img :src="banners[active]?.image" :alt="`Contoh banner sponsor ${active + 1}`" class="h-full w-full object-cover" />
					</a>
				</Transition>
				<button type="button" aria-label="Banner sebelumnya" class="absolute z-10 left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700" @click="move(-1)">
					<ChevronLeft class="h-5 w-5" />
				</button>
				<button type="button" aria-label="Banner berikutnya" class="absolute z-10 right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700" @click="move(1)">
					<ChevronRight class="h-5 w-5" />
				</button>
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
