import { defineStore } from "pinia";
import type { Sponsor, SponsorQueryParams, SponsorsMeta, SponsorsResponse } from "~/types/sponsors";
import { fetchPublicApi, resolvePublicApiBase } from "~/utils/api";

import sponsor1 from "~/assets/img/sponsors/sponsors-1.webp";
import sponsor2 from "~/assets/img/sponsors/sponsors-2.webp";
import sponsor3 from "~/assets/img/sponsors/sponsors-3.webp";
import sponsor4 from "~/assets/img/sponsors/sponsors-4.webp";

export const FALLBACK_SPONSORS: Sponsor[] = [
	{
		uuid: "fallback-1",
		name: "IAPMO Indonesia",
		slug: "iapmo-indonesia",
		logo_url: sponsor1,
		website_url: "https://iapmoindonesia.org/",
		sequence: 1,
		is_active: true,
	},
	{
		uuid: "fallback-2",
		name: "TOTO Indonesia",
		slug: "toto-indonesia",
		logo_url: sponsor2,
		website_url: "https://www.toto.co.id/",
		sequence: 2,
		is_active: true,
	},
	{
		uuid: "fallback-3",
		name: "Batara Mahlingkungan",
		slug: "batara-mahlingkungan",
		logo_url: sponsor3,
		website_url: "https://bataramahlingkungan.co.id/",
		sequence: 3,
		is_active: true,
	},
	{
		uuid: "fallback-4",
		name: "Toilon",
		slug: "toilon",
		logo_url: sponsor4,
		website_url: "https://toilon.co.id/id/",
		sequence: 4,
		is_active: true,
	},
];

export const useSponsorsStore = defineStore("sponsors", {
	state: () => ({
		items: [] as Sponsor[],
		meta: null as SponsorsMeta | null,
		pending: false as boolean,
		error: null as string | null,
		loadedOnce: false as boolean,
	}),

	getters: {
		activeSponsors: (state) => {
			return state.items
				.filter((s) => s.is_active !== false)
				.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
		},
	},

	actions: {
		async fetchSponsors(query: SponsorQueryParams = {}, force = false) {
			if (!force && this.loadedOnce && this.items.length > 0) return;

			this.pending = true;
			this.error = null;

			const base = resolvePublicApiBase();
			if (!base) {
				this.items = [...FALLBACK_SPONSORS];
				this.loadedOnce = true;
				this.pending = false;
				return;
			}

			try {
				const params: Record<string, any> = {
					limit: query.limit ?? 20,
					sort: query.sort ?? "sequence",
				};
				if (query.page) params.page = query.page;
				if (query["filter[search]"]) params["filter[search]"] = query["filter[search]"];

				const response = await fetchPublicApi<SponsorsResponse>("/api/v1/public/sponsors", {
					params,
				});

				const list = Array.isArray(response?.data) ? response.data : [];
				this.items = list.length > 0 ? list : [...FALLBACK_SPONSORS];
				this.meta = response?.meta ?? null;
				this.loadedOnce = true;
			} catch (err: any) {
				this.error = err?.message || "Failed to load sponsors";
				if (!this.items.length) {
					this.items = [...FALLBACK_SPONSORS];
				}
				this.loadedOnce = true;
			} finally {
				this.pending = false;
			}
		},
	},
});
