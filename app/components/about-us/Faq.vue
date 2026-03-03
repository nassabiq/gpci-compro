<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useFaqsStore } from "~/stores/faqs";
import { ChevronDown } from "lucide-vue-next";
/* =========================
	Types
========================= */
type FAQ = { q: string; a: string };

/* =========================
	Data
========================= */
const fallbackFaqs: ReadonlyArray<FAQ> = [
	{ q: "Apa saja tahapan untuk mendapatkan sertifikasi?", a: "Konsultasi awal → pengajuan dokumen → evaluasi & audit → perbaikan → keputusan sertifikasi → pemantauan berkala." },
	{ q: "Berapa lama proses sertifikasi?", a: "Rata-rata 4–8 minggu tergantung kompleksitas produk & kelengkapan dokumen." },
	{ q: "Apakah sertifikasi berlaku internasional?", a: "Standar kami selaras dengan praktik global dan didukung jaringan mitra internasional." },
] as const;

const faqsStore = useFaqsStore();
const { items, pending, error } = storeToRefs(faqsStore);

const faqs = computed<FAQ[]>(() => (items.value.length ? items.value : [...fallbackFaqs]));

onMounted(() => {
	faqsStore.fetchList();
});
</script>
<template>
	<div>
		<!-- ===== FAQ ===== -->
		<section id="faq" class="py-24 bg-gradient-to-b from-white to-green-50">
			<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-12">
					<h2 class="text-4xl font-bold text-gray-900">FAQ</h2>
				</div>
				<p v-if="pending && !faqs.length" class="text-center text-gray-500 mb-4">Loading FAQ...</p>
				<p v-if="error" class="text-center text-amber-700 mb-4">FAQ menampilkan data cadangan. API belum bisa diakses.</p>
				<div class="space-y-4">
					<details v-for="(f, i) in faqs" :key="i" class="group rounded-xl border border-gray-200 bg-white p-5 open:shadow-md transition">
						<summary class="flex cursor-pointer items-center justify-between list-none">
							<span class="font-medium text-gray-900">{{ f.q }}</span>
							<ChevronDown class="w-5 h-5 text-gray-500 transition group-open:rotate-180" />
						</summary>
						<p class="mt-3 text-gray-600">{{ f.a }}</p>
					</details>
				</div>
			</div>
		</section>
	</div>
</template>

<style></style>
