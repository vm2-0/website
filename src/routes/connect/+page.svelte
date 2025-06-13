<script lang="ts">
  import { onMount } from 'svelte';
  import { walletStore } from '$lib/walletStore';
  import { Coins } from 'lucide-svelte';
  import { Buffer } from 'buffer';
  import { env } from '$env/dynamic/public';

  let token = '';
  let connecting = false;

  onMount(() => {
    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get('token') || '';
  });

  async function connectWallet() {
    try {
      connecting = true;

      // Use the wallet store to connect
      if (!$walletStore.wallets.length) {
        alert('No Solana wallets found. Please install Phantom wallet.');
        return;
      }

      // Select and connect to Phantom wallet
      const phantomWallet = $walletStore.wallets.find((w) => w.adapter.name === 'Phantom');
      if (!phantomWallet) {
        alert('Phantom wallet not found. Please install Phantom wallet.');
        return;
      }

      $walletStore.select(phantomWallet.adapter.name);
      await $walletStore.connect();

      if (!$walletStore.publicKey) {
        throw new Error('Failed to connect wallet');
      }

      // Create message with timestamp nonce
      const timestamp = Date.now();
      const message = `viralmind desktop\nnonce: ${timestamp}`;

      // Sign the message
      if (!$walletStore.signMessage) {
        throw new Error('Wallet does not support message signing');
      }

      // Convert message to Uint8Array for signing
      const messageBytes = new TextEncoder().encode(message);
      const signature = await $walletStore.signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      // Send address, signature and timestamp to backend
      await fetch(env.PUBLIC_API_URL + '/api/v1/wallet/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          address: $walletStore.publicKey.toString(),
          signature: signatureBase64,
          timestamp
        })
      });

      // Close window after successful connection
      window.location.href = 'viralmind://open';
      // window.close();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      alert('Failed to connect wallet: ' + message);
    } finally {
      connecting = false;
    }
  }
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50">
  <div class="mx-4 max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <Coins class="h-8 w-8 text-gray-600" />
      </div>
      <h1 class="mb-2 text-2xl font-bold text-gray-800">Connect Your Wallet</h1>
      <p class="text-gray-600">Connect your Phantom wallet to continue using ViralMind Desktop</p>
    </div>

    {#if !token}
      <div class="mb-4 rounded-lg bg-red-50 p-4 text-center text-red-600">
        Error: No connection token provided
      </div>
    {:else}
      <button
        on:click={connectWallet}
        disabled={connecting}
        class="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {#if connecting}
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white">
          </div>
          Connecting...
        {:else}
          Connect Phantom Wallet
        {/if}
      </button>

      <a
        href="https://phantom.app/download"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-4 block text-center text-sm text-gray-500 transition-colors hover:text-gray-800">
        Don't have Phantom wallet? Click here to install
      </a>
    {/if}
  </div>
</div>
