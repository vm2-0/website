<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Brain, Hammer } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';

  let mousePosition = $state({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent) {
    mousePosition.x = (event.clientX / window.innerWidth) * 100;
    mousePosition.y = (event.clientY / window.innerHeight) * 100;
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
</script>

<div class="min-h-screen bg-black pb-24 text-white">
  <div class="relative flex min-h-screen flex-col items-start justify-center overflow-hidden">
    <!-- Content Container -->
    <div class="relative z-10 mx-auto w-full max-w-[1400px] px-8">
      <!-- Main Title -->
      <h1 class="my-6 text-5xl font-bold drop-shadow-lg md:text-7xl">Staked Races</h1>

      <!-- Coming Soon Content -->
      <div class="mb-12 max-w-2xl">
        <p class="mb-8 text-2xl text-gray-400">
          Stay tuned while we use the free races to ensure the staked races are perfectly balanced
          for the best possible experience.
        </p>
        <p class="mb-12 text-xl text-gray-400">
          While you wait, why not try some of our free races to sharpen your skills?
        </p>

        <Button onclick={() => goto('/gym/free-races')} class="py-6">
          Try Free Races
          <Brain class="h-5 w-5" />
        </Button>
      </div>
    </div>

    <!-- Animated Hammer -->
    <div
      class="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-visible"
    >
      <div class="hammer-animation">
        <Hammer class="h-[1000px] w-[1000px] text-purple-900 opacity-5" />
      </div>
    </div>
  </div>

  <!-- Background effects -->
  <div class="absolute inset-0 z-[1] bg-gradient-to-b from-purple-900/20 to-black opacity-25"></div>
  <div
    class="absolute inset-0 z-[2] opacity-25 transition-transform duration-1000 ease-out"
    style="background: radial-gradient(600px circle at {mousePosition.x}% {mousePosition.y}%, rgb(147, 51, 234, 0.1), transparent 100%); 
            transform: translate({(mousePosition.x - 50) * -0.05}px, {(mousePosition.y - 50) *
      -0.05}px)"
  ></div>
  <div
    class="absolute inset-0 z-[3] bg-gradient-to-b from-black via-transparent to-black opacity-25"
  ></div>
</div>

<style>
  @keyframes hammerStrike {
    0% {
      transform: rotate(35deg);
    }
    40% {
      transform: rotate(-30deg);
    }
    80% {
      transform: rotate(-45deg);
    }
    85% {
      transform: rotate(40deg);
    }
    90%,
    100% {
      transform: rotate(35deg);
    }
  }

  .hammer-animation {
    transform-origin: 10% 90%;
    animation: hammerStrike 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
</style>
