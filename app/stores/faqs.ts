import {defineStore} from "pinia";
import {normalizeBaseUrl} from "~/utils/url";
import {buildPublicApiHeaders} from "~/utils/api";

export type PublicFaq = {
	id: string;
	q: string;
	a: string;
};

const FALLBACK_FAQS: PublicFaq[] = [
	{id: "faq-1", q: "Apa saja tahapan untuk mendapatkan sertifikasi?", a: "Konsultasi awal -> pengajuan dokumen -> evaluasi & audit -> perbaikan -> keputusan sertifikasi -> pemantauan berkala."},
	{id: "faq-2", q: "Berapa lama proses sertifikasi?", a: "Rata-rata 4-8 minggu tergantung kompleksitas produk & kelengkapan dokumen."},
	{id: "faq-3", q: "Apakah sertifikasi berlaku internasional?", a: "Standar kami selaras dengan praktik global dan didukung jaringan mitra internasional."},
];

export const useFaqsStore = defineStore("faqs", {
	state: () => ({
		items: [] as PublicFaq[],
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
			if (Array.isArray(payload?.faqs)) return payload.faqs;
			if (Array.isArray(payload?.result)) return payload.result;
			return [];
		},

		toFaq(item: any, index: number): PublicFaq {
			return {
				id: String(item?.id ?? item?.slug ?? `faq-${index + 1}`),
				q: String(item?.q ?? item?.question ?? item?.title ?? `Question ${index + 1}`),
				a: String(item?.a ?? item?.answer ?? item?.content ?? ""),
			};
		},

		async fetchPublicFaqRaw(): Promise<any[]> {
			const base = this.resolveApiBase();
			if (!base) throw new Error("Missing API base URL. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_APP_NAME.");
			const config = useRuntimeConfig();
			const headers = buildPublicApiHeaders(config);

			const normalizedBase = base.replace(/\/+$/, "");
			const paths = ["/api/v1/public/faq", "/api/public/faq", "/public/faq"];

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
				const rawList = await this.fetchPublicFaqRaw();
				const mapped = rawList.map((item, index) => this.toFaq(item, index));
				this.items = mapped.length ? mapped : FALLBACK_FAQS.slice();
				this.loadedOnce = true;
			} catch (e: any) {
				this.items = FALLBACK_FAQS.slice();
				this.loadedOnce = true;
				this.error = e?.message ?? "Failed to load FAQ";
			} finally {
				this.pending = false;
			}
		},
	},
});
