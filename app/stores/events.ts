import {defineStore} from "pinia";
import {normalizeBaseUrl} from "~/utils/url";
import {buildPublicApiHeaders} from "~/utils/api";

export type PublicEvent = {
	id: string;
	year: string;
	title: string;
	text: string;
};

const FALLBACK_EVENTS: PublicEvent[] = [
	{
		id: "2015-foundation",
		year: "2015",
		title: "Foundation",
		text: "GPCI established as Indonesia's premier eco-certification body",
	},
	{
		id: "2017-first-certifications",
		year: "2017",
		title: "First Certifications",
		text: "Launched Green Label Indonesia with initial 25 certified products",
	},
	{
		id: "2019-industry-recognition",
		year: "2019",
		title: "Industry Recognition",
		text: "Achieved national recognition and expanded to 100+ certified products",
	},
	{
		id: "2021-digital-transformation",
		year: "2021",
		title: "Digital Transformation",
		text: "Launched digital certification platform and online verification system",
	},
];

export const useEventsStore = defineStore("events", {
	state: () => ({
		items: [] as PublicEvent[],
		pending: false as boolean,
		error: null as string | null,
		loadedOnce: false as boolean,
	}),

	actions: {
		resolveApiBase() {
			const config = useRuntimeConfig();
			const apiBase = String(config.public.apiBase ?? "").trim();
			const appName = String(config.public.appName ?? "").trim();
			return normalizeBaseUrl(apiBase, appName) || normalizeBaseUrl(appName);
		},

		extractList(payload: any): any[] {
			if (Array.isArray(payload)) return payload;
			if (Array.isArray(payload?.data)) return payload.data;
			if (Array.isArray(payload?.data?.data)) return payload.data.data;
			if (Array.isArray(payload?.events)) return payload.events;
			if (Array.isArray(payload?.result)) return payload.result;
			return [];
		},

		yearFromValue(item: any) {
			const raw = item?.year ?? item?.event_year ?? item?.date ?? item?.event_date ?? item?.created_at;
			if (!raw) return "";
			const s = String(raw);
			const m = s.match(/\b(19|20)\d{2}\b/);
			return m?.[0] ?? s.slice(0, 4);
		},

		toEvent(item: any, index: number): PublicEvent {
			const title = String(item?.title ?? item?.name ?? item?.event_name ?? `Event ${index + 1}`);
			return {
				id: String(item?.id ?? item?.slug ?? `event-${index + 1}`),
				year: this.yearFromValue(item) || "-",
				title,
				text: String(item?.text ?? item?.description ?? item?.content ?? ""),
			};
		},

		async fetchPublicEventsRaw(): Promise<any[]> {
			const base = this.resolveApiBase();
			if (!base) throw new Error("Missing API base URL. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_APP_NAME.");
			const config = useRuntimeConfig();
			const headers = buildPublicApiHeaders(config);

			const normalizedBase = base.replace(/\/+$/, "");
			const paths = ["/api/v1/public/events", "/api/public/events", "/public/events"];

			let lastError: unknown = null;
			for (const path of paths) {
				try {
					const payload = await $fetch<any>(`${normalizedBase}${path}`, {headers});
					const list = this.extractList(payload);
					if (list.length) return list;
				} catch (e) {
					lastError = e;
				}
			}

			if (lastError) throw lastError;
			return [];
		},

		async fetchList(force = false) {
			if (!force && this.loadedOnce) return;
			this.pending = true;
			this.error = null;
			try {
				const rawList = await this.fetchPublicEventsRaw();
				const mapped = rawList.map((item, index) => this.toEvent(item, index));
				this.items = mapped.length ? mapped : FALLBACK_EVENTS.slice();
				this.loadedOnce = true;
			} catch (e: any) {
				this.items = FALLBACK_EVENTS.slice();
				this.loadedOnce = true;
				this.error = e?.message ?? "Failed to load events";
			} finally {
				this.pending = false;
			}
		},
	},
});
