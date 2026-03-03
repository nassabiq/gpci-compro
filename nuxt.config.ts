// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
																compatibilityDate: "2025-07-15",
																devtools: {enabled: false},
																css: ["~/assets/css/main.css"],
																runtimeConfig: {
																																public: {
																																																apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
																																																appName: process.env.NUXT_PUBLIC_APP_NAME || "",
																																																clientId: process.env.NUXT_PUBLIC_CLIENT_ID || "",
																																																clientPassword: process.env.NUXT_PUBLIC_CLIENT_PASSWORD || "",
																																																minioBaseUrl: process.env.NUXT_PUBLIC_MINIO_BASE_URL || "",
																																																minioProductFolder: process.env.NUXT_PUBLIC_MINIO_PRODUCT_FOLDER || "",
																																},
																},
																vite: {
																																plugins: [tailwindcss()],
																},

																modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxt/content", "@vueuse/nuxt", "@pinia/nuxt", "nuxt-keen-slider"],
});
