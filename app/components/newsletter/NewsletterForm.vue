<script setup lang="ts">
import { ref } from "vue";
import { CheckCircle2, AlertCircle, Loader2, Send } from "@lucide/vue";
import { useEditorialStore } from "~/stores/editorial";

const props = withDefaults(
	defineProps<{
		layout?: "inline" | "stacked";
		placeholder?: string;
		buttonText?: string;
		dark?: boolean;
	}>(),
	{
		layout: "inline",
		placeholder: "Masukkan alamat email Anda...",
		buttonText: "Langganan",
		dark: false,
	}
);

const editorialStore = useEditorialStore();

const email = ref("");
const status = ref<"idle" | "loading" | "success" | "error">("idle");
const feedbackMessage = ref("");
const validationError = ref("");

function validateEmail(val: string): boolean {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(val);
}

async function handleSubscribe() {
	validationError.value = "";
	feedbackMessage.value = "";

	const trimmed = email.value.trim();
	if (!trimmed) {
		validationError.value = "Email wajib diisi.";
		status.value = "error";
		return;
	}

	if (!validateEmail(trimmed)) {
		validationError.value = "Format email tidak valid.";
		status.value = "error";
		return;
	}

	status.value = "loading";

	try {
		const result = await editorialStore.subscribeNewsletter(trimmed);
		if (result.success) {
			status.value = "success";
			feedbackMessage.value = result.message;
			email.value = "";
		} else {
			status.value = "error";
			if (result.errors?.email?.length) {
				validationError.value = result.errors.email[0];
			} else {
				feedbackMessage.value = result.message || "Gagal berlangganan. Silakan coba lagi.";
			}
		}
	} catch (err: any) {
		status.value = "error";
		feedbackMessage.value = err?.message || "Terjadi kesalahan saat memproses langganan.";
	}
}
</script>

<template>
	<div class="w-full">
		<!-- Success State Banner -->
		<div
			v-if="status === 'success'"
			class="rounded-xl p-4 flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
		>
			<CheckCircle2 class="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
			<div class="text-sm">
				<p class="font-semibold">Berhasil Berlangganan!</p>
				<p class="mt-0.5">{{ feedbackMessage }}</p>
			</div>
		</div>

		<!-- Subscription Form -->
		<form v-else @submit.prevent="handleSubscribe" class="space-y-2">
			<div
				:class="[
					layout === 'inline' ? 'flex flex-col sm:flex-row gap-2' : 'flex flex-col gap-2.5',
				]"
			>
				<div class="relative flex-1">
					<input
						v-model="email"
						type="email"
						:placeholder="placeholder"
						:disabled="status === 'loading'"
						:class="[
							'w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition shadow-xs',
							dark
								? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
								: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
							validationError ? 'border-red-500 ring-2 ring-red-500/20' : '',
						]"
					/>
				</div>

				<button
					type="submit"
					:disabled="status === 'loading'"
					:class="[
						'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
						dark
							? 'bg-emerald-600 hover:bg-emerald-500'
							: 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800',
					]"
				>
					<Loader2 v-if="status === 'loading'" class="h-4 w-4 animate-spin" />
					<Send v-else class="h-4 w-4" />
					<span>{{ status === 'loading' ? 'Memproses...' : buttonText }}</span>
				</button>
			</div>

			<!-- Error Feedback -->
			<div
				v-if="validationError || (status === 'error' && feedbackMessage)"
				class="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-1 pl-1"
			>
				<AlertCircle class="h-3.5 w-3.5 shrink-0" />
				<span>{{ validationError || feedbackMessage }}</span>
			</div>
		</form>
	</div>
</template>
