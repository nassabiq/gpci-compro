import { defineStore } from "pinia";
import type {
	ArticleQueryParams,
	EditorialArticle,
	EditorialArticleDetailResponse,
	EditorialArticlesMeta,
	EditorialArticlesResponse,
	EditorialCategoriesResponse,
	EditorialCategory,
	EditorialFeaturedResponse,
	SubscribePayload,
	SubscribeResponse,
} from "~/types/editorial";
import {
	extractValidationError,
	fetchPublicApi,
	isNotFoundError,
	isValidationError,
	resolvePublicApiBase,
} from "~/utils/api";

export const FALLBACK_CATEGORIES: EditorialCategory[] = [
	{ uuid: "cat-1", name: "Sustainability", slug: "sustainability", sequence: 1, is_active: true, articles_count: 12 },
	{ uuid: "cat-2", name: "ESG", slug: "esg", sequence: 2, is_active: true, articles_count: 8 },
	{ uuid: "cat-3", name: "Green Products", slug: "green-products", sequence: 3, is_active: true, articles_count: 15 },
	{ uuid: "cat-4", name: "Certification", slug: "certification", sequence: 4, is_active: true, articles_count: 9 },
	{ uuid: "cat-5", name: "Industry News", slug: "industry-news", sequence: 5, is_active: true, articles_count: 7 },
];

export const FALLBACK_FEATURED_ARTICLE: EditorialArticle = {
	uuid: "featured-1",
	title: "The Future of Sustainable Materials in Indonesia",
	slug: "the-future-of-sustainable-materials-in-indonesia",
	featured_slogan: "A Greener Indonesia A Brighter Tomorrow",
	excerpt:
		"Discover how eco-friendly innovation is transforming Indonesian industries and supporting national goals towards a low-carbon, circular economy.",
	content: `
		<p>Indonesia is witnessing a paradigm shift across its industrial and construction landscape. As climate awareness rises and global sustainability commitments tighten, sustainable materials are no longer a niche preference—they are rapidly becoming the bedrock of future infrastructure and manufacturing.</p>
		
		<h2>Transforming Indonesian Industries</h2>
		<p>From low-carbon cement formulations to locally sourced timber and non-toxic finishing paints, green materials are demonstrating that environmental responsibility and industrial viability can go hand-in-hand. The Green Product Council Indonesia (GPCI) has been at the forefront of this transformation, providing clear certification standards that assure quality, safety, and verifiable eco-credentials.</p>
		
		<blockquote>
			"Sustainable material adoption is not just an environmental imperative; it is an economic opportunity for Indonesia to lead Southeast Asia in circular manufacturing."
		</blockquote>

		<h3>Supporting National Carbon Neutrality Goals</h3>
		<p>Indonesia's enhanced NDC targets require cross-sectoral dedication. By specifying certified green products in public infrastructure and private developments, developers and architects can reduce embodied carbon by up to 35% across a building's lifecycle.</p>

		<ul>
			<li><strong>Lower Embodied Carbon:</strong> Reduced greenhouse gas emissions during extraction, transport, and manufacturing.</li>
			<li><strong>Resource Circularity:</strong> Maximizing recycled content and closed-loop recyclability.</li>
			<li><strong>Health & Indoor Quality:</strong> Minimizing volatile organic compounds (VOCs) for safer living spaces.</li>
		</ul>

		<p>Through collaborative efforts between regulatory bodies, certified producers, and forward-thinking architects, Indonesia is building a more resilient, sustainable tomorrow.</p>
	`,
	cover_image_url: "/img/editorial/featured-city.jpg",
	is_featured: true,
	published_date: "Mar 12, 2024",
	published_at: "2024-03-12T00:00:00.000000Z",
	views_count: 1840,
	category: {
		uuid: "cat-3",
		name: "Green Products",
		slug: "green-products",
	},
	author: {
		name: "Tim Redaksi GPCI",
	},
};

