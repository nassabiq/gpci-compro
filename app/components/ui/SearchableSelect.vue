<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Check } from "lucide-vue-next";

type Option = { id: string | number; name: string; count?: number; icon?: any };

const props = withDefaults(
    defineProps<{
        options: Option[];
        modelValue?: string | number | null;
        placeholder?: string;
        widthClass?: string;
    }>(),
    {
        placeholder: "Select option",
        widthClass: "w-full",
    }
);

const emit = defineEmits<{ (e: "update:modelValue", value: string | number | null): void }>();
const root = ref<HTMLElement | null>(null);
const open = ref(false);
const query = ref("");

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    return q ? props.options.filter((o) => o.name.toLowerCase().includes(q)) : props.options;
});

const selectedLabel = computed(() => {
    if (props.modelValue === null || props.modelValue === undefined || props.modelValue === "") return props.placeholder;
    const match = props.options.find((o) => String(o.id) === String(props.modelValue));
    return match ? match.name : props.placeholder;
});

function toggleDropdown() {
    open.value = !open.value;
    if (open.value) {
        // Reset query when opening? Optional. Let's keep it for now.
        // query.value = "";
    }
}

function closeDropdown() {
    open.value = false;
}

function selectOption(id: string | number | null) {
    emit("update:modelValue", id);
    query.value = "";
    closeDropdown();
}

function isSelected(id: string | number) {
    return String(props.modelValue) === String(id);
}

function onClickOutside(e: MouseEvent) {
    if (root.value && !root.value.contains(e.target as Node)) closeDropdown();
}

onMounted(() => document.addEventListener("click", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));
</script>

<template>
    <div ref="root" class="relative" :class="widthClass">
        <!-- Control -->
        <button type="button" @click="toggleDropdown" class="w-full group inline-flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left shadow-sm transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" :aria-expanded="open" aria-haspopup="listbox">
            <span class="block truncate" :class="!modelValue ? 'text-gray-500' : 'text-gray-900'">
                {{ selectedLabel }}
            </span>
            <span class="shrink-0 text-gray-400 transition-transform duration-150 group-aria-expanded:rotate-180">▾</span>
        </button>

        <!-- Dropdown -->
        <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-1 scale-95">
            <div v-if="open" class="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl max-h-80 flex flex-col" role="listbox">
                <!-- Search -->
                <div class="sticky top-0 z-10 border-b border-gray-100 bg-white p-2">
                    <input v-model="query" type="text" placeholder="Search..." class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/60" @keydown.stop />
                </div>

                <!-- Options -->
                <ul class="flex-1 overflow-y-auto py-1">
                    <!-- Reset / All Option -->
                    <li class="px-1 py-0.5 border-b border-gray-50 pb-1 mb-1">
                        <button type="button" class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-emerald-50 text-sm" :class="!modelValue ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-500'" @click="selectOption(null)">
                            <span>{{ placeholder || 'All' }}</span>
                            <Check v-if="!modelValue" class="h-4 w-4 text-emerald-600" />
                        </button>
                    </li>

                    <li v-for="opt in filtered" :key="String(opt.id)" class="px-1 py-0.5">
                        <button type="button" class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-emerald-50 text-sm" :class="isSelected(opt.id) ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'" @click="selectOption(opt.id)">
                            <div class="flex items-center gap-2">
                                <component v-if="opt.icon" :is="opt.icon" class="h-4 w-4 text-gray-400" />
                                <span>{{ opt.name }}</span>
                            </div>
                            <Check v-if="isSelected(opt.id)" class="h-4 w-4 text-emerald-600" />
                        </button>
                    </li>
                    <li v-if="filtered.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">No results found</li>
                </ul>
            </div>
        </transition>
    </div>
</template>
