<!-- src/app.vue -->
<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "#imports";
import { isLandingRoute, isTransparentHeaderRoute } from "~/config/routes";

const route = useRoute();

// Landing pages: main full-bleed (tanpa padding/max-width)
const isLanding = computed<boolean>(() => isLandingRoute(route.path));
// Header transparan: hanya untuk halaman dengan hero/background gelap
const isTransparentHeader = computed<boolean>(() => isTransparentHeaderRoute(route.path));

// typed page transition object
const pageTransition = { name: "page", mode: "out-in" } as const;

// Scroll ke atas pada navigasi
watch(
	() => route.fullPath,
	() => {
		if (process.client) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}
);
</script>

<template>
	<div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
		<AppHeader :start-transparent="isTransparentHeader" />

		<main :class="[isLanding ? 'pt-0' : 'pt-24', isLanding ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8']">
			<NuxtPage :transition="pageTransition" />
		</main>

		<AppFooter />
		<NuxtLoadingIndicator />
	</div>
</template>

<style>
.page-enter-active,
.page-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
	transform: translateY(6px);
}
</style>
