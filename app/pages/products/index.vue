<script setup lang="ts">
useHead({ title: "Products" });

import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useProductsStore } from "~/stores/products";

// ikon untuk mapping kategori
import { Building, Home, Sparkles, Award } from "lucide-vue-next";

const productsStore = useProductsStore();
const { cards, pending, error, total } = storeToRefs(productsStore);

const page = ref(1);
const limit = ref(10);

onMounted(async () => {
	await productsStore.fetchList({ page: page.value, limit: limit.value });
});

// kategori dinamis dari store + ikon
const iconsMap: Record<string, any> = {
	All: Sparkles,
	"Building Materials": Building,
	"Home & Living": Home,
	"Consumer Goods": Award,
	Industrial: Building,
};

const dynamicCategories = computed(() => {
	const base = productsStore.categoriesFromList; // [{name, count}]
	const totalCount = base.reduce((acc: number, c: any) => acc + c.count, 0);
	const items = [{ name: "All", count: totalCount }, ...base];
	return items.map((c) => ({ ...c, icon: iconsMap[c.name] ?? Sparkles }));
});

// ── Tab state ──
const activeTab = ref<"GLI" | "GTRI">("GLI");

const tabs = [
	{ key: "GLI" as const, label: "Green Label Indonesia" },
	{ key: "GTRI" as const, label: "Green Toll Road Indonesia" },
];
</script>

<template>
	<div class="min-h-screen">
		<ProductsHero :categories="dynamicCategories" :total="total || 0" />

		<!-- Tab Switcher -->
		<section class="bg-white pt-8">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-center">
					<div class="inline-flex rounded-lg bg-gray-100 p-1 gap-1">
						<button v-for="tab in tabs" :key="tab.key" :class="[
							'px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer',
							activeTab === tab.key
								? 'bg-emerald-600 text-white shadow-sm'
								: 'text-gray-600 hover:text-gray-900 hover:bg-gray-200',
						]" @click="activeTab = tab.key">
							{{ tab.label }}
						</button>
					</div>
				</div>
			</div>
		</section>

		<!-- Tab Content -->
		<div class="bg-white">
			<transition name="tab-fade" mode="out-in">
				<TableProducts v-if="activeTab === 'GLI'" key="GLI" certification-uuid="GLI" />
				<TableProducts v-else key="GTRI" certification-uuid="GTRI" />
			</transition>
		</div>

		<ProductsStats />
		<ProductsCta />
	</div>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
	transition: opacity 0.2s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
	opacity: 0;
}
</style>
