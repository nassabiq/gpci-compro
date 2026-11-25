<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import type { EditorialArticle } from "~/types/editorial";

const FALLBACK_IMG = "/img/empty-image.png";

const props = defineProps<{
	article: EditorialArticle;
}>();

function onImageError(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}
</script>

<template>
	<article class="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300">
		<!-- Cover Image -->
		<NuxtLink :to="`/editorial/${article.slug}`" class="block p-3 pb-0">
			<div class="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
				<img
					:src="article.cover_image_url || FALLBACK_IMG"
					:alt="article.title"
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					@error="onImageError"
				/>
			</div>
		</NuxtLink>

		<!-- Card Body -->
		<div class="flex flex-col flex-1 justify-between p-4 pt-3">
			<div>
				<!-- Meta: Category & Date -->
				<div class="flex items-center justify-between text-[11px] mb-2 font-medium">
					<span class="font-bold uppercase tracking-wider text-emerald-700">
						{{ article.category?.name || "Editorial" }}
					</span>
					<span class="text-gray-400">
						{{ article.published_date }}
					</span>
				</div>

				<!-- Title -->
				<NuxtLink :to="`/editorial/${article.slug}`" class="block group/title">
					<h3 class="text-sm sm:text-base font-bold text-gray-900 group-hover/title:text-emerald-700 transition-colors line-clamp-2 leading-snug">
						{{ article.title }}
					</h3>
				</NuxtLink>

				<!-- Excerpt -->
				<p class="mt-2 text-xs text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed">
					{{ article.excerpt }}
				</p>
			</div>

			<!-- Action Link -->
			<div class="mt-4 pt-2">
				<NuxtLink
					:to="`/editorial/${article.slug}`"
					class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors"
				>
					<span>Read More</span>
					<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
				</NuxtLink>
			</div>
		</div>
	</article>
</template>
