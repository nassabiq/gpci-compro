<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = withDefaults(
    defineProps<{
        images: string[];
        alt?: string;
        fallbackSrc?: string;
        zoomFactor?: number;
    }>(),
    {
        alt: "Image",
        fallbackSrc: "/img/empty-image.png",
        zoomFactor: 2.5,
    }
);

const activeSlide = ref(0);
const hasMultipleImages = computed(() => props.images.length > 1);

// ── Magnifier state ──
const isZooming = ref(false);
const lensX = ref(0);
const lensY = ref(0);
const bgPosX = ref(0);
const bgPosY = ref(0);
const mainImageRef = ref<HTMLDivElement | null>(null);
const currentImageSrc = computed(() => getImageSrc(props.images[activeSlide.value]));

function onMouseEnter() {
    isZooming.value = true;
}

function onMouseLeave() {
    isZooming.value = false;
}

function onMouseMove(e: MouseEvent) {
    if (!mainImageRef.value) return;
    const rect = mainImageRef.value.getBoundingClientRect();

    // Cursor position relative to container (0-1 range)
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Lens circle position (centered on cursor)
    const lensSize = 200;
    lensX.value = e.clientX - rect.left - lensSize / 2;
    lensY.value = e.clientY - rect.top - lensSize / 2;

    // Background position for zoomed view
    bgPosX.value = x * 100;
    bgPosY.value = y * 100;
}

function useFallback(e: Event) {
    const img = e.target as HTMLImageElement;
    img.onerror = null;
    img.src = props.fallbackSrc;
}

function goToSlide(index: number) {
    activeSlide.value = index;
}

function nextSlide() {
    if (!hasMultipleImages.value) return;
    activeSlide.value = (activeSlide.value + 1) % props.images.length;
}

function prevSlide() {
    if (!hasMultipleImages.value) return;
    activeSlide.value = (activeSlide.value - 1 + props.images.length) % props.images.length;
}

watch(() => props.images, () => {
    activeSlide.value = 0;
});
</script>

<template>
    <div class="image-slider" @keydown.left="prevSlide" @keydown.right="nextSlide" tabindex="0">
        <!-- Main Image Area -->
        <div ref="mainImageRef" class="image-slider__main rounded-xl bg-slate-100 min-h-[360px] lg:min-h-[440px] flex items-center justify-center overflow-hidden relative" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @mousemove="onMouseMove">
            <transition name="slider-fade" mode="out-in">
                <img :key="activeSlide" :src="currentImageSrc" :alt="`${alt} - ${activeSlide + 1}`" class="max-h-[420px] w-auto max-w-full object-contain pointer-events-none select-none" @error="useFallback" />
            </transition>

            <!-- Magnifier Lens -->
            <div v-show="isZooming" class="image-slider__lens" :style="{
                left: `${lensX}px`,
                top: `${lensY}px`,
                backgroundImage: `url(${currentImageSrc})`,
                backgroundSize: `${zoomFactor * 100}%`,
                backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            }" />

            <!-- Prev / Next arrows -->
            <template v-if="hasMultipleImages">
                <button class="image-slider__arrow image-slider__arrow--prev" aria-label="Previous image" @click.stop="prevSlide">
                    <ChevronLeft class="h-5 w-5" />
                </button>
                <button class="image-slider__arrow image-slider__arrow--next" aria-label="Next image" @click.stop="nextSlide">
                    <ChevronRight class="h-5 w-5" />
                </button>
            </template>

            <!-- Slide counter badge -->
            <span v-if="hasMultipleImages" class="image-slider__counter">
                {{ activeSlide + 1 }} / {{ images.length }}
            </span>
        </div>

        <!-- Dot indicators -->
        <div v-if="hasMultipleImages" class="image-slider__dots">
            <button v-for="(_, i) in images" :key="i" :class="['image-slider__dot', { 'image-slider__dot--active': i === activeSlide }]" :aria-label="`Go to image ${i + 1}`" @click="goToSlide(i)" />
        </div>

        <!-- Thumbnail strip -->
        <div v-if="hasMultipleImages" class="image-slider__thumbs">
            <button v-for="(img, i) in images" :key="i" :class="['image-slider__thumb', { 'image-slider__thumb--active': i === activeSlide }]" @click="goToSlide(i)">
                <img :src="getImageSrc(img)" :alt="`Thumbnail ${i + 1}`" class="h-full w-full object-cover" @error="useFallback" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.image-slider:focus {
    outline: none;
}

.image-slider__main {
    position: relative;
    cursor: crosshair;
}

/* ── Magnifier Lens ── */
.image-slider__lens {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 12px;
    border: 3px solid rgba(255, 255, 255, 0.9);
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.12),
        0 8px 24px rgba(0, 0, 0, 0.25),
        inset 0 0 8px rgba(0, 0, 0, 0.06);
    pointer-events: none;
    z-index: 20;
    background-repeat: no-repeat;
    transition: opacity 0.15s ease;
}

/* Navigation Arrows */
.image-slider__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    color: #334155;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    transition: all 0.2s ease;
    pointer-events: auto;
}

.image-slider__arrow:hover {
    background: #fff;
    color: #059669;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    transform: translateY(-50%) scale(1.08);
}

.image-slider__arrow--prev {
    left: 12px;
}

.image-slider__arrow--next {
    right: 12px;
}

/* Slide Counter Badge */
.image-slider__counter {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
    letter-spacing: 0.04em;
}

/* Dot Indicators */
.image-slider__dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 14px;
}

.image-slider__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    background: #cbd5e1;
    cursor: pointer;
    padding: 0;
    transition: all 0.25s ease;
}

.image-slider__dot--active {
    background: #059669;
    transform: scale(1.3);
}

.image-slider__dot:hover:not(.image-slider__dot--active) {
    background: #94a3b8;
}

/* Thumbnail Strip */
.image-slider__thumbs {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
}

.image-slider__thumb {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    background: #f1f5f9;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
}

.image-slider__thumb--active {
    border-color: #059669;
    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.25);
}

.image-slider__thumb:hover:not(.image-slider__thumb--active) {
    border-color: #94a3b8;
}

/* Fade Transition */
.slider-fade-enter-active,
.slider-fade-leave-active {
    transition: opacity 0.25s ease;
}

.slider-fade-enter-from,
.slider-fade-leave-to {
    opacity: 0;
}

/* Scrollbar for thumbnail strip */
.image-slider__thumbs::-webkit-scrollbar {
    height: 4px;
}

.image-slider__thumbs::-webkit-scrollbar-track {
    background: transparent;
}

.image-slider__thumbs::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}
</style>
