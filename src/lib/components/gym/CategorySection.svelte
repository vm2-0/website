<script lang="ts">
  import { ArrowRight, Brain } from 'lucide-svelte';
  import RaceCard from './RaceCard.svelte';
  import type { Category } from '$lib/types';

  const { category, iconMap }: { category: Category; iconMap: Record<string, any> } = $props();
</script>

<div class="mb-16">
  <div class="mb-6 flex flex-col justify-between md:flex-row">
    <h2 class="flex items-center gap-3 self-start text-3xl font-bold text-purple-400 md:self-start">
      <category.icon class="h-8 w-8"></category.icon>
      {category.title}
    </h2>
    <div class="hidden text-purple-400 transition-colors md:block md:self-end">
      Scroll
      <ArrowRight class="ml-1 inline-block h-4 w-4" />
    </div>
    <div class="text-purple-400 transition-colors md:hidden md:self-end">Swipe for more.</div>
  </div>

  <div class="hide-scrollbar flex space-x-6 overflow-x-auto pb-4">
    {#each category.races as race}
      <RaceCard {race} icon={iconMap[race.icon || 'Brain'] || Brain} />
    {/each}
  </div>
</div>

<style>
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
