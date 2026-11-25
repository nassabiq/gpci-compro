<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter, useHead, showError } from "#imports";
import {
	Calendar,
	Eye,
	User,
	ArrowLeft,
	Share2,
	Check,
	Copy,
	BookOpen,
	Sparkles,
} from "@lucide/vue";
import { useEditorialStore } from "~/stores/editorial";
import { sanitizeHtml } from "~/utils/sanitize";
import { isNotFoundError } from "~/utils/api";
import type { EditorialArticle } from "~/types/editorial";

const route = useRoute();
const router = useRouter();
const editorialStore = useEditorialStore();

const slug = computed(() => String(route.params.slug ?? "").trim());
const article = ref<EditorialArticle | null>(null);
const pending = ref(true);
const notFound = ref(false);
const errorMessage = ref("");
const copied = ref(false);

const FALLBACK_IMG = "/img/empty-image.png";

function onImageError(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}

const sanitizedContent = computed(() => {
	return sanitizeHtml(article.value?.content);
});

const currentUrl = computed(() => {
	if (typeof window !== "undefined") {
		return window.location.href;
	}
	return `https://gpci.or.id/editorial/${slug.value}`;
});

const breadcrumbs = computed(() => [
	{ label: "Home", to: "/" },
	{ label: "Editorial", to: "/editorial" },
	{ label: article.value?.title || "Detail Artikel" },
]);

// SEO Meta
useHead(() => ({
	title: article.value ? `${article.value.title} — Editorial GPCI` : "Editorial Artikel — GPCI",
	meta: [
		{
			name: "description",
			content: article.value?.excerpt || "Artikel dan wawasan keberlanjutan dari GPCI.",
		},
		{
			property: "og:title",
			content: article.value?.title || "Editorial GPCI",
		},
		{
			property: "og:description",
			content: article.value?.excerpt || "Artikel dan wawasan keberlanjutan dari GPCI.",
		},
		{
			property: "og:image",
			content: article.value?.cover_image_url || "/img/gpci.png",
		},
		{ property: "og:type", content: "article" },
		{ name: "twitter:card", content: "summary_large_image" },
	],
}));

async function loadArticle() {
	if (!slug.value) {
		notFound.value = true;
		pending.value = false;
		return;
	}

	pending.value = true;
	notFound.value = false;
	errorMessage.value = "";

	try {
		const data = await editorialStore.fetchArticleByIdentifier(slug.value);
		if (!data) {
			notFound.value = true;
		} else {
			article.value = data;
		}
	} catch (err: any) {
		if (isNotFoundError(err)) {
			notFound.value = true;
			showError({
				statusCode: 404,
				statusMessage: "Artikel yang Anda cari tidak ditemukan.",
			});
		} else {
			errorMessage.value = err?.message || "Gagal memuat artikel.";
		}
	} finally {
		pending.value = false;
	}
}

// Social Share Handlers
function shareLinkedIn() {
	const url = encodeURIComponent(currentUrl.value);
	window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
}

function shareTwitter() {
	const url = encodeURIComponent(currentUrl.value);
	const text = encodeURIComponent(article.value?.title || "GPCI Sustainability Insights");
	window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
}

function shareWhatsApp() {
	const url = encodeURIComponent(currentUrl.value);
	const text = encodeURIComponent(`${article.value?.title || "GPCI Editorial"}: ${currentUrl.value}`);
	window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
}

async function copyLink() {
	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(currentUrl.value);
			copied.value = true;
			setTimeout(() => {
				copied.value = false;
			}, 2500);
		}
	} catch (e) {
		console.warn("Copy to clipboard failed", e);
	}
}

watch(() => slug.value, () => loadArticle(), { immediate: true });

onMounted(async () => {
	if (!editorialStore.articles.length) {
		editorialStore.fetchArticles({ limit: 4 });
	}
});

const relatedArticles = computed(() => {
	return editorialStore.articles
		.filter((a) => a.slug !== slug.value && a.uuid !== article.value?.uuid)
		.slice(0, 3);
});
</script>

