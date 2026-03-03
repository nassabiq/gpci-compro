<!-- src/components/AppFooter.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useHead } from "#imports";

import { Leaf, Award, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-vue-next";

// useHead({title: "Footer"});

const email = ref("");
const year = new Date().getFullYear();

function subscribe() {
	// TODO: ganti dengan aksi nyata (fetch ke API / newsletter service)
	if (!email.value || !/.+@.+\..+/.test(email.value)) {
		console.warn("Email tidak valid");
		return;
	}
	console.log("Subscribe:", email.value);
	email.value = "";
}
</script>

<template>
	<footer class="bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
		<!-- Main Footer Content -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<!-- Company Info -->
				<div class="space-y-6">
					<div class="flex items-center space-x-3">
						<div class="relative">
							<div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
								<Leaf class="w-6 h-6 text-white" />
							</div>
							<div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
								<Award class="w-2 h-2 text-white" />
							</div>
						</div>
						<div>
							<h3 class="text-xl font-bold">GPCI</h3>
							<p class="text-sm text-gray-300">Green Product Council Indonesia</p>
						</div>
					</div>

					<p class="text-gray-300 leading-relaxed">Leading Indonesia's sustainable future through eco-certification. Empowering businesses to achieve environmental excellence since 2015.</p>

					<div class="flex space-x-4">
						<a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
							<Facebook class="w-5 h-5" />
						</a>
						<a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
							<Twitter class="w-5 h-5" />
						</a>
						<a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="LinkedIn">
							<Linkedin class="w-5 h-5" />
						</a>
						<a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
							<Instagram class="w-5 h-5" />
						</a>
					</div>
				</div>

				<!-- Quick Links -->
				<div class="space-y-6">
					<h4 class="text-lg font-semibold">Quick Links</h4>
					<nav class="space-y-3">
						<NuxtLink to="/about" class="block text-gray-300 hover:text-white transition-colors"> About GPCI </NuxtLink>
						<!-- <NuxtLink to="/certification" class="block text-gray-300 hover:text-white transition-colors"> Certification Process </NuxtLink> -->
						<NuxtLink to="/products" class="block text-gray-300 hover:text-white transition-colors"> Certified Products </NuxtLink>
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> News &amp; Events </a>
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> Resources </a>
					</nav>
				</div>

				<!-- Services -->
				<div class="space-y-6">
					<h4 class="text-lg font-semibold">Our Services</h4>
					<nav class="space-y-3">
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> Green Label Certification </a>
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> Environmental Auditing </a>
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> Sustainability Consulting </a>
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> Training &amp; Workshops </a>
						<a href="#" class="block text-gray-300 hover:text-white transition-colors"> Research &amp; Development </a>
					</nav>
				</div>

				<!-- Contact Info -->
				<div class="space-y-6">
					<h4 class="text-lg font-semibold">Contact Us</h4>
					<div class="space-y-4">
						<div class="flex items-start space-x-3">
							<MapPin class="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
							<div>
								<p class="text-gray-300">Jakarta, Indonesia</p>
							</div>
						</div>
						<div class="flex items-center space-x-3">
							<Mail class="w-5 h-5 text-green-400 flex-shrink-0" />
							<a href="mailto:info@gpci.or.id" class="text-gray-300 hover:text-white transition-colors"> info@gpci.or.id </a>
						</div>
						<div class="flex items-center space-x-3">
							<Phone class="w-5 h-5 text-green-400 flex-shrink-0" />
							<a href="tel:+62" class="text-gray-300 hover:text-white transition-colors"> +62 851 7547 1955 </a>
						</div>
					</div>

					<!-- Newsletter -->
					<!-- <div class="pt-4 border-t border-gray-700">
						<h5 class="font-medium mb-3">Stay Updated</h5>
						<div class="flex space-x-2">
							<input v-model="email" type="email" placeholder="Your email" class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400" />
							<button type="button" @click.prevent="subscribe" class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 rounded-lg hover:from-green-600 hover:to-green-800 transition-all">Subscribe</button>
						</div>
					</div> -->
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-gray-700">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
						<p>&copy; {{ year }} Green Product Council Indonesia. All rights reserved.</p>
						<div class="flex space-x-6">
							<a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
							<a href="#" class="hover:text-white transition-colors">Terms of Service</a>
							<a href="#" class="hover:text-white transition-colors">Cookie Policy</a>
						</div>
					</div>
					<div class="flex items-center space-x-4 text-sm text-gray-400">
						<span>Certified by:</span>
						<div class="flex items-center space-x-2">
							<div class="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
								<Award class="w-3 h-3 text-white" />
							</div>
							<span>ISO 14001</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>
