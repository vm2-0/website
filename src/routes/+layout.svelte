<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import GymHeader from '$lib/components/GymHeader.svelte';
  import { page } from '$app/state';
  import WalletProvider from '$lib/components/solana/WalletProvider.svelte';
  import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
  import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';

  let { children } = $props();

  const localStorageKey = 'walletAdapter';
  const walletAdapters = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  const isGymRoute = $derived(page.url.pathname.startsWith('/gym'));

  const title = $derived.by(() => {
    let pre = 'viralmind.ai';
    const route = page.route.id?.split('/')[1];
    if (route) {
      pre += ' - ' + route[0].toUpperCase() + route.slice(1, route.length);
    }
    return pre;
  });
</script>

<svelte:head>
  <!-- HTML Meta Tags -->
  <title>{title}</title>
  <meta name="description" content="The Next Meta in Agentic AI." />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={page.url.toString()} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content="The Next Meta in Agentic AI." />
  <meta property="og:image" content="https://viralmind.ai/favicon.png" />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="viralmind.ai" />
  <meta property="twitter:url" content={page.url.toString()} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content="The Next Meta in Agentic AI." />
  <meta name="twitter:image" content="https://viralmind.ai/favicon.png" />
</svelte:head>

<WalletProvider {localStorageKey} wallets={walletAdapters} autoConnect />
<div class="bg-white">
  {#if isGymRoute}
    <GymHeader />
  {:else}
    <Navbar />
  {/if}
  {@render children()}
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TQ5Z1BBEGG"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'G-TQ5Z1BBEGG');
  </script>
</div>
