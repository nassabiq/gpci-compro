<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";

export interface BreadcrumbItem {
    label: string;
    to?: string;
}

defineProps<{
    items: BreadcrumbItem[];
}>();
</script>

<template>
    <nav class="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
        <template v-for="(item, index) in items" :key="index">
            <NuxtLink v-if="item.to" :to="item.to" class="hover:text-emerald-700 transition">
                {{ item.label }}
            </NuxtLink>
            <span v-else class="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                {{ item.label }}
            </span>
            <ChevronRight v-if="index < items.length - 1" class="h-3.5 w-3.5" />
        </template>
    </nav>
</template>
