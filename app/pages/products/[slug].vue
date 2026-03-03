<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Building2, CalendarDays, CheckCircle2, Package, Tag } from "lucide-vue-next";
import type { Product } from "~/data/products";
import { useProductsStore } from "~/stores/products";

const route = useRoute();
const productsStore = useProductsStore();

const uuid = computed(() => String(route.query.uuid ?? "").trim());
const product = ref<Product | null>(null);
const loadError = ref<string | null>(null);
const detailLoading = ref(false);

const FALLBACK_IMG = "/img/empty-image.png";

function useFallback(e: Event) {
	const img = e.target as HTMLImageElement;
	img.onerror = null;
	img.src = FALLBACK_IMG;
}

async function loadDetail() {
	if (!uuid.value) {
		loadError.value = "Product not found.";
		return;
	}
	loadError.value = null;
	detailLoading.value = true;
	try {
		product.value = await productsStore.fetchById(uuid.value);
		if (!product.value) loadError.value = "Product not found.";
	} catch (e: any) {
		loadError.value = e?.message ?? "Failed to load product detail.";
		product.value = null;
	} finally {
		detailLoading.value = false;
	}
}

watch(() => uuid.value, () => loadDetail(), { immediate: true });

const productImages = computed<string[]>(() => {
	if (!product.value) return [];
	if (product.value.images?.length) return product.value.images;
	if (product.value.image) return [product.value.image];
	return [];
});

const breadcrumbs = computed(() => {
	const items: { label: string; to?: string }[] = [
		{ label: "Home", to: "/" },
		{ label: "Certified Products", to: "/products" },
	];
	if (product.value?.title) {
		items.push({ label: product.value.title });
	}
	return items;
});

useHead(() => ({
	title: product.value?.title ? `${product.value.title} - Product Detail` : "Product Detail",
}));
</script>

<template>
	<div class="min-h-screen">
		<!-- Product Detail Section -->
		<section class="pt-28 pb-12 bg-white min-h-screen">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<UiBreadcrumb :items="breadcrumbs" />

				<div v-if="detailLoading && !product" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
					Memuat detail produk...
				</div>
				<div v-else-if="loadError" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
					{{ loadError }}
				</div>
				<div v-else-if="product" class="grid grid-cols-1 gap-6 lg:grid-cols-5">
					<!-- Image Slider -->
					<div class="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 lg:p-6 shadow-sm">
						<UiImageSlider :images="productImages" :alt="product.title || 'Product image'" />
					</div>

					<div class="lg:col-span-2 space-y-4">
						<div class="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
							<div class="flex flex-wrap items-center gap-2">
								<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
									<CheckCircle2 class="h-3.5 w-3.5" />
									Certified
								</span>
								<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
									{{ product.category || "Uncategorized" }}
								</span>
							</div>

							<h1 class="mt-4 text-2xl lg:text-3xl font-bold leading-tight text-slate-900">
								{{ product.title }}
							</h1>

							<div class="mt-5 space-y-3 text-sm">
								<div class="flex items-start gap-2 text-slate-700">
									<Building2 class="h-4 w-4 mt-0.5 text-emerald-700" />
									<div>
										<div class="text-slate-500">Perusahaan</div>
										<div class="font-medium text-slate-900">{{ product.company || "-" }}</div>
									</div>
								</div>
								<div class="flex items-start gap-2 text-slate-700">
									<Tag class="h-4 w-4 mt-0.5 text-emerald-700" />
									<div>
										<div class="text-slate-500">Kategori</div>
										<div class="font-medium text-slate-900">{{ product.category || "-" }}</div>
									</div>
								</div>
								<div class="flex items-start gap-2 text-slate-700">
									<CalendarDays class="h-4 w-4 mt-0.5 text-emerald-700" />
									<div>
										<div class="text-slate-500">Tanggal Sertifikasi</div>
										<div class="font-medium text-slate-900">{{ formatDate(product.certificationDate) }}</div>
									</div>
								</div>
								<div class="flex items-start gap-2 text-slate-700">
									<Package class="h-4 w-4 mt-0.5 text-emerald-700" />
									<div>
										<div class="text-slate-500">ID Produk</div>
										<div class="font-medium text-slate-900 break-all">{{ product.id }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
						<h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
							Deskripsi Produk
						</h2>
						<p class="mt-3 text-slate-700 leading-relaxed" v-html="product.description || '-'"></p>
					</div>

					<div v-if="product.features?.length" class="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-sm">
						<h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
							Fitur Produk
						</h2>
						<ul class="mt-3 space-y-2 text-sm text-slate-700">
							<li v-for="(feature, i) in product.features" :key="i" class="flex items-start gap-2">
								<CheckCircle2 class="h-4 w-4 mt-0.5 text-emerald-700 shrink-0" />
								<span>{{ feature }}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
