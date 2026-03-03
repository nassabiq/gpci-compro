// stores/products.ts
import {defineStore} from "pinia";
import {ALL_PRODUCTS, type Product} from "~/data/products";
import {normalizeBaseUrl} from "~/utils/url";
import {buildPublicApiHeaders} from "~/utils/api";

export type ProductQuery = {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
	sort?: "newest" | "popular";
	certification_uuid?: string;
};

export type ProductCategoryOption = {
	uuid: string;
	name: string;
};

export const useProductsStore = defineStore("products", {
	state: () => ({
		// master data (dari API public/products, fallback lokal)
		allItems: [] as Product[],
		masterLoadPromise: null as Promise<void> | null,

		// LISTING /products
		cards: [] as Product[],
		total: 0,
		pending: false as boolean,
		error: null as string | null,
		loadedOnce: false as boolean,
		lastQuery: {} as ProductQuery,
		categoryOptions: [] as ProductCategoryOption[],
		categoryPending: false as boolean,
		categoryLoadedOnce: false as boolean,

		// SUBSET untuk homepage (opsional)
		homeCards: [] as Product[],
		homePending: false as boolean,
		homeError: null as string | null,
		homeLoadedOnce: false as boolean,
	}),

	getters: {
		/** hitung total halaman utk pagination sederhana */
		totalPages: (s) => (limit: number) => Math.max(1, Math.ceil((s.total || 0) / Math.max(1, limit || 1))),

		/** kategori + count berdasarkan seluruh data utama */
		categoriesFromList: (s) => {
			const map = new Map<string, number>();
			for (const p of s.allItems) {
				map.set(p.category, (map.get(p.category) ?? 0) + 1);
			}
			return Array.from(map.entries())
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([name, count]) => ({name, count}));
		},
	},

	actions: {
		toSlug(value: string): string {
			return String(value ?? "")
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
		},

		normalizeTextValue(value: any, preferredObjectKeys: string[] = []): string {
			if (value === undefined || value === null) return "";
			if (typeof value === "string") return value.trim();
			if (typeof value === "number" || typeof value === "boolean") return String(value);

			if (Array.isArray(value)) {
				return value
					.map((v) => this.normalizeTextValue(v, preferredObjectKeys))
					.filter(Boolean)
					.join(", ")
					.trim();
			}

			if (typeof value === "object") {
				const keysToCheck = [...preferredObjectKeys, "name", "title", "label", "value", "text"];
				for (const key of keysToCheck) {
					const next = this.normalizeTextValue(value?.[key], preferredObjectKeys);
					if (next) return next;
				}
			}

			return "";
		},

		resolveTextField(item: any, keys: string[], preferredObjectKeys: string[] = []): string {
			for (const key of keys) {
				const text = this.normalizeTextValue(item?.[key], preferredObjectKeys);
				if (text) return text;
			}
			return "";
		},

		pickFirst(item: any, keys: string[]): any {
			for (const key of keys) {
				const value = item?.[key];
				if (value !== undefined && value !== null && String(value).trim() !== "") return value;
			}
			return undefined;
		},

		resolveImageValue(item: any): string {
			const direct = this.pickFirst(item, ["image", "image_url", "image_path", "photo", "photo_url", "thumbnail", "thumbnail_url", "product_image", "product_photo", "picture", "picture_url", "file", "file_url", "url"]);
			if (typeof direct === "string") return direct;

			const mediaObj = this.pickFirst(item, ["media", "image_file", "attachment", "cover"]);
			if (typeof mediaObj === "object" && mediaObj) {
				const fromObject = this.pickFirst(mediaObj, ["url", "path", "file", "filename", "name", "key", "src"]);
				if (fromObject !== undefined && fromObject !== null) return String(fromObject);
			}

			const mediaList = this.pickFirst(item, ["images", "photos", "gallery", "attachments"]);
			if (Array.isArray(mediaList) && mediaList.length > 0) {
				const first = mediaList[0];
				if (typeof first === "string") return first;
				if (typeof first === "object" && first) {
					const fromArrayObject = this.pickFirst(first, ["url", "path", "file", "filename", "name", "key", "src"]);
					if (fromArrayObject !== undefined && fromArrayObject !== null) return String(fromArrayObject);
				}
			}

			return "";
		},

		resolveSlugValue(item: any, title: string, id: string, index: number): string {
			const rawSlug = this.pickFirst(item, ["slug", "permalink", "url_key", "seo_slug"]);
			const fromSlugField = this.toSlug(String(rawSlug ?? ""));
			if (fromSlugField) return fromSlugField;

			const fromTitle = this.toSlug(title);
			if (fromTitle) return fromTitle;

			const fromId = this.toSlug(id);
			if (fromId) return fromId;

			return `product-${index + 1}`;
		},

		resolveApiBase() {
			const config = useRuntimeConfig();
			const apiBase = String(config.public.apiBase ?? "").trim();
			const appName = String(config.public.appName ?? "").trim();
			return normalizeBaseUrl(apiBase, appName) || normalizeBaseUrl(appName);
		},

		appendQuery(path: string, query: Record<string, string | number | undefined>): string {
			const params = new URLSearchParams();
			for (const [key, value] of Object.entries(query)) {
				if (value === undefined || value === null || String(value).trim() === "") continue;
				params.set(key, String(value));
			}
			const q = params.toString();
			if (!q) return path;
			return path.includes("?") ? `${path}&${q}` : `${path}?${q}`;
		},

		async fetchPublicProductsRaw(): Promise<any[]> {
			const base = this.resolveApiBase();
			if (!base) throw new Error("Missing API base URL. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_APP_NAME.");
			const config = useRuntimeConfig();
			const headers = buildPublicApiHeaders(config);

			const normalizedBase = base.replace(/\/+$/, "");
			const path = "/api/v1/public/products";

			const getLastPage = (payload: any): number => {
				const candidates = [payload?.meta?.last_page, payload?.pagination?.last_page, payload?.last_page];
				for (const value of candidates) {
					const n = Number(value);
					if (Number.isFinite(n) && n >= 1) return Math.floor(n);
				}
				return 1;
			};

			const withPage = (path: string, page: number) => {
				const qp = `page=${page}`;
				return path.includes("?") ? `${path}&${qp}` : `${path}?${qp}`;
			};

			const firstPayload = await $fetch<any>(`${normalizedBase}${withPage(path, 1)}`, {headers});
			const firstList = this.extractProductsFromResponse(firstPayload);
			const lastPage = getLastPage(firstPayload);

			if (lastPage <= 1) return firstList;

			const merged = firstList.slice();
			for (let page = 2; page <= lastPage; page++) {
				const payload = await $fetch<any>(`${normalizedBase}${withPage(path, page)}`, {headers});
				const list = this.extractProductsFromResponse(payload);
				if (!list.length) break;
				merged.push(...list);
			}
			return merged;
		},

		async fetchPublicProductsPageRaw(query: ProductQuery = {}): Promise<{items: any[]; total: number}> {
			const base = this.resolveApiBase();
			if (!base) throw new Error("Missing API base URL. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_APP_NAME.");
			const config = useRuntimeConfig();
			const headers = buildPublicApiHeaders(config);

			const normalizedBase = base.replace(/\/+$/, "");
			const page = Math.max(1, Number(query.page ?? 1));
			const limit = Math.max(1, Number(query.limit ?? 10));
			const search = (query.search ?? "").trim();
			const category = (query.category ?? "").trim();
			const certification_uuid = (query.certification_uuid ?? "").trim();

			const path = "/api/v1/public/products";
			const variants = [
				{pageKey: "page", limitKey: "per_page"},
				{pageKey: "page", limitKey: "limit"},
			];

			let lastError: unknown = null;
			for (const variant of variants) {
				try {
					const withQuery = this.appendQuery(path, {
						[variant.pageKey]: page,
						[variant.limitKey]: limit,
						search,
						q: search,
						category,
						category_uuid: category,
						certification_uuid,
					});
					const payload = await $fetch<any>(`${normalizedBase}${withQuery}`, {headers});
					const items = this.extractProductsFromResponse(payload);
					const total = Number(payload?.meta?.total ?? payload?.pagination?.total ?? payload?.total ?? items.length);
					return {items, total: Number.isFinite(total) ? total : items.length};
				} catch (e) {
					const status = (e as any)?.status ?? (e as any)?.response?.status;
					if (status === 401 || status === 403) throw e;
					lastError = e;
				}
			}

			if (lastError) throw lastError;
			return {items: [], total: 0};
		},

		async fetchPublicProductDetailRaw(uuid: string): Promise<any> {
			const base = this.resolveApiBase();
			if (!base) throw new Error("Missing API base URL. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_APP_NAME.");
			const config = useRuntimeConfig();
			const headers = buildPublicApiHeaders(config);

			const normalizedBase = base.replace(/\/+$/, "");
			const cleanUuid = encodeURIComponent(String(uuid).trim());
			return await $fetch<any>(`${normalizedBase}/api/v1/public/products/${cleanUuid}`, {headers});
		},

		extractProductsFromResponse(payload: any): any[] {
			if (Array.isArray(payload)) return payload;
			if (Array.isArray(payload?.data)) return payload.data;
			if (Array.isArray(payload?.data?.data)) return payload.data.data;
			if (Array.isArray(payload?.products)) return payload.products;
			if (Array.isArray(payload?.result)) return payload.result;
			return [];
		},

		extractProductFromResponse(payload: any): any | null {
			if (!payload) return null;
			if (Array.isArray(payload)) return payload[0] ?? null;
			if (payload?.data && !Array.isArray(payload.data)) return payload.data;
			if (payload?.product && !Array.isArray(payload.product)) return payload.product;
			if (payload?.result && !Array.isArray(payload.result)) return payload.result;
			return payload;
		},

		extractCategoryName(item: any): string {
			return this.normalizeTextValue(item?.name) || this.normalizeTextValue(item?.category_name) || this.normalizeTextValue(item?.title) || this.normalizeTextValue(item?.category?.name) || "";
		},

		extractCategoryUuid(item: any): string {
			return this.normalizeTextValue(item?.uuid) || this.normalizeTextValue(item?.id) || this.normalizeTextValue(item?.slug) || this.extractCategoryName(item);
		},

		extractCategoriesFromResponse(payload: any): any[] {
			if (Array.isArray(payload)) return payload;
			if (Array.isArray(payload?.data)) return payload.data;
			if (Array.isArray(payload?.data?.data)) return payload.data.data;
			if (Array.isArray(payload?.categories)) return payload.categories;
			if (Array.isArray(payload?.result)) return payload.result;
			return [];
		},

		async fetchPublicProductCategoriesRaw(): Promise<any[]> {
			const base = this.resolveApiBase();
			if (!base) throw new Error("Missing API base URL. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_APP_NAME.");
			const config = useRuntimeConfig();
			const headers = buildPublicApiHeaders(config);

			const normalizedBase = base.replace(/\/+$/, "");
			const paths = ["/api/v1/public/product-categories", "/api/public/product-categories", "/public/product-categories"];
			const getLastPage = (payload: any): number => {
				const candidates = [payload?.meta?.last_page, payload?.pagination?.last_page, payload?.last_page];
				for (const value of candidates) {
					const n = Number(value);
					if (Number.isFinite(n) && n >= 1) return Math.floor(n);
				}
				return 1;
			};

			const withPage = (path: string, page: number) => {
				const qp = `page=${page}`;
				return path.includes("?") ? `${path}&${qp}` : `${path}?${qp}`;
			};

			let lastError: unknown = null;
			for (const path of paths) {
				try {
					const firstPayload = await $fetch<any>(`${normalizedBase}${withPage(path, 1)}`, {headers});
					const firstList = this.extractCategoriesFromResponse(firstPayload);
					const lastPage = getLastPage(firstPayload);
					if (lastPage <= 1) return firstList;

					const merged = firstList.slice();
					for (let page = 2; page <= lastPage; page++) {
						const payload = await $fetch<any>(`${normalizedBase}${withPage(path, page)}`, {headers});
						const list = this.extractCategoriesFromResponse(payload);
						if (!list.length) break;
						merged.push(...list);
					}
					return merged;
				} catch (e) {
					const status = (e as any)?.status ?? (e as any)?.response?.status;
					if (status === 401 || status === 403) throw e;
					lastError = e;
				}
			}

			if (lastError) throw lastError;
			return [];
		},

		async fetchCategoryOptions(force = false) {
			if (!force && this.categoryLoadedOnce && this.categoryOptions.length) return;
			this.categoryPending = true;
			try {
				const raw = await this.fetchPublicProductCategoriesRaw();
				const map = new Map<string, ProductCategoryOption>();
				for (const item of raw) {
					const uuid = this.extractCategoryUuid(item);
					const name = this.extractCategoryName(item);
					if (!uuid || !name) continue;
					map.set(uuid, {uuid, name});
				}
				const unique = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
				if (unique.length) {
					this.categoryOptions = unique;
					this.categoryLoadedOnce = true;
					return;
				}
			} catch {
				// fallback below
			} finally {
				this.categoryPending = false;
			}

			try {
				await this.ensureMasterLoaded();
				const unique = Array.from(new Set(this.allItems.map((p) => p.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));
				this.categoryOptions = unique.map((name) => ({uuid: name, name}));
				this.categoryLoadedOnce = true;
			} catch {
				this.categoryOptions = [];
			}
		},

		toProduct(item: any, index: number): Product {
			const rawFeatures = item?.features;
			const features = Array.isArray(rawFeatures)
				? rawFeatures.filter((v: any) => typeof v === "string" && v.trim())
				: typeof rawFeatures === "string"
					? rawFeatures
							.split(",")
							.map((v) => v.trim())
							.filter(Boolean)
					: [];

			const statusValue = item?.status;
			const status = typeof statusValue === "boolean" ? statusValue : typeof statusValue === "number" ? statusValue === 1 : String(statusValue ?? "active").toLowerCase() !== "inactive";
			const id = String(this.pickFirst(item, ["id", "uuid", "slug", "product_id"]) ?? `product-${index + 1}`);
			const title = this.resolveTextField(item, ["title", "name", "product_name", "product_title"], ["name", "title"]) || "Untitled Product";
			const company = this.normalizeTextValue(item?.company?.name) || this.normalizeTextValue(item?.metadata?.source_company) || this.resolveTextField(item, ["company", "company_name", "brand", "brand_name", "manufacturer"], ["company_name", "brand_name", "name", "title"]) || "-";
			const category = this.normalizeTextValue(item?.category?.name) || this.resolveTextField(item, ["category", "category_name", "product_category", "type", "product_type"], ["category_name", "product_category", "name", "title"]) || "Uncategorized";
			const certificationDate = this.pickFirst(item, ["issue_date", "certification_date", "certified_at", "certificate_date", "published_at", "created_at"]) ?? undefined;

			return {
				id,
				slug: this.resolveSlugValue(item, title, id, index),
				title,
				image: this.resolveImageValue(item),
				company,
				status,
				category,
				description: this.resolveTextField(item, ["description", "desc", "summary", "content"], ["description", "text", "content"]) || "",
				features,
				certificationDate,
			};
		},

		async ensureMasterLoaded(force = false) {
			if (!force && this.allItems.length > 0) return;
			if (this.masterLoadPromise) {
				await this.masterLoadPromise;
				return;
			}

			this.masterLoadPromise = (async () => {
				try {
					const rawList = await this.fetchPublicProductsRaw();
					const mapped = rawList.map((item, index) => this.toProduct(item, index));
					this.allItems = mapped.length ? mapped : ALL_PRODUCTS.slice();
				} catch {
					this.allItems = ALL_PRODUCTS.slice();
				}
			})();

			try {
				await this.masterLoadPromise;
			} finally {
				this.masterLoadPromise = null;
			}
		},

		/**
		 * Fetch list dari master data API (dengan fallback lokal).
		 * Mendukung pagination & filter simple di sisi store (client-side).
		 */
		async fetchList(query: ProductQuery = {}) {
			this.pending = true;
			this.error = null;

			try {
				const page = query.page ?? 1;
				const limit = query.limit ?? 10;
				const term = (query.search ?? "").trim().toLowerCase();
				const cat = query.category && query.category !== "All" ? query.category : undefined;
				const cert = (query.certification_uuid ?? "").trim();

				const remote = await this.fetchPublicProductsPageRaw({
					page,
					limit,
					search: term || undefined,
					category: cat,
					certification_uuid: cert || undefined,
				});

				this.cards = remote.items.map((item, index) => this.toProduct(item, index));
				this.total = remote.total;
				this.loadedOnce = true;
				this.lastQuery = {...query, page, limit};
			} catch (e: any) {
				try {
					await this.ensureMasterLoaded();

					const page = query.page ?? 1;
					const limit = query.limit ?? 10;
					const term = (query.search ?? "").trim().toLowerCase();
					const cat = query.category && query.category !== "All" ? query.category : undefined;

					let items = this.allItems.slice();
					if (cat) items = items.filter((p) => p.category === cat);
					if (term) {
						items = items.filter((p) => (p.title || "").toLowerCase().includes(term) || (p.company || "").toLowerCase().includes(term) || (p.category || "").toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term));
					}

					const total = items.length;
					const start = (page - 1) * limit;
					const end = start + limit;

					this.cards = items.slice(start, end);
					this.total = total;
					this.loadedOnce = true;
					this.lastQuery = {...query, page, limit};
				} catch {
					this.error = e?.message ?? "Failed to prepare products";
				}
			} finally {
				this.pending = false;
			}
		},

		resetListCache() {
			this.loadedOnce = false;
			this.lastQuery = {};
		},

		/**
		 * Subset untuk homepage (carousel), default ambil N item teratas.
		 */
		async fetchHomeIfNeeded(limit = 9) {
			if (this.homeLoadedOnce) return;
			this.homePending = true;
			this.homeError = null;
			try {
				await this.ensureMasterLoaded();
				this.homeCards = this.allItems.slice(0, limit);
				this.homeLoadedOnce = true;
			} catch (e: any) {
				this.homeCards = [];
				this.homeLoadedOnce = false;
				this.homeError = e?.message ?? "Failed to load home products";
			} finally {
				this.homePending = false;
			}
		},

		/**
		 * Detail per id (cari dari ALL_PRODUCTS).
		 */
		async fetchById(id: string): Promise<Product | null> {
			try {
				const raw = await this.fetchPublicProductDetailRaw(id);
				const item = this.extractProductFromResponse(raw);
				if (item) return this.toProduct(item, 0);
			} catch {
				// fallback ke cache/list lokal
			}

			await this.ensureMasterLoaded();
			return this.allItems.find((p) => p.id === id) ?? null;
		},
	},
});
