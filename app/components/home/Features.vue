<script lang="ts" setup>
import {CheckCircle, HeartHandshake, Leaf, TrendingUp} from "@lucide/vue";

/* =========================
	Types
========================= */
type Feature = {icon: Component; title: string; description: string[]; image: string};

/* =========================
	Data
========================= */

const features: ReadonlyArray<Feature> = [
	{
		icon: CheckCircle,
		title: "Unmatched Credibility",
		description: ["Most Certified Brands in Indonesia: GPCI holds the highest number of certified products under Green Label Indonesia (GLI) and Green Toll Road Indonesia (GTRI), making us the most trusted ecolabel body in the country.", "Government & Industry Recognition: Our certification is aligned with national sustainability goals and widely recognized across sectors."],
		image: "/img/features/img-1.jpg",
	},
	{
		icon: TrendingUp,
		title: "Rigorous & Transparent Standards",
		description: ["Science-Based Criteria: Our assessments are grounded in internationally accepted environmental standards and lifecycle analysis.", "Independent Verification: Every certification is backed by impartial evaluation, ensuring integrity and trust."],
		image: "/img/features/img-2.jpg",
	},
	{
		icon: HeartHandshake,
		title: "Partner in Sustainable Growth",
		description: ["Science-Based Criteria: Our assessments are grounded in internationally accepted environmental standards and lifecycle analysis.", "Guidance & Support: From application to certification, our team provides clear, responsive support to make the process smooth and rewarding."],
		image: "/img/features/img-3.jpg",
	},
	{
		icon: Leaf,
		title: "Driving National Sustainability",
		description: ["Impact Beyond Labels: GPCI contributes to Indonesia’s green economy by promoting responsible production and consumption.", "Collaborative Ecosystem: We work with government, academia, and industry to advance sustainable innovation."],
		image: "/img/features/img-4.jpg",
	},
] as const;
</script>
<template>
	<div>
		<section id="features" class="pb-24 pt-16 bg-white">
			<div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose GPCI Certification?</h2>
					<p class="text-xl text-gray-600 max-w-3xl mx-auto">Experience the pinnacle of environmental certification with our comprehensive, internationally recognized standards that set your brand apart.</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
					<div v-for="(feature, index) in features" :key="index" class="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
						<div class="relative z-10 flex flex-col h-full">
							<div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								<component :is="feature.icon" class="w-8 h-8 text-white" />
							</div>
							<h3 class="text-2xl font-bold text-gray-900 mb-4">{{ feature.title }}</h3>
							<ul class="space-y-2 text-gray-700 mb-6">
								<li v-for="(b, i) in feature.description" :key="i" class="flex items-start gap-2 leading-relaxed">
									<span class="mt-2 size-1.5 rounded-full bg-emerald-600 shrink-0"></span>
									<span class="text-gray-600">{{ b }}</span>
								</li>
							</ul>
							<!-- image selalu di bawah -->
							<div class="aspect-video rounded-lg overflow-hidden mt-auto">
								<img :src="feature.image" :alt="feature.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
							</div>
							<!-- <NuxtLink to="/certification" class="inline-flex items-center text-green-600 hover:text-green-700"> Learn More <ArrowRight class="ml-2 w-4 h-4" /> </NuxtLink> -->
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style></style>
