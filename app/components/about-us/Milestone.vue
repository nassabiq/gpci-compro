<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useEventsStore } from "~/stores/events";

/* =========================
   Types
========================= */
type Milestone = {
	year: string;
	title: string;
	text: string;
};

const defaultItems: Milestone[] = [
	{
		year: "2015",
		title: "Foundation",
		text: "GPCI established as Indonesia's premier eco-certification body",
	},
	{
		year: "2017",
		title: "First Certifications",
		text: "Launched Green Label Indonesia with initial 25 certified products",
	},
	{
		year: "2019",
		title: "Industry Recognition",
		text: "Achieved national recognition and expanded to 100+ certified products",
	},
	{
		year: "2021",
		title: "Digital Transformation",
		text: "Launched digital certification platform and online verification system",
	},
];

/* =========================
   Props
========================= */
const props = withDefaults(
	defineProps<{
		items?: Milestone[];
		color?: string;
		dotSize?: "sm" | "md" | "lg";
		alternating?: boolean;
		dense?: boolean;
		glow?: boolean;
		reveal?: boolean;
	}>(),
	{
		color: "green",
		dotSize: "md",
		alternating: true,
		dense: false,
		glow: true,
		reveal: true,
	}
);

const eventsStore = useEventsStore();
const { items: apiItems, error: eventsError } = storeToRefs(eventsStore);

const timelineItems = computed<Milestone[]>(() => {
	if (props.items?.length) return props.items;
	if (apiItems.value?.length) return apiItems.value;
	return defaultItems;
});

/* =========================
   Util classes
========================= */
const dotClass = computed(() => {
	switch (props.dotSize) {
		case "sm":
			return "w-3 h-3 ring-4";
		case "lg":
			return "w-6 h-6 ring-8";
		default:
			return "w-5 h-5 ring-8";
	}
});

const colorBg = computed(() => `bg-${props.color}-600`);
const colorLine = computed(() => `bg-${props.color}-500`);
const colorText = computed(() => `text-${props.color}-600`);

/* =========================
   Reveal Animation
========================= */
const container = ref<HTMLElement | null>(null);
const cardEls = ref<HTMLElement[]>([]);

onMounted(() => {
	eventsStore.fetchList();

	if (!props.reveal || !container.value) return;

	// collect cards
	cardEls.value = Array.from(container.value.querySelectorAll<HTMLElement>("[data-card='true']"));

	// initial state
	cardEls.value.forEach((el) => {
		el.classList.add("opacity-0", "translate-y-6");
	});

	useIntersectionObserver(
		cardEls,
		(entries, observer) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					e.target.classList.remove("opacity-0", "translate-y-6");
					e.target.classList.add("opacity-100", "translate-y-0");
					observer.unobserve(e.target);
				}
			}
		},
		{ threshold: 0.15 }
	);
});
</script>

<template>
	<section id="timeline" class="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-gray-900">Our Journey</h2>
				<!-- <p v-if="eventsError" class="mt-3 text-sm text-amber-700">Events menampilkan data cadangan. API belum bisa diakses.</p> -->
			</div>

			<div class="relative" ref="container" aria-label="Company timeline">
				<!-- Garis tengah (desktop) -->
				<div class="hidden md:block absolute left-1/2 top-0 h-full w-1 -translate-x-1/2" :class="[colorLine, glow && 'shadow-[0_0_24px_var(--tw-shadow-color)]', glow && `shadow-${props.color}-400/50`]" />
				<!-- Garis kiri (mobile) -->
				<div class="md:hidden absolute left-4 top-0 h-full w-1" :class="[colorLine]" />

				<ol class="relative">
					<li v-for="(m, i) in timelineItems" :key="i" class="relative flex items-stretch" :class="[props.dense ? 'mb-10' : 'mb-16']">
						<!-- DOT di desktop (tengah) -->
						<div class="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 items-center justify-center">
							<span :class="['rounded-full border-4 border-white', colorBg, dotClass, glow && 'shadow-md']" />
						</div>
						<!-- DOT di mobile (kiri) -->
						<div class="md:hidden absolute left-4 -translate-x-1/2 z-10">
							<span :class="['rounded-full border-4 border-white', colorBg, dotClass]" />
						</div>

						<!-- CARD -->
						<div data-card="true" :class="['transition-all duration-500 will-change-transform', 'w-full md:w-1/2', props.alternating && i % 2 === 1 ? 'md:ml-auto md:pl-12' : 'md:pr-12']">
							<article class="bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] p-6 md:p-7">
								<div class="flex items-baseline gap-3">
									<p :class="['font-extrabold tracking-tight', colorText, 'text-xl']">
										{{ m.year }}
									</p>
									<h3 class="text-lg md:text-xl font-semibold text-gray-900">
										{{ m.title }}
									</h3>
								</div>
								<p class="text-gray-600 mt-2 leading-relaxed">
									{{ m.text }}
								</p>
							</article>
						</div>
					</li>
				</ol>
			</div>
		</div>
	</section>
</template>
