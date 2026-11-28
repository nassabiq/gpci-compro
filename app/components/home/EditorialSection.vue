<script setup lang="ts">
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useEditorialStore } from "~/stores/editorial";
import { ArrowRight, BookOpen } from "@lucide/vue";

const editorialStore = useEditorialStore();
const { articles, articlesPending } = storeToRefs(editorialStore);

const recentArticles = computed(() => articles.value.slice(0, 4));

onMounted(async () => {
	if (!articles.value.length) {
		await editorialStore.fetchArticles({ limit: 4 });
	}
});
</script>

<template>
	<section v-if="articlesPending || recentArticles.length" class="py-20 bg-gray-50 border-t border-gray-100">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
				<div>
					<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
						<BookOpen class="h-3.5 w-3.5" />
						<span>Editorial &amp; Wawasan</span>
					</div>
					<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Insights Terkini</h2>
					<p class="mt-1 text-gray-600 text-sm sm:text-base max-w-xl">
						Ulasan berkala tentang perkembangan industri hijau, sertifikasi material ramah lingkungan, dan inovasi masa depan.
					</p>
				</div>

				<NuxtLink
					to="/editorial"
					class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
				>
					<span>Lihat Semua Artikel</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</NuxtLink>
			</div>

			<!-- Grid -->
			<div v-if="articlesPending && !recentArticles.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<EditorialCardSkeleton v-for="i in 4" :key="i" />
			</div>

			<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<EditorialCard
					v-for="article in recentArticles"
					:key="article.uuid"
					:article="article"
				/>
			</div>
		</div>
	</section>
</template>
