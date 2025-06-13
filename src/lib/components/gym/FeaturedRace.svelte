<script lang="ts">
  import { ArrowRight, TicketSlash, Trophy, Brain } from 'lucide-svelte';
  import type { Race } from '$lib/types';
  import { colorSchemes } from '$lib/types';
  import RaceWarningModal from './RaceWarningModal.svelte';
  import { raceWarningModal } from '$lib/stores/raceWarningModal';

  export let race: Race;
  export let icon: any = Brain;

  function handleRaceClick(e: MouseEvent) {
    if (!race.href) {
      e.preventDefault();
      raceWarningModal.show(race.id);
    }
  }

  let scheme: (typeof colorSchemes)[keyof typeof colorSchemes];
  $: {
    const schemeKeys = Object.keys(colorSchemes) as (keyof typeof colorSchemes)[];
    const randomScheme = schemeKeys[Math.floor(Math.random() * schemeKeys.length)];
    scheme = colorSchemes[race.colorScheme || randomScheme];
  }
</script>

<div class="h-full">
  <div
    class="group relative h-full rounded-3xl {scheme.bg} overflow-hidden p-12 backdrop-blur-sm transition-all {scheme.hover}"
  >
    <div class="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-10">
      <svelte:component this={icon} class="h-80 w-80 {scheme.icon}" />
    </div>
    <div class="relative flex h-full flex-col">
      <!-- Top Section -->
      <div class="rounded-2xl bg-opacity-20 p-6" style="background-color: {scheme.iconBg}">
        <svelte:component this={icon} class="h-16 w-16 {scheme.icon}" />
      </div>

      <!-- Middle Section -->
      <div class="mt-8">
        <h3 class="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{race.title}</h3>
        <p class="text-lg font-light text-gray-300 md:text-2xl">{race.description}</p>
      </div>

      <!-- Bottom Section -->
      <div class="mt-auto pt-8">
        <a
          href={race.href || '#'}
          class="group relative inline-flex w-full max-w-xl items-center justify-between rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition-all hover:bg-white/15"
          target={race.href?.startsWith('http') ? '_blank' : undefined}
          on:click={handleRaceClick}
        >
          <span class="flex items-center gap-2">
            {race.buttonText}
            <ArrowRight class="group-hover:animate-side-to-side h-5 w-5 transition-transform" />
          </span>
          <div class="flex items-center gap-4 text-lg text-purple-400/80">
            <!-- {#if race.stakeRequired}
              <span class="flex items-center gap-2">
                <TicketSlash class="h-4 w-4" />
                {race.stakeRequired}
              </span>
            {/if}
            {#if race.reward}
              <span class="flex items-center gap-2">
                <Trophy class="h-4 w-4" />
                {race.reward}
              </span>
            {/if} -->
          </div>
        </a>
      </div>
    </div>
  </div>
</div>