export const FALLBACK_ARTICLES: EditorialArticle[] = [
	{
		uuid: "art-1",
		title: "ESG Trends for 2026: What Businesses Need to Know",
		slug: "esg-trends-for-2026-what-businesses-need-to-know",
		excerpt: "A look at the emerging ESG trends shaping a more sustainable and resilient future.",
		content: "<p>Environmental, Social, and Governance (ESG) standards have evolved from reporting requirements into strategic drivers for sustainable growth in Indonesia...</p>",
		cover_image_url: "/img/editorial/thumb-1.jpg",
		is_featured: false,
		published_date: "Mar 10, 2024",
		published_at: "2024-03-10T00:00:00.000000Z",
		views_count: 940,
		category: { uuid: "cat-2", name: "ESG", slug: "esg" },
		author: { name: "Redaksi GPCI" },
	},
	{
		uuid: "art-2",
		title: "Updates on GPCI Green Label Certification",
		slug: "updates-on-gpci-green-label-certification",
		excerpt: "Key updates and new criteria for a stronger, more credible green label ecosystem.",
		content: "<p>GPCI announces updated criteria for Green Label Indonesia certification, enhancing transparency, verification speed, and alignment with international eco-standards...</p>",
		cover_image_url: "/img/editorial/thumb-2.jpg",
		is_featured: false,
		published_date: "Mar 5, 2024",
		published_at: "2024-03-05T00:00:00.000000Z",
		views_count: 1120,
		category: { uuid: "cat-4", name: "Certification", slug: "certification" },
		author: { name: "Redaksi GPCI" },
	},
	{
		uuid: "art-3",
		title: "The Circular Economy Initiative in Indonesia",
		slug: "the-circular-economy-initiative-in-indonesia",
		excerpt: "How collaboration across industries is accelerating the shift to a circular economy.",
		content: "<p>Circular economic principles are reshaping how materials are managed from cradle to cradle. Discover how Indonesian businesses are leading the transition...</p>",
		cover_image_url: "/img/editorial/thumb-3.jpg",
		is_featured: false,
		published_date: "Feb 28, 2024",
		published_at: "2024-02-28T00:00:00.000000Z",
		views_count: 875,
		category: { uuid: "cat-5", name: "Industry News", slug: "industry-news" },
		author: { name: "Redaksi GPCI" },
	},
	{
		uuid: "art-4",
		title: "Innovative Green Products Changing Everyday Life",
		slug: "innovative-green-products-changing-everyday-life",
		excerpt: "Meet the certified brands bringing sustainable solutions to homes, offices, and communities.",
		content: "<p>From energy-efficient fixtures to certified non-toxic furnishings, eco-certified products are making everyday living healthier and more sustainable...</p>",
		cover_image_url: "/img/editorial/thumb-4.jpg",
		is_featured: false,
		published_date: "Feb 20, 2024",
		published_at: "2024-02-20T00:00:00.000000Z",
		views_count: 1350,
		category: { uuid: "cat-3", name: "Green Products", slug: "green-products" },
		author: { name: "Redaksi GPCI" },
	},
	{
		uuid: "art-5",
		title: "Accelerating Net-Zero Roadmap in Indonesian Manufacturing",
		slug: "accelerating-net-zero-roadmap-in-indonesian-manufacturing",
		excerpt: "Strategic pathways for green manufacturing and carbon reduction in emerging markets.",
		content: "<p>Indonesia's transition towards carbon neutrality requires holistic strategies connecting policy, finance, and industrial innovation across the supply chain...</p>",
		cover_image_url: "/img/editorial/thumb-1.jpg",
		is_featured: false,
		published_date: "Mar 15, 2024",
		published_at: "2024-03-15T00:00:00.000000Z",
		views_count: 620,
		category: { uuid: "cat-1", name: "Sustainability", slug: "sustainability" },
		author: { name: "Redaksi GPCI" },
	},
];

/**
 * Filter list fallback lokal berdasarkan parameter query
 */
export function filterFallbackArticles(query: ArticleQueryParams = {}): EditorialArticle[] {
	let list = [...FALLBACK_ARTICLES];

	if (query["filter[category]"] && String(query["filter[category]"]).trim()) {
		const cat = String(query["filter[category]"]).trim().toLowerCase();
		list = list.filter((a) => {
			const slug = a.category?.slug?.toLowerCase();
			const uuid = a.category?.uuid?.toLowerCase();
			const name = a.category?.name?.toLowerCase();
			return slug === cat || uuid === cat || name === cat;
		});
	}

	if (query["filter[search]"] && String(query["filter[search]"]).trim()) {
		const q = String(query["filter[search]"]).trim().toLowerCase();
		list = list.filter((a) => {
			return (
				a.title.toLowerCase().includes(q) ||
				a.excerpt.toLowerCase().includes(q) ||
				(a.featured_slogan && a.featured_slogan.toLowerCase().includes(q))
			);
		});
	}

	if (typeof query["filter[is_featured]"] === "boolean") {
		list = list.filter((a) => a.is_featured === query["filter[is_featured]"]);
	}

	return list;
}

