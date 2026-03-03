<script setup lang="ts">
import { Award } from "lucide-vue-next";

defineProps<{
	categories: { name: string; count: number; icon: any }[];
	total: number;
}>();
</script>

<template>
	<section class="relative py-24 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
			<div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
		</div>

		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<div class="space-y-8">
				<div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
					<Award class="w-5 h-5 text-yellow-400" />
					<span class="text-white font-medium">{{ total }}+ Certified Products</span>
				</div>

				<div class="space-y-4">
					<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
						Certified Sustainable
						<span class="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"> Products </span>
					</h1>
					<p class="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">Explore all the green products that have achieve Green Label Indonesia certification.</p>
				</div>
			</div>
		</div>
	</section>
</template>
