<script lang="ts">
  import ActiveRacePopup from '$lib/components/gym/ActiveRacePopup.svelte';
  import { walletStore } from '$lib/walletStore';
  import { activeRace, startPolling } from '$lib/stores/activeRace';

  // Watch for wallet connection changes
  $: if ($walletStore.connected && $walletStore.publicKey) {
    checkActiveRace($walletStore.publicKey);
  }

  async function checkActiveRace(publicKey: any) {
    try {
      console.log('Checking active race for', publicKey.toBase58());
      const res = await fetch('/api/v1/races/active', {
        headers: {
          'x-wallet-address': publicKey.toBase58()
        }
      });
      if (!res.ok) return;

      const result = await res.json();
      const data = result.success ? result.data : result;
      
      if (data.active && data.sessionId) {
        startPolling(data.sessionId);
      }
    } catch (error) {
      console.error('Error checking for active race:', error);
    }
  }
</script>

<!-- <div class="relative"> -->
  <slot />
  <ActiveRacePopup />
<!-- </div> -->
