<!-- src/components/AppHeader.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "#imports";
import { Menu, X, Leaf, Award, Globe } from "lucide-vue-next";

type NavItem = { name: string; path: string };

interface Props {
	startTransparent?: boolean;
}

const props = withDefaults(defineProps<Props>(), { startTransparent: false });

const isMenuOpen = ref<boolean>(false);
const isScrolled = ref<boolean>(false);
const route = useRoute();

const navItems: ReadonlyArray<NavItem> = [
	{ name: "Home", path: "/" },
	{ name: "About Us", path: "/about" },
	{ name: "Certified Products", path: "/products" },
] as const;

const isActive = (path: string): boolean => {
	if (path === "/") return route.path === "/";
	return route.path === path || route.path.startsWith(`${path}/`);
};

const headerClasses = computed<string[]>(() => ["fixed top-0 left-0 right-0 z-50 transition-all duration-300", isScrolled.value ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100" : "bg-transparent"]);
const titleClass = computed<string[]>(() => [isScrolled.value ? "text-gray-600" : "text-white"]);

const handleScroll = (): void => {
	if (!props.startTransparent) {
		isScrolled.value = true; // non-landing selalu solid
		return;
	}
	if (process.client) {
		isScrolled.value = window.scrollY > 20;
	}
};

onMounted((): void => {
	handleScroll();
	if (process.client) window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount((): void => {
	if (process.client) window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
	<header :class="headerClasses">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-20">
				<!-- Logo -->
				<NuxtLink to="/" class="flex items-center space-x-3 group">
					<img src="/img/gpci.png" class="w-12 h-12" alt="" />
					<div class="hidden sm:block">
						<!-- <h1 class="text-xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">GPCI</h1> -->
						<p :class="titleClass" class="text-base -mt-1">Green Product Council Indonesia</p>
					</div>
				</NuxtLink>

				<!-- Desktop Navigation -->
				<nav class="hidden lg:flex items-center space-x-8">
					<NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" :class="['relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-green-700', isActive(item.path) ? 'text-green-700' : isScrolled ? 'text-gray-700' : 'text-white']">
						{{ item.name }}
						<div v-if="isActive(item.path)" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-800 rounded-full" />
					</NuxtLink>
				</nav>

				<!-- CTA Buttons (Desktop) -->
				<div class="hidden lg:flex items-center space-x-4">
					<!-- <button type="button" class="border border-green-600 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm inline-flex items-center">
						<Globe class="w-4 h-4 mr-2" />
						EN
					</button> -->
					<a href="https://client.gpci.or.id" target="_blank" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 shadow-lg hover:shadow-xl transition-all duration-300">Get Certified</a>
				</div>

				<!-- Mobile Menu Button -->
				<button type="button" @click="isMenuOpen = !isMenuOpen" class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
					<X v-if="isMenuOpen" class="w-6 h-6 text-gray-700" />
					<Menu v-else :class="['w-6 h-6', isScrolled ? 'text-gray-700' : 'text-white']" />
				</button>
			</div>

			<!-- Mobile Menu -->
			<div v-if="isMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100">
				<nav class="px-4 py-6 space-y-4">
					<NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" @click="isMenuOpen = false" :class="['block px-3 py-2 text-base font-medium rounded-lg transition-colors', isActive(item.path) ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700 hover:bg-green-50']">
						{{ item.name }}
					</NuxtLink>

					<div class="pt-4 border-t border-gray-200 space-y-3">
						<button type="button" class="w-full border border-green-600 text-green-700 hover:bg-green-50 px-3 py-2 rounded-lg text-sm inline-flex items-center justify-center">
							<Globe class="w-4 h-4 mr-2" />
							English
						</button>
						<button type="button" class="w-full px-4 py-2 cursor-pointer rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900">Get Certified</button>
					</div>
				</nav>
			</div>
		</div>
	</header>
</template>
