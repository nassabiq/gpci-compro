<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useProductsStore } from "~/stores/products";
import type { Product } from "~/data/products";
import { storeToRefs } from "pinia";

// ====== STATE ======
const productsStore = useProductsStore();
const { cards, total, pending, categoryOptions } = storeToRefs(productsStore);

// Search & Filters
const search = ref("");
const selectedCategory = ref("");
const route = useRoute();

// Derived lists
const categorySelectOptions = computed(() => categoryOptions.value.map((c) => ({ id: c.uuid, name: c.name })));

onMounted(async () => {
	await productsStore.fetchCategoryOptions();

	// Initialize category from query
	const initialCategory = String(route.query.category ?? "").trim();
	if (initialCategory) {
		const found = categoryOptions.value.find((c) => c.uuid === initialCategory || c.name.toLowerCase() === initialCategory.toLowerCase());
		if (found) selectedCategory.value = found.uuid;
	}

	await productsStore.fetchList({
		page: page.value,
		limit: pageSize.value,
		search: search.value,
		category: selectedCategory.value || undefined,
		certification_uuid: "GLI",
	});
});

/* ========= Pagination (fixed) ========= */
const page = ref(1);
const pageSize = ref(10);

watch([search, selectedCategory, pageSize], () => {
	if (page.value !== 1) page.value = 1;
});

watch(
	[page, pageSize, search, selectedCategory],
	() => {
		productsStore.fetchList({
			page: page.value,
			limit: pageSize.value,
			search: search.value,
			category: selectedCategory.value || undefined,
			certification_uuid: "GLI",
		});
	},
	{ immediate: false }
);

watch([total, page, pageSize], () => {
	const maxPage = Math.max(1, Math.ceil((total.value || 0) / Math.max(1, pageSize.value)));
	if (page.value > maxPage) page.value = maxPage;
});

function useFallback(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}

const previewOpen = ref(false);
const previewSrc = ref(FALLBACK_IMG);
const previewAlt = ref("Product image");

function openPreview(src?: string | null, alt?: string) {
	previewSrc.value = getImageSrc(src);
	previewAlt.value = alt || "Product image";
	previewOpen.value = true;
}

function closePreview() {
	previewOpen.value = false;
}

function onEscClose(e: KeyboardEvent) {
	if (e.key === "Escape" && previewOpen.value) {
		closePreview();
	}
}

onMounted(() => window.addEventListener("keydown", onEscClose));
onBeforeUnmount(() => window.removeEventListener("keydown", onEscClose));


</script>

<template>
	<section class="py-12 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Controls -->
			<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
				<div class="flex-1">
					<input v-model="search" type="text" placeholder="Search product, company, category…" class="w-full pl-3 pr-3 py-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
				</div>

				<div class="flex flex-col sm:flex-row gap-3">
					<!-- Single-select Category -->
					<UiSearchableSelect :options="categorySelectOptions" v-model="selectedCategory" placeholder="All Categories" widthClass="sm:w-72" />

					<!-- Page size (single select) -->
					<UiSelect :options="[10, 20, 50, 100]" v-model="pageSize" :asNumber="true" :formatOption="(n) => `${n} / page`" widthClass="sm:w-36" />
				</div>
			</div>

			<!-- Table -->
			<div class="rounded-xl border border-gray-200 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full text-left text-sm">
						<thead class="bg-gray-50 text-gray-700">
							<tr>
								<th class="px-4 py-3 font-semibold"></th>
								<th class="px-4 py-3 font-semibold">Product</th>
								<th class="px-4 py-3 font-semibold">Status</th>
								<th class="px-4 py-3 font-semibold">Company</th>
								<th class="px-4 py-3 font-semibold">Category</th>
								<th class="px-4 py-3 font-semibold">Certification Date</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="pending">
								<td colspan="6" class="px-4 py-6 text-center text-gray-500">Loading products...</td>
							</tr>

							<tr v-for="(r, i) in cards" :key="r.id || i" class="border-t border-gray-100 text-gray-500 hover:bg-gray-50 align-middle">
								<!-- Product with thumbnail -->
								<td class="px-4 py-3">
									<button type="button" class="inline-flex max-h-14 max-w-[88px] items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-1 overflow-hidden cursor-zoom-in" @click="openPreview(r.image, r.title || 'Product image')">
										<img :src="getImageSrc(r.image)" :alt="r.title || 'Product image'" class="block h-auto w-auto max-h-12 max-w-20 object-contain" loading="lazy" decoding="async" @error="useFallback" />
									</button>
								</td>
								<td class="px-4 py-3 w-[150px]">
									<div class="flex items-start gap-3">
										<div>
											<NuxtLink :to="{ path: `/products/${r.slug || r.id}`, query: { uuid: r.id } }" class="font-semibold text-gray-900 whitespace-nowrap hover:text-emerald-700">
												{{ r.title }}
											</NuxtLink>
										</div>
									</div>
								</td>

								<td class="px-4 py-3 whitespace-nowrap">
									<UiBadge :value="r.status" />
								</td>
								<td class="px-4 py-3">{{ r.company }}</td>
								<td class="px-4 py-3 whitespace-nowrap">{{ r.category }}</td>
								<td class="px-4 py-3">
									{{ formatDate(r.certificationDate) }}
								</td>
							</tr>

							<tr v-if="!pending && cards.length === 0">
								<td colspan="6" class="px-4 py-6 text-center text-gray-500">No data found.</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Footer / pagination -->
			<UiPagination class="mt-3" v-model:page="page" :total-items="total || 0" :page-size="pageSize" :max-buttons="7" :show-edges="true" />
		</div>
	</section>

	<div v-if="previewOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" @click="closePreview">
		<div class="relative max-h-[90vh] max-w-[90vw] rounded-xl bg-white p-2" @click.stop>
			<button type="button" class="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-white text-gray-700 shadow cursor-pointer" @click="closePreview" aria-label="Close preview">✕</button>
			<img :src="previewSrc" :alt="previewAlt" class="max-h-[85vh] max-w-[88vw] object-contain" @error="useFallback" />
		</div>
	</div>
</template>
