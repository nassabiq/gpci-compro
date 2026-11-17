<!-- src/pages/index.vue -->
<script setup lang="ts">
import {useHead} from "#imports";
import {ArrowRight} from "@lucide/vue";

useHead({
	title: "Premium Eco - Certification diganti jadi ",
	meta: [
		{name: "description", content: "GPCI menyediakan sertifikasi produk ramah lingkungan berkelas premium. Tingkatkan citra merek dan dampak keberlanjutan Anda."},
		{property: "og:title", content: "GPCI — Premium Eco-Certification"},
		{property: "og:description", content: "Sertifikasi produk ramah lingkungan untuk brand yang berorientasi keberlanjutan."},
		{property: "og:type", content: "website"},
		{property: "og:image", content: "/images/og-cover.jpg"},
		{name: "twitter:card", content: "summary_large_image"},
	],
	script: [
		{
			type: "application/ld+json",
			// JSON-LD Schema.org (Organization + WebSite)
			innerHTML: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Green Product Council Indonesia",
				url: "https://example.com",
				logo: "https://example.com/images/logo.png",
				sameAs: ["https://www.facebook.com/yourpage", "https://www.instagram.com/yourpage", "https://www.linkedin.com/company/yourpage"],
				contactPoint: [
					{
						"@type": "ContactPoint",
						email: "info@gpci.or.id",
						contactType: "Customer Service",
						areaServed: "ID",
					},
				],
			}),
		},
	],
});

/* =========================
	Types
========================= */
type Testimonial = {
	quote: string;
	name: string;
	role: string;
	company: string;
	avatar: string;
};

/* =========================
	Data
========================= */

const testimonials: ReadonlyArray<Testimonial> = [
	{
		quote: "Sertifikasi GPCI mendorong kami menata ulang supply chain dengan dampak positif yang terukur.",
		name: "A. Pratama",
		role: "Sustainability Lead",
		company: "PT Maju Hijau",
		avatar: "/images/avatars/1.jpg",
	},
	{
		quote: "Label hijau dari GPCI meningkatkan trust konsumen dan membuka pasar ekspor.",
		name: "S. Utami",
		role: "CMO",
		company: "Nusantara Goods",
		avatar: "/images/avatars/2.jpg",
	},
] as const;
</script>

<template>
	<div class="min-h-screen">
		<!-- ===== Hero ===== -->
		<HomeHero />

		<!-- ===== Sponsors ===== -->
		<HomeSponsorBanner />

		<!-- ===== Features ===== -->
		<HomeFeatures />

		<!-- ===== Certified Products ===== -->
		<LazyHomeProducts />

		<!-- ===== Testimonials ===== -->
		<!-- <section id="testimonials" class="py-24 bg-white">
			<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-12">
					<h2 class="text-4xl font-bold text-gray-900">What Our Partners Say</h2>
					<p class="text-gray-600">Cerita nyata dari brand yang tumbuh bersama GPCI.</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<article v-for="(t, i) in testimonials" :key="i" class="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
						<Quote class="w-8 h-8 text-green-600 mb-4" />
						<p class="text-gray-700 leading-relaxed mb-6">“{{ t.quote }}”</p>
						<div class="flex items-center gap-4">
							<img :src="t.avatar" :alt="t.name" class="w-12 h-12 rounded-full object-cover" loading="lazy" decoding="async" />
							<div>
								<div class="font-semibold text-gray-900">{{ t.name }}</div>
								<div class="text-sm text-gray-600">{{ t.role }} — {{ t.company }}</div>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section> -->

		<!-- ===== CTA Final ===== -->
		<TableProducts />
		<!-- bg-gradient-to-br from-green-50 to-emerald-50 -->
		<!-- <section class="py-24 bg-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div class="max-w-4xl mx-auto">
					<h2 class="text-4xl md:text-5xl text-gray-800 font-bold mb-6">Ready to Transform Your Brand?</h2>
					<p class="text-xl text-gray-700 mb-8">Mulai perjalanan sertifikasi Anda sekarang dan raih kredensial keberlanjutan premium.</p>
					<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
						<NuxtLink to="/certification" class="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition"> Get Certified Now <ArrowRight class="ml-2 w-5 h-5" /> </NuxtLink>
						<NuxtLink to="/contact" class="inline-flex items-center justify-center border-2 border-green-400 text-green-600 hover:bg-green-200 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl"> Contact Our Experts </NuxtLink>
					</div>
				</div>
			</div>
		</section> -->
	</div>
</template>
