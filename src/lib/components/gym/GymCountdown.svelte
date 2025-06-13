<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const targetDate = new Date('2025-01-18T16:00:00-05:00'); // 4pm EST on 1/18/2025

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let interval: ReturnType<typeof setInterval>;

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff > 0) {
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }
  }

  onMount(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="flex flex-col items-center space-y-4">
  <div class="grid grid-cols-3 gap-8 text-center">
    {#each [
      { value: hours, label: 'Hours' },
      { value: minutes, label: 'Minutes' },
      { value: seconds, label: 'Seconds' }
    ] as { value, label }}
      <div class="flex flex-col w-32"> <!-- Fixed width container -->
        <div class="relative">
          <div class="text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse font-mono"> <!-- Added font-mono for fixed-width numbers -->
            {value.toString().padStart(2, '0')}
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10" />
        </div>
        <div class="text-sm text-gray-400 mt-2 font-medium uppercase tracking-wider">{label}</div>
      </div>
    {/each}
  </div>
</div>