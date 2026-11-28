<script setup lang="ts">
import { ref, watch } from "vue";
import { Search, X } from "@lucide/vue";
import type { EditorialCategory } from "~/types/editorial";

const props = defineProps<{
	categories: EditorialCategory[];
	selectedCategory: string;
	searchQuery: string;
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:category", slug: string): void;
	(e: "update:search", query: string): void;
}>();

const localSearch = ref(props.searchQuery);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(
	() => props.searchQuery,
	(newVal) => {
		if (newVal !== localSearch.value) {
			localSearch.value = newVal;
		}
	}
);

function onInputSearch() {
	if (debounceTimer) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		emit("update:search", localSearch.value.trim());
	}, 350);
}

function clearSearch() {
	localSearch.value = "";
	if (debounceTimer) clearTimeout(debounceTimer);
	emit("update:search", "");
}

function selectCategory(slug: string) {
	emit("update:category", slug);
}
</script>

<template>
	<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 py-2">
		<!-- Left: Category Pills with Title -->
		<div class="flex flex-wrap items-center gap-2.5 overflow-x-auto no-scrollbar">
			<span class="text-base font-bold text-gray-900 mr-2 shrink-0">
				Explore by Category
			</span>

			<!-- "All" Pill -->
			<button
				type="button"
				class="rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
				:class="
					!selectedCategory
						? 'bg-[#004d35] text-white shadow-xs'
						: 'bg-gray-100/90 text-gray-700 hover:bg-gray-200'
				"
				@click="selectCategory('')"
			>
				All
			</button>

			<!-- Category Pills -->
			<button
				v-for="cat in categories"
				:key="cat.uuid || cat.slug"
				type="button"
				class="rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
				:class="
					selectedCategory === cat.slug || selectedCategory === cat.uuid
						? 'bg-[#004d35] text-white shadow-xs'
						: 'bg-gray-100/90 text-gray-700 hover:bg-gray-200'
				"
				@click="selectCategory(cat.slug)"
			>
				{{ cat.name }}
			</button>
		</div>

		<!-- Right: Pill Search Bar -->
		<div class="relative w-full lg:w-72 shrink-0">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
				<Search class="h-4 w-4 text-gray-400" />
			</div>
			<input
				v-model="localSearch"
				type="text"
				placeholder="Search articles, topics, or keywords..."
				class="w-full rounded-full bg-gray-100/90 border-0 py-2 pl-9 pr-8 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
				@input="onInputSearch"
			/>
			<button
				v-if="localSearch"
				type="button"
				aria-label="Hapus pencarian"
				class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click="clearSearch"
			>
				<X class="h-3.5 w-3.5" />
			</button>
		</div>
	</div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}
.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
