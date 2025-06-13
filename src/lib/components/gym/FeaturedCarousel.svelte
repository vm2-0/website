<script lang="ts">
  import type { CarouselSlides } from '$lib/types';
  import { ArrowRight, ChevronRight, ChevronLeft, Book } from 'lucide-svelte';
  import { onMount } from 'svelte';

  const { slides }: { slides: CarouselSlides[] } = $props();
  let currentSlide = $state(0);

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  }

  let autoplayInterval: NodeJS.Timeout;
  let isPaused = false;

  onMount(() => {
    startAutoplay();
    console.log(slides);
    return () => clearInterval(autoplayInterval);
  });

  function startAutoplay() {
    clearInterval(autoplayInterval);
    if (!isPaused) {
      autoplayInterval = setInterval(nextSlide, 8000);
    }
  }

  function pauseAutoplay() {
    isPaused = true;
    clearInterval(autoplayInterval);
  }

  function resumeAutoplay() {
    isPaused = false;
    startAutoplay();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="group/carousel relative mb-16"
  onmouseenter={pauseAutoplay}
  onmouseleave={resumeAutoplay}
>
  <div class="relative h-[550px] md:h-[500px] lg:h-[480px]">
    {#each slides as slide, i}
      <div
        class="absolute h-full w-full rounded-3xl bg-gradient-to-br {slide.bgGradient} px-16 pt-12 backdrop-blur-sm {slide.hoverGradient} flex items-center overflow-hidden transition-all duration-700 ease-in-out"
        style="opacity: {i === currentSlide ? 1 : 0}; transform: scale({i === currentSlide
          ? 1
          : 0.98}) translateX({(i - currentSlide) * 100}%); pointer-events: {i === currentSlide
          ? 'auto'
          : 'none'}"
      >
        <div class="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-10">
          <slide.icon class="h-80 w-80 {slide.iconColor}"></slide.icon>
        </div>
        <div class="relative flex w-full flex-col items-start gap-8">
          <div class="rounded-2xl {slide.iconBgColor} p-6">
            <slide.icon class="h-16 w-16 {slide.iconColor}"></slide.icon>
          </div>
          <div>
            <h3 class="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-6xl">
              {slide.title}
            </h3>
            <p class="text-lg font-light text-gray-300 md:text-2xl">{slide.description}</p>
          </div>
          <a
            href={slide.href}
            class="group relative inline-flex w-full max-w-xl items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition-all hover:bg-white/15"
            target={slide.href.startsWith('http') ? '_blank' : undefined}
          >
            <span class="flex items-center gap-2">
              {slide.buttonText}
              <ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </div>
    {/each}

    <!-- Navigation Buttons -->
    <button
      class="absolute left-4 top-1/2 -translate-x-1/4 -translate-y-1 text-white opacity-0 transition-opacity duration-300 hover:text-white group-hover/carousel:opacity-30"
      onclick={prevSlide}
    >
      <ChevronLeft class="h-12 w-12" />
    </button>
    <button
      class="absolute right-4 top-1/2 -translate-y-1 translate-x-1/4 text-white opacity-0 transition-opacity duration-300 hover:text-white group-hover/carousel:opacity-30"
      onclick={nextSlide}
    >
      <ChevronRight class="h-12 w-12" />
    </button>

    <!-- Dots -->
    <div class="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
      {#each slides as _, i}
        <button
          aria-label="change-slide"
          class="h-1.5 rounded-full transition-all duration-300 {i === currentSlide
            ? 'w-6 bg-white'
            : 'w-1.5 bg-white/50 hover:bg-white/75'}"
          onclick={() => (currentSlide = i)}
        ></button>
      {/each}
    </div>
  </div>
</div>
