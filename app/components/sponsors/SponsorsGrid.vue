<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useSponsorsStore } from "~/stores/sponsors";
import { storeToRefs } from "pinia";

const FALLBACK_IMG = "/img/empty-image.png";

const sponsorsStore = useSponsorsStore();
const { pending } = storeToRefs(sponsorsStore);
const sponsors = computed(() => sponsorsStore.activeSponsors);

function handleImageError(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}

onMounted(async () => {
	await sponsorsStore.fetchSponsors();
});
</script>

<template>
	<section aria-label="Official Partners & Sponsors" class="bg-gray-50 py-12 border-y border-gray-100">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-8">
				<p class="text-xs uppercase tracking-wider text-gray-500 font-semibold">Supported &amp; Trusted by Industry Leaders</p>
			</div>

			<!-- Loading Skeleton -->
			<div v-if="pending && !sponsors.length" class="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
				<div v-for="i in 4" :key="i" class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
			</div>

			<!-- Sponsors Grid -->
			<div v-else-if="sponsors.length" class="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
				<a
					v-for="sponsor in sponsors"
					:key="sponsor.uuid"
					:href="sponsor.website_url || undefined"
					:target="sponsor.website_url ? '_blank' : undefined"
					:rel="sponsor.website_url ? 'noopener noreferrer' : undefined"
					class="group flex items-center justify-center p-4 h-20 w-full max-w-[220px] rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300"
					:title="sponsor.name"
				>
					<img
						:src="sponsor.logo_url || FALLBACK_IMG"
						:alt="sponsor.name"
						class="max-h-12 max-w-[160px] object-contain grayscale group-hover:grayscale-0 transition duration-300"
						@error="handleImageError"
					/>
				</a>
			</div>
		</div>
	</section>
</template>
