<script lang="ts">
  import { Check, Copy, ExternalLink } from 'lucide-svelte';

  const TOKEN_DATA = {
    contractAddress: 'HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump',
    dexscreenerUrl: 'https://dexscreener.com/solana/HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump'
  };

  let copied = false;
  function copyAddress() {
    navigator.clipboard.writeText(TOKEN_DATA.contractAddress);
    copied = true;
    setTimeout(() => (copied = false), 1000);
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-4">
    <code class="font-mono text-gray-900 truncate">{TOKEN_DATA.contractAddress}</code>
    <button
      class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      on:click={copyAddress}
    >
      {#if copied}
        <Check class="h-4 w-4 text-green-500" />
      {:else}
        <Copy class="h-4 w-4" />
      {/if}
    </button>
  </div>
  <div class="flex justify-center gap-4">
    <a
      href={`https://solscan.io/token/${TOKEN_DATA.contractAddress}`}
      target="_blank"
      class="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
    >
      View on Solscan
      <ExternalLink class="h-4 w-4" />
    </a>
    <a
      href={TOKEN_DATA.dexscreenerUrl}
      target="_blank"
      class="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
    >
      Price & Trading
      <ExternalLink class="h-4 w-4" />
    </a>
  </div>
</div>
