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
</script>

<template>
	<div class="min-h-screen">
		<ProductsHero :categories="dynamicCategories" :total="total || 0" />

		<TableProducts />

		<ProductsStats />
		<ProductsCta />
	</div>
</template>
