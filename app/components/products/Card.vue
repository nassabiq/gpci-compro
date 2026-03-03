<script setup lang="ts">
import {CheckCircle, Star, ArrowRight, Award} from "lucide-vue-next";

defineProps<{
	product: any;
}>();

function renderStars(rating: number) {
	return Array.from({length: 5}, (_, i) => i < rating);
}
</script>

<template>
	<div class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
		<div class="aspect-video overflow-hidden relative">
			<template v-if="product.image">
				<img :src="product.image && product.image.trim() !== '' ? product.image : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23e5e7eb%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%236b7280%22 dy=%22.3em%22 font-size=%2220%22 text-anchor=%22middle%22%3ENo%20Image%3C/text%3E%3C/svg%3E'" :alt="product.title || product.category || 'No image'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
			</template>
			<template v-else>
				<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No image</div>
			</template>

			<div class="absolute top-4 left-4 flex items-center space-x-2">
				<div class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
					<CheckCircle class="w-3 h-3" />
					<span>Certified</span>
				</div>
				<div class="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
					{{ product.certificationDate || "—" }}
				</div>
			</div>
		</div>

		<div class="p-6">
			<h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
				{{ product.title }}
			</h3>
			<p class="text-green-600 font-medium mb-1">
				{{ product.company || "—" }}
			</p>

			<div class="flex items-center space-x-1 mb-3">
				<template v-for="(filled, idx) in renderStars(Number(product.rating || 4))" :key="idx">
					<Star class="w-4 h-4" :class="filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'" />
				</template>
				<span class="text-sm text-gray-500 ml-2"> ({{ Number(product.rating || 4).toFixed(1) }}) </span>
			</div>

			<p class="text-gray-600 mb-4 leading-relaxed">
				{{ product.description }}
			</p>

			<div class="flex space-x-3">
				<NuxtLink :to="{ path: `/products/${product.slug || product.id}`, query: { uuid: product.id } }" class="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition">
					View Details
					<ArrowRight class="ml-2 w-4 h-4" />
				</NuxtLink>

				<button class="border border-green-600 text-green-700 hover:bg-green-50 px-3 py-2 rounded-lg transition">
					<Award class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
