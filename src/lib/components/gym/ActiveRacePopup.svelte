<script lang="ts">
  import { activeRace } from '$lib/stores/activeRace';
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  
  let timeoutId: NodeJS.Timeout;

  // Don't show popup on race page
  $: isRacePage = $page.url.pathname.includes('/race');

  function getTimeUntilExpiry(race: any) {
    const now = new Date();
    const sessionAge = now.getTime() - race.createdAt.getTime();
    const lastUpdateAge = now.getTime() - race.lastUpdated.getTime();
    
    // Session expires after 15 minutes or 1 minute of inactivity
    const timeLeft = Math.min(
      15 * 60 * 1000 - sessionAge,
      60 * 1000 - lastUpdateAge
    );
    
    if (timeLeft <= 0) return 'Expiring...';
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  // Update time display every second
  function startTimer() {
    timeoutId = setInterval(() => {
      if ($activeRace) {
        $activeRace = { ...$activeRace }; // Force update
      }
    }, 1000);
  }

  startTimer();

  onDestroy(() => {
    if (timeoutId) {
      clearInterval(timeoutId);
    }
  });
</script>

{#if $activeRace && !isRacePage}
  <a 
    href="/gym/race?s={$activeRace.sessionId}"
    class="fixed bottom-6 right-6 bg-zinc-900/95 rounded-xl shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-blue-500/20 transition-all duration-200 z-40 block no-underline border border-zinc-800/50 backdrop-blur-sm"
  >
    {#if $activeRace.preview}
      <div class="relative w-64 h-40">
        <img 
          src={$activeRace.preview} 
          alt="Race preview" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
      </div>
    {/if}
    <div class="p-4 space-y-2">
      <div class="text-sm font-medium text-white flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Active Race Session
      </div>
      {#if $activeRace.lastQuest}
        <div class="text-sm text-zinc-300 line-clamp-2">
          {$activeRace.lastQuest}
        </div>
      {/if}
      <div class="text-xs text-zinc-400 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
        </svg>
        Expires in: {getTimeUntilExpiry($activeRace)}
      </div>
    </div>
  </a>
{/if}
