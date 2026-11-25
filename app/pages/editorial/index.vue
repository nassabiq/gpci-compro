<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useHead, useRoute, useRouter } from "#imports";
import { storeToRefs } from "pinia";
import { useEditorialStore } from "~/stores/editorial";
import { ArrowRight, BookOpen, RefreshCw } from "@lucide/vue";

useHead({
	title: "Editorial & Sustainability Insights — GPCI",
	meta: [
		{
			name: "description",
			content: "Sustainability insights, industry trends, and green certification updates from GPCI.",
		},
		{ property: "og:title", content: "Editorial & Sustainability Insights — GPCI" },
		{
			property: "og:description",
			content: "Explore stories, ideas, and developments shaping a greener, healthier Indonesia.",
		},
		{ property: "og:type", content: "website" },
	],
});

const route = useRoute();
const router = useRouter();
const editorialStore = useEditorialStore();

const {
	categories,
	categoriesPending,
	featuredArticle,
	featuredPending,
	articles,
	articlesMeta,
	articlesPending,
	articlesError,
} = storeToRefs(editorialStore);

// Filter & pagination state
const selectedCategory = ref(String(route.query.category ?? ""));
const searchQuery = ref(String(route.query.search ?? ""));
const currentPage = ref(Number(route.query.page) || 1);
const limit = ref(8);

async function loadArticles() {
	await editorialStore.fetchArticles({
		page: currentPage.value,
		limit: limit.value,
		"filter[search]": searchQuery.value,
		"filter[category]": selectedCategory.value,
		sort: "-published_at",
	});
}

function syncUrlQuery() {
	const query: Record<string, string | number> = {};
	if (selectedCategory.value) query.category = selectedCategory.value;
	if (searchQuery.value) query.search = searchQuery.value;
	if (currentPage.value > 1) query.page = currentPage.value;

	router.replace({ query });
}

function handleCategoryChange(catSlug: string) {
	selectedCategory.value = catSlug;
	currentPage.value = 1;
	syncUrlQuery();
	loadArticles();
}

function handleSearchChange(query: string) {
	searchQuery.value = query;
	currentPage.value = 1;
	syncUrlQuery();
	loadArticles();
}

function handlePageChange(page: number) {
	currentPage.value = page;
	syncUrlQuery();
	loadArticles();

	if (typeof window !== "undefined") {
		const target = document.getElementById("articles-section");
		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
		}
	}
}

function resetFilters() {
	selectedCategory.value = "";
	searchQuery.value = "";
	currentPage.value = 1;
	syncUrlQuery();
	loadArticles();
}

watch(
	() => route.query,
	(q) => {
		const newCat = String(q.category ?? "");
		const newSearch = String(q.search ?? "");
		const newPage = Number(q.page) || 1;

		if (
			newCat !== selectedCategory.value ||
			newSearch !== searchQuery.value ||
			newPage !== currentPage.value
		) {
			selectedCategory.value = newCat;
			searchQuery.value = newSearch;
			currentPage.value = newPage;
			loadArticles();
		}
	}
);

onMounted(async () => {
	await Promise.all([
		editorialStore.fetchCategories(),
		editorialStore.fetchFeaturedArticle(),
		loadArticles(),
	]);
});
</script>

<template>
	<div class="min-h-screen bg-[#fafcfb]">
		<!-- 1. Top Green Hero Header -->
		<EditorialTopHero />

		<!-- 2. Main Body Content (White / Light Clean BG) -->
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
			<!-- A. Category Navigation & Search Bar -->
			<EditorialFilter
				:categories="categories"
				:selected-category="selectedCategory"
				:search-query="searchQuery"
				:loading="articlesPending || categoriesPending"
				@update:category="handleCategoryChange"
				@update:search="handleSearchChange"
			/>

			<!-- B. Featured Article Spotlight Card -->
			<section id="featured-section" aria-label="Featured Story">
				<EditorialFeaturedCard
					:article="featuredArticle"
					:pending="featuredPending"
				/>
			</section>

			<!-- C. Latest Articles Section -->
			<section id="articles-section" aria-label="Latest Articles" class="space-y-6 pt-2">
				<!-- Section Header Row -->
				<div class="flex items-center justify-between">
					<h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
						Latest Articles
					</h2>

					<button
						v-if="selectedCategory || searchQuery"
						type="button"
						class="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
						@click="resetFilters"
					>
						<span>View All Articles</span>
						<ArrowRight class="h-3.5 w-3.5" />
					</button>
					<NuxtLink
						v-else
						to="/editorial"
						class="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
					>
						<span>View All Articles</span>
						<ArrowRight class="h-3.5 w-3.5" />
					</NuxtLink>
				</div>

				<!-- Loading Skeleton -->
				<div
					v-if="articlesPending"
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					<EditorialCardSkeleton v-for="i in 4" :key="i" />
				</div>

				<!-- Error State -->
				<div
					v-else-if="articlesError"
					class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
				>
					<p class="text-red-700 font-medium mb-3">{{ articlesError }}</p>
					<button
						type="button"
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
						@click="loadArticles"
					>
						<RefreshCw class="h-4 w-4" />
						<span>Coba Lagi</span>
					</button>
				</div>

				<!-- Empty State -->
				<div
					v-else-if="!articles.length"
					class="rounded-2xl border border-gray-200 bg-white p-12 text-center space-y-4 shadow-2xs"
				>
					<div class="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
						<BookOpen class="h-7 w-7" />
					</div>
					<h3 class="text-lg font-bold text-gray-900">Belum Ada Artikel Ditemukan</h3>
					<p class="text-gray-500 max-w-md mx-auto text-xs sm:text-sm">
						Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian Anda.
					</p>
					<div class="pt-2">
						<button
							type="button"
							class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
							@click="resetFilters"
						>
							Reset Filter
						</button>
					</div>
				</div>

				<!-- 4-Column Articles Grid matching Screenshot -->
				<div
					v-else
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					<EditorialCard
						v-for="article in articles"
						:key="article.uuid"
						:article="article"
					/>
				</div>

				<!-- Pagination -->
				<div
					v-if="!articlesPending && articlesMeta.total > limit"
					class="pt-6 border-t border-gray-200"
				>
					<UiPagination
						:page="currentPage"
						:total-items="articlesMeta.total"
						:page-size="articlesMeta.per_page || limit"
						@update:page="handlePageChange"
					/>
				</div>
			</section>

			<!-- D. Stay Updated with Sustainability Insights Newsletter Banner -->
			<section class="pt-4">
				<EditorialNewsletterBanner />
			</section>
		</div>
	</div>
</template>
