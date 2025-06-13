<script lang="ts">
  import { ArrowRight, TicketSlash, Trophy } from 'lucide-svelte';
  import type { Race } from '$lib/types';
  import { colorSchemes } from '$lib/types';
  import RaceWarningModal from './RaceWarningModal.svelte';
  import { raceWarningModal } from '$lib/stores/raceWarningModal';

  export let race: Race;
  export let icon: typeof ArrowRight; // Icon component passed from parent

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

<div
  class="group relative h-[360px] min-w-[300px] rounded-3xl {scheme.bg} overflow-hidden p-8 backdrop-blur-sm transition-all {scheme.hover}"
>
  <div class="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-5">
    <svelte:component this={icon} class="h-48 w-48 {scheme.icon}" />
  </div>
  <div class="relative flex h-full flex-col justify-end gap-4">
    <div class="rounded-xl bg-opacity-20 p-4" style="background-color: {scheme.iconBg}">
      <svelte:component this={icon} class="h-10 w-10 {scheme.icon}" />
    </div>
    <div class="text-left">
      <h3 class="mb-2 text-2xl font-bold tracking-tight">{race.title}</h3>
      <p class="font-light text-gray-300">{race.description}</p>
    </div>
    <div class="flex flex-col gap-2">
      <a
        href={race.href || '#'}
        class="group relative inline-flex items-center justify-between rounded-lg bg-white/10 px-5 py-2.5 font-medium text-white transition-all hover:bg-white/15"
        target={race.href?.startsWith('http') ? '_blank' : undefined}
        on:click={handleRaceClick}
      >
        <span class="flex items-center gap-2">
          {race.buttonText}
          <ArrowRight class="group-hover:animate-side-to-side h-4 w-4 transition-transform" />
        </span>
        <div class="ml-2 flex items-center gap-2 text-sm text-purple-400/80">
          <!-- {#if race.stakeRequired}
              <span class="flex items-center gap-1">
                <TicketSlash class="h-3 w-3" />
                {race.stakeRequired}
              </span>
            {/if}
            {#if race.reward}
              <span class="flex items-center gap-1">
                <Trophy class="h-3 w-3" />
                {race.reward}
              </span>
            {/if} -->
        </div>
      </a>
    </div>
  </div>
</div>
