<script setup lang="ts">
import { ref } from "vue";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "@lucide/vue";
import { useEditorialStore } from "~/stores/editorial";

const editorialStore = useEditorialStore();

const email = ref("");
const status = ref<"idle" | "loading" | "success" | "error">("idle");
const feedbackMessage = ref("");
const validationError = ref("");

function validateEmail(val: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

async function handleSubscribe() {
	validationError.value = "";
	feedbackMessage.value = "";

	const trimmed = email.value.trim();
	if (!trimmed) {
		validationError.value = "Email is required.";
		status.value = "error";
		return;
	}

	if (!validateEmail(trimmed)) {
		validationError.value = "Please enter a valid email address.";
		status.value = "error";
		return;
	}

	status.value = "loading";

	try {
		const res = await editorialStore.subscribeNewsletter(trimmed);
		if (res.success) {
			status.value = "success";
			feedbackMessage.value = res.message;
			email.value = "";
		} else {
			status.value = "error";
			if (res.errors?.email?.length) {
				validationError.value = res.errors.email[0];
			} else {
				feedbackMessage.value = res.message || "Failed to subscribe. Please try again.";
			}
		}
	} catch (err: any) {
		status.value = "error";
		feedbackMessage.value = err?.message || "An error occurred while processing subscription.";
	}
}
</script>

<template>
	<section
		aria-label="Newsletter Subscription"
		class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#edf8f2] via-[#eaf6ef] to-[#e4f3eb] border border-[#cbe8d7] p-5 sm:p-6 lg:px-8 lg:py-5 shadow-xs"
	>
		<!-- Background Decorative Soft Leaves -->
		<div class="pointer-events-none absolute -bottom-5 -left-5 w-24 h-24 text-emerald-600/10 select-none">
			<svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full transform -rotate-12">
				<path d="M0 100 C 20 60, 60 40, 100 30 C 90 70, 60 90, 0 100 Z" />
				<path d="M10 100 C 40 70, 70 50, 100 40 C 80 80, 50 95, 10 100 Z" opacity="0.6" />
			</svg>
		</div>
		<div class="pointer-events-none absolute -bottom-6 -right-4 w-28 h-28 text-emerald-600/10 select-none">
			<svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full transform rotate-12">
				<path d="M100 100 C 70 60, 40 40, 0 50 C 30 20, 70 40, 100 100 Z" />
				<path d="M80 100 C 60 70, 40 60, 10 70 C 40 45, 70 60, 80 100 Z" opacity="0.7" />
			</svg>
		</div>

		<div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-6">
			<!-- Left: Mail Icon & Text -->
			<div class="flex items-center gap-3.5 sm:gap-4 text-left w-full lg:w-auto">
				<div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#009b62] text-white flex items-center justify-center shrink-0 shadow-sm">
					<Mail class="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.8]" />
				</div>
				<div>
					<h3 class="text-base sm:text-lg font-bold text-[#112d21] leading-snug tracking-tight">
						Stay Updated with Sustainability Insights
					</h3>
					<p class="text-xs sm:text-[13px] text-[#4f6e5f] mt-0.5 leading-normal">
						Get the latest editorial articles, industry reports, and certification updates directly in your inbox.
					</p>
				</div>
			</div>

			<!-- Center/Right: Subscription Form or Success + Leaf Badge -->
			<div class="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0">
				<!-- Success State -->
				<div
					v-if="status === 'success'"
					class="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 bg-white/90 px-4 py-2.5 rounded-full border border-emerald-200 shadow-2xs"
				>
					<CheckCircle2 class="h-4 w-4 text-emerald-600 shrink-0" />
					<span>{{ feedbackMessage }}</span>
				</div>

				<!-- Form State -->
				<form
					v-else
					@submit.prevent="handleSubscribe"
					class="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto"
				>
					<div class="relative w-full sm:w-52 md:w-60">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<Mail class="h-4 w-4 text-gray-400" />
						</div>
						<input
							v-model="email"
							type="email"
							placeholder="Your email address"
							:disabled="status === 'loading'"
							class="w-full rounded-full bg-white border border-gray-200/90 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009b62]/40 focus:border-[#009b62] shadow-2xs transition"
						/>
					</div>

					<button
						type="submit"
						:disabled="status === 'loading'"
						class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#009b62] hover:bg-[#008755] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs disabled:opacity-60"
					>
						<Loader2 v-if="status === 'loading'" class="h-4 w-4 animate-spin" />
						<span>{{ status === 'loading' ? 'Subscribing...' : 'Subscribe' }}</span>
					</button>
				</form>

				<!-- Far Right Leaf Badge -->
				<div class="hidden sm:flex items-center gap-2 text-left shrink-0 pl-1 lg:pl-2">
					<svg
						class="h-8 w-8 shrink-0 drop-shadow-2xs"
						viewBox="0 0 36 36"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M16 4C25 6 28 16 25 22C20 27 12 25 9 19C7 14 11 7 16 4Z"
							fill="url(#leafGrad)"
						/>
						<path
							d="M9 32C10 26 12 22 16 16C19 12 22 8 24 5"
							stroke="#3b965d"
							stroke-width="1.2"
							stroke-linecap="round"
						/>
						<path
							d="M12 21C15 17 18 13 22 7"
							stroke="white"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-opacity="0.8"
						/>
						<path
							d="M15 17C17 18 19 18 22 17"
							stroke="white"
							stroke-width="0.8"
							stroke-linecap="round"
							stroke-opacity="0.6"
						/>
						<path
							d="M17 14C19 15 22 14 24 12"
							stroke="white"
							stroke-width="0.8"
							stroke-linecap="round"
							stroke-opacity="0.6"
						/>
						<path
							d="M13 19C11 20 10 21 9 20"
							stroke="white"
							stroke-width="0.8"
							stroke-linecap="round"
							stroke-opacity="0.6"
						/>
						<defs>
							<linearGradient id="leafGrad" x1="9" y1="24" x2="26" y2="6" gradientUnits="userSpaceOnUse">
								<stop stop-color="#66c489" />
								<stop offset="1" stop-color="#8fdbab" />
							</linearGradient>
						</defs>
					</svg>
					<div class="text-[10px] leading-[1.18] text-[#3d5348] font-medium tracking-tight">
						<div>Knowledge</div>
						<div>Today</div>
						<div>A Greener</div>
						<div>Tomorrow</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Validation Error Message -->
		<div
			v-if="validationError || (status === 'error' && feedbackMessage)"
			class="relative z-10 mt-2 text-center lg:text-right text-xs text-red-600 flex items-center justify-end gap-1"
		>
			<AlertCircle class="h-3.5 w-3.5 shrink-0" />
			<span>{{ validationError || feedbackMessage }}</span>
		</div>
	</section>
</template>
