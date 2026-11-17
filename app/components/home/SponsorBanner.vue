<script setup lang="ts">
import {ChevronLeft, ChevronRight} from "@lucide/vue";

// Ganti gambar contoh ini dengan banner sponsor berukuran 10:3.
const banners = ["/img/sponsors/sponsors-1.webp", "/img/sponsors/sponsors-2.webp"];

const active = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

function move(direction: number) {
	active.value = (active.value + direction + banners.length) % banners.length;
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
				<Transition name="slide">
					<img :key="active" :src="banners[active]" :alt="`Contoh banner sponsor ${active + 1}`" class="absolute inset-0 h-full w-full object-cover" />
				</Transition>
				<button type="button" aria-label="Banner sebelumnya" class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700" @click="move(-1)">
					<ChevronLeft class="h-5 w-5" />
				</button>
				<button type="button" aria-label="Banner berikutnya" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700" @click="move(1)">
					<ChevronRight class="h-5 w-5" />
				</button>
			</div>
		</div>
	</section>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.5s ease;
}
.slide-enter-from {
	transform: translateX(100%);
}
.slide-leave-to {
	transform: translateX(-100%);
}
@media (prefers-reduced-motion: reduce) {
	.slide-enter-active,
	.slide-leave-active {
		transition: none;
	}
}
</style>