<template>
	<div class="min-h-screen bg-white">
		<!-- Loading Skeleton -->
		<div v-if="pending" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 space-y-8 animate-pulse">
			<div class="h-5 w-48 bg-gray-200 rounded"></div>
			<div class="space-y-4">
				<div class="h-6 w-32 bg-emerald-100 rounded-full"></div>
				<div class="h-10 w-full bg-gray-200 rounded-lg"></div>
				<div class="h-10 w-4/5 bg-gray-200 rounded-lg"></div>
				<div class="h-5 w-64 bg-gray-200 rounded"></div>
			</div>
			<div class="aspect-[16/9] w-full bg-gray-200 rounded-2xl"></div>
			<div class="space-y-4 pt-6">
				<div class="h-4 w-full bg-gray-100 rounded"></div>
				<div class="h-4 w-5/6 bg-gray-100 rounded"></div>
				<div class="h-4 w-full bg-gray-100 rounded"></div>
				<div class="h-4 w-3/4 bg-gray-100 rounded"></div>
			</div>
		</div>

		<!-- 404 Not Found State -->
		<div v-else-if="notFound" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center space-y-6">
			<div class="mx-auto w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
				<BookOpen class="h-10 w-10" />
			</div>
			<h1 class="text-3xl font-extrabold text-gray-900">Artikel Tidak Ditemukan</h1>
			<p class="text-gray-600 text-base max-w-md mx-auto">
				Maaf, artikel yang Anda tuju mungkin telah dipindahkan, dihapus, atau tautan yang Anda gunakan salah.
			</p>
			<div class="pt-4 flex justify-center gap-4">
				<NuxtLink
					to="/editorial"
					class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition"
				>
					<ArrowLeft class="h-4 w-4" />
					<span>Kembali ke Editorial</span>
				</NuxtLink>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="errorMessage" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center space-y-4">
			<p class="text-red-600 font-semibold text-lg">{{ errorMessage }}</p>
			<button
				type="button"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition cursor-pointer"
				@click="loadArticle"
			>
				Coba Muat Ulang
			</button>
		</div>

		<!-- Article Detail Content -->
		<article v-else-if="article" class="pb-24">
			<!-- Header Banner Section -->
			<header class="bg-gradient-to-b from-gray-50 via-white to-white border-b border-gray-100 pt-28 pb-12 sm:pt-32">
				<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
					<!-- Breadcrumb -->
					<UiBreadcrumb :items="breadcrumbs" />

					<!-- Category & Slogan -->
					<div class="flex flex-wrap items-center gap-3">
						<span
							v-if="article.category?.name"
							class="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
						>
							{{ article.category.name }}
						</span>
						<span
							v-if="article.is_featured"
							class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
						>
							<Sparkles class="h-3 w-3 text-amber-600" />
							Featured
						</span>
						<span
							v-if="article.featured_slogan"
							class="text-xs uppercase tracking-wider font-semibold text-gray-500"
						>
							{{ article.featured_slogan }}
						</span>
					</div>

					<!-- Title -->
					<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
						{{ article.title }}
					</h1>

					<!-- Excerpt -->
					<p class="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal">
						{{ article.excerpt }}
					</p>

					<!-- Author & Meta Info Bar -->
					<div class="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
								<User class="h-5 w-5" />
							</div>
							<div>
								<div class="font-semibold text-gray-900">{{ article.author?.name || "Admin Redaksi GPCI" }}</div>
								<div class="text-xs text-gray-500">Penulis Redaksi</div>
							</div>
						</div>

						<div class="flex items-center gap-5 text-xs sm:text-sm">
							<div class="flex items-center gap-1.5">
								<Calendar class="h-4 w-4 text-gray-400" />
								<span>{{ article.published_date }}</span>
							</div>
							<div class="flex items-center gap-1.5">
								<Eye class="h-4 w-4 text-gray-400" />
								<span>{{ article.views_count.toLocaleString() }} views</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			<!-- Cover Image -->
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
				<div class="rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 shadow-md border border-gray-100">
					<img
						:src="article.cover_image_url || FALLBACK_IMG"
						:alt="article.title"
						class="h-full w-full object-cover"
						@error="onImageError"
					/>
				</div>
			</div>

			<!-- Main Article Body & Share Floating Toolbar -->
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
					<!-- Social Share Sidebar -->
					<aside class="lg:col-span-2 order-last lg:order-first">
						<div class="sticky top-28 space-y-3 flex lg:flex-col items-center gap-2">
							<span class="text-xs uppercase tracking-wider font-bold text-gray-400 hidden lg:block mb-1">
								Share
							</span>

							<!-- LinkedIn -->
							<button
								type="button"
								aria-label="Share ke LinkedIn"
								title="Bagikan ke LinkedIn"
								class="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-600 hover:text-emerald-700 transition cursor-pointer shadow-xs"
								@click="shareLinkedIn"
							>
								<Icon name="simple-icons:linkedin" class="w-4 h-4" />
							</button>

							<!-- Twitter / X -->
							<button
								type="button"
								aria-label="Share ke Twitter"
								title="Bagikan ke X / Twitter"
								class="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-600 hover:text-emerald-700 transition cursor-pointer shadow-xs"
								@click="shareTwitter"
							>
								<Icon name="simple-icons:x" class="w-4 h-4" />
							</button>

							<!-- WhatsApp -->
							<button
								type="button"
								aria-label="Share ke WhatsApp"
								title="Bagikan ke WhatsApp"
								class="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-600 hover:text-emerald-700 transition cursor-pointer shadow-xs"
								@click="shareWhatsApp"
							>
								<Icon name="simple-icons:whatsapp" class="w-4 h-4" />
							</button>

							<!-- Copy Link -->
							<button
								type="button"
								aria-label="Salin tautan artikel"
								:title="copied ? 'Tautan disalin!' : 'Salin tautan'"
								class="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-600 hover:text-emerald-700 transition cursor-pointer shadow-xs relative group"
								@click="copyLink"
							>
								<Check v-if="copied" class="w-4 h-4 text-emerald-600" />
								<Copy v-else class="w-4 h-4" />
								<span
									v-if="copied"
									class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap"
								>
									Disalin!
								</span>
							</button>
						</div>
					</aside>

					<!-- Article Rich HTML Content -->
					<main class="lg:col-span-10">
						<div
							class="editorial-content text-gray-800 leading-relaxed text-base sm:text-lg space-y-6"
							v-html="sanitizedContent"
						></div>

						<!-- Tags & Category Footer -->
						<div class="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<span>Kategori:</span>
								<NuxtLink
									:to="`/editorial?category=${article.category?.slug}`"
									class="font-semibold text-emerald-700 hover:underline"
								>
									{{ article.category?.name }}
								</NuxtLink>
							</div>

							<NuxtLink
								to="/editorial"
								class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
							>
								<ArrowLeft class="h-4 w-4" />
								<span>Semua Artikel Editorial</span>
							</NuxtLink>
						</div>
					</main>
				</div>
			</div>

			<!-- Related Articles Section -->
			<section v-if="relatedArticles.length" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-gray-200">
				<div class="flex items-center justify-between mb-8">
					<div>
						<p class="text-xs uppercase tracking-wider text-emerald-600 font-bold">Wawasan Lainnya</p>
						<h2 class="text-2xl font-bold text-gray-900">Artikel Terkait</h2>
					</div>
					<NuxtLink to="/editorial" class="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
						Lihat Semua &rarr;
					</NuxtLink>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<EditorialCard
						v-for="rel in relatedArticles"
						:key="rel.uuid"
						:article="rel"
					/>
				</div>
			</section>

			<!-- Newsletter Banner on Single Article -->
			<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
				<EditorialNewsletterBanner />
			</div>
		</article>
	</div>
