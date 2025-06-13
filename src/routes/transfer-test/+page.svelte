<script lang="ts">
  import { onMount } from 'svelte';
  import { walletStore } from '$lib/walletStore';

  let amount = 1;
  let txInfo = '';
  let loading = false;

  async function handleTransfer() {
    if (!$walletStore.publicKey) {
      txInfo = 'Please connect your wallet first';
      return;
    }

    loading = true;
    try {
      const response = await fetch('/api/v1/races/transfer-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          recipientAddress: $walletStore.publicKey
        })
      });

      const result = await response.json();
      const data = result.success ? result.data : result;
      
      if (data.signature) {
        txInfo = `Transfer successful!\nSignature: ${data.signature}`;
      } else {
        txInfo = 'Transfer failed. Check console for details.';
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      txInfo = `Error: ${error?.message || 'Unknown error occurred'}`;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-black text-gray-100">
  <div class="container mx-auto p-8 max-w-lg">
    <h1 class="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
      Transfer Test
    </h1>

    <div class="bg-gray-900 rounded-lg p-6 shadow-xl mb-6 border border-gray-800">
      <label class="block text-sm font-medium mb-2 text-gray-300">
        Amount (VIRAL)
        <input
          type="number"
          bind:value={amount}
          min="1"
          class="mt-2 block w-full rounded-md bg-[#111] border-gray-800 text-gray 
                focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus:outline-none
                placeholder-gray-500 appearance-none p-1"
        />
      </label>
    </div>

    <button
      on:click={handleTransfer}
      disabled={loading}
      class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md py-3 px-4 
            hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-medium shadow-lg
            transition duration-200 ease-in-out transform hover:scale-[1.02] border border-indigo-500/20"
    >
      {loading ? 'Processing...' : 'Transfer from Treasury'}
    </button>

    {#if txInfo}
      <div class="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-800">
        <textarea
          readonly
          value={txInfo}
          class="w-full h-32 p-3 rounded-md bg-[#111] border-gray-800 text-gray-100 font-mono text-sm
                focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus:outline-none resize-none
                placeholder-gray-500 appearance-none"
        />
      </div>
    {/if}
  </div>
</div>
