<script setup lang="ts">
import { ArrowRight, Leaf } from "@lucide/vue";
import type { EditorialArticle } from "~/types/editorial";

const FALLBACK_IMG = "/img/editorial/featured-city.jpg";

const props = defineProps<{
	article: EditorialArticle | null;
	pending?: boolean;
}>();

function onImageError(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}
</script>

<template>
	<!-- Loading Skeleton -->
	<div
		v-if="pending"
		class="overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-sm animate-pulse grid grid-cols-1 lg:grid-cols-12 min-h-[320px]"
	>
		<div class="lg:col-span-7 bg-gray-200 aspect-[16/9] lg:aspect-auto"></div>
		<div class="lg:col-span-5 p-8 flex flex-col justify-between space-y-4">
			<div class="space-y-3">
				<div class="flex justify-between items-center">
					<div class="h-4 w-28 bg-gray-200 rounded"></div>
					<div class="h-4 w-20 bg-gray-200 rounded"></div>
				</div>
				<div class="h-8 w-4/5 bg-gray-200 rounded-lg"></div>
				<div class="h-8 w-3/5 bg-gray-200 rounded-lg"></div>
				<div class="h-16 w-full bg-gray-100 rounded-lg pt-2"></div>
			</div>
			<div class="h-10 w-32 bg-gray-200 rounded-full"></div>
		</div>
	</div>

	<!-- Featured Spotlight Card -->
	<div
		v-else-if="article"
		class="group overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
	>
		<!-- Left Image Column (Landscape) -->
		<NuxtLink
			:to="`/editorial/${article.slug}`"
			class="relative lg:col-span-7 block overflow-hidden aspect-[16/9] lg:aspect-auto lg:h-full bg-gray-100"
		>
			<img
				:src="article.cover_image_url || FALLBACK_IMG"
				:alt="article.title"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				@error="onImageError"
			/>
			<!-- Bottom Left Text Overlay matching screenshot -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-6 sm:p-8">
				<div class="text-white text-xs sm:text-sm font-bold tracking-wider leading-snug uppercase drop-shadow-md">
					{{ article.featured_slogan || "A GREENER INDONESIA A BRIGHTER TOMORROW" }}
				</div>
			</div>
		</NuxtLink>

		<!-- Right Content Column -->
		<div class="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
			<div>
				<!-- Meta Row: "FEATURED ARTICLE" & Date -->
				<div class="flex items-center justify-between text-xs font-semibold mb-3">
					<span class="text-emerald-700 uppercase tracking-wider font-bold">
						FEATURED ARTICLE
					</span>
					<span class="text-gray-400 font-normal">
						{{ article.published_date }}
					</span>
				</div>

				<!-- Title -->
				<NuxtLink :to="`/editorial/${article.slug}`" class="block group/title">
					<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight group-hover/title:text-emerald-700 transition-colors">
						{{ article.title }}
					</h2>
				</NuxtLink>

				<!-- Excerpt -->
				<p class="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
					{{ article.excerpt }}
				</p>
			</div>

			<!-- Bottom Action & Leaf Tagline -->
			<div class="flex items-center justify-between pt-4 border-t border-gray-100">
				<NuxtLink
					:to="`/editorial/${article.slug}`"
					class="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
				>
					<span>Read More</span>
					<ArrowRight class="h-3.5 w-3.5" />
				</NuxtLink>

				<!-- Leaf Badge from Screenshot -->
				<div class="flex items-center gap-2 text-right">
					<Leaf class="h-5 w-5 text-emerald-600 shrink-0" />
					<div class="text-[11px] leading-tight text-gray-400 font-medium text-left">
						<div>Sustainable Products</div>
						<div>Stronger Communities</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
