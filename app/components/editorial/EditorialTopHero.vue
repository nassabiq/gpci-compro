<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";

function scrollToArticles() {
	if (typeof window !== "undefined") {
		const target = document.getElementById("featured-section") || document.getElementById("articles-section");
		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
		}
	}
}
</script>

<template>
	<section
		aria-label="Editorial Header"
		class="relative overflow-hidden bg-gradient-to-r from-[#033e2a] via-[#054d35] to-[#022e1f] text-white pt-28 pb-14 sm:pt-36 sm:pb-20"
	>
		<!-- Background ambient leaf glow -->
		<div class="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
		<div class="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"></div>

		<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
				<!-- Left Text Column -->
				<div class="lg:col-span-7 space-y-5">
					<p class="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
						EDITORIAL
					</p>

					<h1 class="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.18] max-w-2xl">
						Sustainability Insights, Industry Trends, and Green Certification Updates from GPCI.
					</h1>

					<p class="text-sm sm:text-base text-emerald-100/80 font-normal leading-relaxed max-w-xl">
						Explore stories, ideas, and developments shaping a greener, healthier Indonesia through certified products and responsible practices.
					</p>

					<div class="pt-2">
						<button
							type="button"
							class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-950/30 hover:shadow-emerald-500/25 transition-all duration-300 cursor-pointer"
							@click="scrollToArticles"
						>
							<span>Read Latest Articles</span>
							<ArrowRight class="h-4 w-4" />
						</button>
					</div>
				</div>

				<!-- Right Illustration Column -->
				<div class="lg:col-span-5 flex justify-center lg:justify-end">
					<div class="relative max-w-md w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10 group">
						<img
							src="/img/editorial/hero-globe.jpg"
							alt="Small Changes Make a Greener Tomorrow - GPCI"
							class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