</template>

<style>
/* Styling for sanitized editorial HTML content */
.editorial-content h2 {
	font-size: 1.75rem;
	font-weight: 700;
	color: #111827;
	margin-top: 2rem;
	margin-bottom: 1rem;
	line-height: 1.3;
}

.editorial-content h3 {
	font-size: 1.35rem;
	font-weight: 600;
	color: #1f2937;
	margin-top: 1.75rem;
	margin-bottom: 0.75rem;
	line-height: 1.4;
}

.editorial-content p {
	margin-bottom: 1.25rem;
	line-height: 1.8;
	color: #374151;
}

.editorial-content ul {
	list-style-type: disc;
	padding-left: 1.5rem;
	margin-bottom: 1.5rem;
	space-y: 0.5rem;
}

.editorial-content ol {
	list-style-type: decimal;
	padding-left: 1.5rem;
	margin-bottom: 1.5rem;
	space-y: 0.5rem;
}

.editorial-content li {
	margin-bottom: 0.5rem;
	color: #374151;
}

.editorial-content blockquote {
	border-left: 4px solid #059669;
	padding-left: 1rem;
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
	font-style: italic;
	color: #4b5563;
	background-color: #f0fdf4;
	padding: 1rem 1.25rem;
	border-radius: 0.5rem;
}

.editorial-content img {
	border-radius: 1rem;
	margin-top: 2rem;
	margin-bottom: 2rem;
	width: 100%;
	object-fit: cover;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.editorial-content a {
	color: #047857;
	text-decoration: underline;
	text-underline-offset: 3px;
	font-weight: 500;
}

.editorial-content a:hover {
	color: #065f46;
}

.editorial-content table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
}

.editorial-content th,
.editorial-content td {
	border: 1px solid #e5e7eb;
	padding: 0.75rem 1rem;
	text-align: left;
}

.editorial-content th {
	background-color: #f9fafb;
	font-weight: 600;
}
</style>
