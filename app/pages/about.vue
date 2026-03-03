<script setup lang="ts">
useHead({
	title: "About — GPCI",
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
</script>

<template>
	<div class="min-h-screen">
		<AboutUsHero />
		<AboutUsCertification />
		<AboutUsPrinciples />
		<!-- <AboutUsVisionMission /> -->
		<AboutUsMilestone />
		<AboutUsFaq />
		<!-- lanjutkan section about lainnya di bawah -->
	</div>
</template>
