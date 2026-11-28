// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: false },
	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		public: {
			apiBase: process.env.PUBLIC_API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE || "",
			appName: process.env.NUXT_PUBLIC_APP_NAME || "",
			clientId: process.env.PUBLIC_API_KEY_NAME || process.env.NUXT_PUBLIC_CLIENT_ID || "",
			clientPassword: process.env.PUBLIC_API_KEY_PASSWORD || process.env.NUXT_PUBLIC_CLIENT_PASSWORD || "",
			minioBaseUrl: process.env.NUXT_PUBLIC_MINIO_BASE_URL || "",
			minioProductFolder: process.env.NUXT_PUBLIC_MINIO_PRODUCT_FOLDER || "",
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	modules: ["@nuxt/fonts", "@nuxt/icon", "@vueuse/nuxt", "@pinia/nuxt", "nuxt-keen-slider"],
});
