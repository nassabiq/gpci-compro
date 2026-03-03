<script setup lang="ts">
type CertItem = {
	greenPrefix?: string;
	title: string;
	description: string;
	image: string;
	ctaText: string;
	to?: string;
};

// === Data internal (tanpa props) ===
const heading = "The Certification";

const items: CertItem[] = [
	{
		greenPrefix: "Green",
		title: "Label Indonesia",
		description: "Green Label Indonesia is an environmental certification program developed by the Green Product Council Indonesia (GPCI) to recognize products that meet rigorous sustainability criteria across their life cycle. It is aligned with ISO 14024 (Type I Ecolabel) and acknowledged by the Global Ecolabelling Network (GEN).",
		image: "/img/gli.png", // ganti sesuai asetmu
		ctaText: "Certified Product GLI",
		// to: "/certifications/gli", // opsional
		to: "/products", // opsional
	},
	{
		greenPrefix: "Green",
		title: "Toll Road Indonesia",
		description: "Green Toll Road Indonesia (GTRI) is a sustainability certification for toll roads that meet rigorous environmental, social, and governance (ESG) criteria, developed by GPCI and aligned with ISO standards and the UN Sustainable Development Goals (SDGs).",
		image: "/img/gtri.png", // ganti sesuai asetmu
		ctaText: "Certified Product GTRI",
		to: "/certifications/gtri", // opsional
	},
];
</script>

<template>
	<section class="py-24 bg-gradient-to-br from-green-50 to-emerald-50" aria-labelledby="cert-heading">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 id="cert-heading" class="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10">
				{{ heading }}
			</h2>

			<!-- Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-16">
				<article v-for="(c, i) in items" :key="i" class="relative rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full">
					<!-- Logo overlap (tanpa bulat) -->
					<div class="absolute -top-14 left-1/2 -translate-x-1/2">
						<img :src="c.image" :alt="c.title" class="h-28 w-auto object-contain select-none" />
					</div>

					<!-- BODY: flex kolom + tinggi penuh -->
					<div class="px-6 pt-24 pb-6 flex flex-col h-full">
						<h3 class="text-2xl font-extrabold text-gray-900 leading-tight mb-3 space-x-2 text-center">
							<span v-if="c.greenPrefix" class="text-emerald-700">{{ c.greenPrefix }} </span>
							<span>{{ c.title }}</span>
						</h3>

						<p class="text-gray-600 leading-relaxed">
							{{ c.description }}
						</p>

						<!-- TOMBOL DITEKAN KE BAWAH -->
						<div class="mt-auto pt-6 text-center">
							<button type="button" class="inline-flex items-center rounded-full cursor-pointer bg-emerald-700 text-white px-4 py-2 text-sm font-medium shadow hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" @click="c.to && navigateTo(c.to)">
								{{ c.ctaText }}
							</button>
						</div>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>