export const useEditorialStore = defineStore("editorial", {
	state: () => ({
		// Kategori
		categories: [] as EditorialCategory[],
		categoriesPending: false as boolean,
		categoriesLoadedOnce: false as boolean,

		// Featured Hero Article
		featuredArticle: null as EditorialArticle | null,
		featuredPending: false as boolean,
		featuredLoadedOnce: false as boolean,

		// List Artikel
		articles: [] as EditorialArticle[],
		articlesMeta: {
			current_page: 1,
			last_page: 1,
			per_page: 10,
			total: 0,
		} as EditorialArticlesMeta,
		articlesPending: false as boolean,
		articlesError: null as string | null,
		lastQuery: {} as ArticleQueryParams,

		// Single Detail Artikel
		currentArticle: null as EditorialArticle | null,
		currentArticlePending: false as boolean,
		currentArticleError: null as string | null,

		// Newsletter Subscription
		subscribePending: false as boolean,
	}),

	getters: {
		totalPages: (state) => state.articlesMeta.last_page || 1,
		totalArticles: (state) => state.articlesMeta.total || 0,
	},

	actions: {
		/**
		 * Ambil daftar kategori editorial
		 */
		async fetchCategories(limit = 50, force = false) {
			if (!force && this.categoriesLoadedOnce && this.categories.length > 0) return;

			this.categoriesPending = true;
			const base = resolvePublicApiBase();
			if (!base) {
				this.categories = [...FALLBACK_CATEGORIES];
				this.categoriesLoadedOnce = true;
				this.categoriesPending = false;
				return;
			}

			try {
				const res = await fetchPublicApi<EditorialCategoriesResponse>("/api/v1/public/editorial/categories", {
					params: { limit },
				});
				const list = Array.isArray(res?.data) ? res.data : [];
				this.categories = list.length ? list : [...FALLBACK_CATEGORIES];
				this.categoriesLoadedOnce = true;
			} catch (err) {
				console.error("Failed to fetch editorial categories from API:", err);
				if (!this.categories.length) {
					this.categories = [...FALLBACK_CATEGORIES];
				}
				this.categoriesLoadedOnce = true;
			} finally {
				this.categoriesPending = false;
			}
		},

		/**
		 * Ambil artikel featured untuk hero section
		 */
		async fetchFeaturedArticle(force = false) {
			if (!force && this.featuredLoadedOnce && this.featuredArticle) return;

			this.featuredPending = true;
			const base = resolvePublicApiBase();
			if (!base) {
				this.featuredArticle = { ...FALLBACK_FEATURED_ARTICLE };
				this.featuredLoadedOnce = true;
				this.featuredPending = false;
				return;
			}

			try {
				const res = await fetchPublicApi<EditorialFeaturedResponse>("/api/v1/public/editorial/featured");
				if (res && typeof res === "object" && "data" in res) {
					this.featuredArticle = res.data ?? null;
				} else {
					this.featuredArticle = { ...FALLBACK_FEATURED_ARTICLE };
				}
				this.featuredLoadedOnce = true;
			} catch (err) {
				console.error("Failed to fetch featured article from API:", err);
				this.featuredArticle = { ...FALLBACK_FEATURED_ARTICLE };
				this.featuredLoadedOnce = true;
			} finally {
				this.featuredPending = false;
			}
		},

		/**
		 * Ambil daftar artikel dengan filter pencarian, kategori, dan paginasi
		 */
		async fetchArticles(query: ArticleQueryParams = {}) {
			this.articlesPending = true;
			this.articlesError = null;
			this.lastQuery = { ...query };

			const base = resolvePublicApiBase();
			if (!base) {
				// Local fallback filtering
				const list = filterFallbackArticles(query);
				this.articles = list;
				this.articlesMeta = {
					current_page: 1,
					last_page: 1,
					per_page: query.limit || 10,
					total: list.length,
				};
				this.articlesPending = false;
				return;
			}

			try {
				const params: Record<string, any> = {
					limit: query.limit ?? 10,
					page: query.page ?? 1,
					sort: query.sort ?? "-published_at",
				};

				if (query["filter[search]"] && query["filter[search]"].trim()) {
					params["filter[search]"] = query["filter[search]"].trim();
				}

				if (query["filter[category]"] && query["filter[category]"].trim()) {
					params["filter[category]"] = query["filter[category]"].trim();
				}

				if (typeof query["filter[is_featured]"] === "boolean") {
					params["filter[is_featured]"] = query["filter[is_featured]"];
				}

				const res = await fetchPublicApi<EditorialArticlesResponse>("/api/v1/public/editorial/articles", {
					params,
				});

				// Saat API berhasil merespons: selalu gunakan data API (bahkan jika kosong [])!
				if (res && Array.isArray(res.data)) {
					this.articles = res.data;
					this.articlesMeta = {
						current_page: Number(res.meta?.current_page) || 1,
						last_page: Number(res.meta?.last_page) || 1,
						per_page: Number(res.meta?.per_page) || query.limit || 10,
						total: typeof res.meta?.total === "number" ? res.meta.total : res.data.length,
					};
				} else {
					const list = filterFallbackArticles(query);
					this.articles = list;
					this.articlesMeta = {
						current_page: 1,
						last_page: 1,
						per_page: query.limit || 10,
						total: list.length,
					};
				}
			} catch (err: any) {
				console.error("Failed to fetch editorial articles from API:", err);
				// Saat API gagal / tidak terhubung, gunakan fallback yang tetap mematuhi filter query aktif!
				const list = filterFallbackArticles(query);
				this.articles = list;
				this.articlesMeta = {
					current_page: 1,
					last_page: 1,
					per_page: query.limit || 10,
					total: list.length,
				};
			} finally {
				this.articlesPending = false;
			}
		},

		/**
		 * Ambil single detail artikel berdasarkan slug atau uuid
		 */
		async fetchArticleByIdentifier(identifier: string): Promise<EditorialArticle | null> {
			const clean = encodeURIComponent(String(identifier || "").trim());
			if (!clean) return null;

			this.currentArticlePending = true;
			this.currentArticleError = null;

			const base = resolvePublicApiBase();
			if (!base) {
				const found =
					[FALLBACK_FEATURED_ARTICLE, ...FALLBACK_ARTICLES].find(
						(a) => a.slug === identifier || a.uuid === identifier
					) || null;
				this.currentArticle = found;
				this.currentArticlePending = false;
				return found;
			}

			try {
				const res = await fetchPublicApi<EditorialArticleDetailResponse>(
					`/api/v1/public/editorial/articles/${clean}`
				);
				this.currentArticle = res?.data ?? null;
				return this.currentArticle;
			} catch (err: any) {
				console.error("Failed to fetch article detail from API:", err);
				if (isNotFoundError(err)) {
					this.currentArticleError = "Artikel tidak ditemukan.";
				} else {
					const localFound = [FALLBACK_FEATURED_ARTICLE, ...FALLBACK_ARTICLES].find(
						(a) => a.slug === identifier || a.uuid === identifier
					);
					if (localFound) {
						this.currentArticle = localFound;
						return localFound;
					}
					this.currentArticleError = err?.message || "Gagal memuat artikel.";
				}
				this.currentArticle = null;
				throw err;
			} finally {
				this.currentArticlePending = false;
			}
		},

		/**
		 * Subscribe newsletter email
		 */
		async subscribeNewsletter(email: string): Promise<{
			success: boolean;
			message: string;
			errors?: Record<string, string[]>;
		}> {
			this.subscribePending = true;
			const base = resolvePublicApiBase();
			if (!base) {
				// Local simulation when API not configured
				await new Promise((resolve) => setTimeout(resolve, 600));
				this.subscribePending = false;
				return {
					success: true,
					message: "Thank you for subscribing to GPCI Sustainability Insights!",
				};
			}

			try {
				const body: SubscribePayload = { email: email.trim() };
				const res = await fetchPublicApi<SubscribeResponse>("/api/v1/public/editorial/subscribe", {
					method: "POST",
					body,
					isPost: true,
				});
				return {
					success: true,
					message: res?.message || "Thank you for subscribing to GPCI Sustainability Insights!",
				};
			} catch (err: any) {
				if (isValidationError(err)) {
					const val = extractValidationError(err);
					return {
						success: false,
						message: val.message,
						errors: val.errors,
					};
				}
				return {
					success: false,
					message: err?.message || "Terjadi kesalahan saat memproses langganan. Silakan coba lagi.",
				};
			} finally {
				this.subscribePending = false;
			}
		},
	},
});
