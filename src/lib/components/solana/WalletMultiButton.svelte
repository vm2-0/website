<script lang="ts">
  import { type Adapter } from '@solana/wallet-adapter-base';
  import { walletStore, type Wallet } from '../../walletStore';
  import { fade, fly } from 'svelte/transition';
  import { Connection, PublicKey } from '@solana/web3.js';
  import { Clock, Copy, LogOut, Coins, ExternalLink, ChevronRight } from 'lucide-svelte';

  let isOpen = false;
  let tokenBalance: number | null = null;
  const VIRAL_TOKEN = new PublicKey('HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump');
  const connection = new Connection(
    'https://snowy-delicate-sponge.solana-mainnet.quiknode.pro/99269d0ad3e8500a9423bbeea089c8caf45a98aa',
    'confirmed'
  );

  async function getTokenBalanceWeb3(connection: Connection, tokenAccount: PublicKey) {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (info.value.uiAmount == null) throw new Error('No balance found');
    console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
    return info.value.uiAmount;
  }

  async function getTokenBalance() {
    if (!$walletStore.publicKey) return;
    try {
      // Get token account address
      const filters = [
        {
          dataSize: 165
        },
        {
          memcmp: {
            offset: 32,
            bytes: $walletStore.publicKey.toBase58()
          }
        },
        {
          memcmp: {
            offset: 0,
            bytes: VIRAL_TOKEN.toBase58()
          }
        }
      ];
      const accounts = await connection.getProgramAccounts(
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Token Program ID
        { filters }
      );

      if (accounts.length > 0) {
        tokenBalance = await getTokenBalanceWeb3(connection, accounts[0].pubkey);
      } else {
        tokenBalance = 0;
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      tokenBalance = 0;
    }
  }

  $: if ($walletStore.connected) {
    getTokenBalance();
  }

  const byInstalledStatus = (a: Wallet, b: Wallet) => {
    if (a.readyState === 'Installed' && b.readyState !== 'Installed') {
      return -1;
    }
    if (a.readyState !== 'Installed' && b.readyState === 'Installed') {
      return 1;
    }
    return 0;
  };
  $: installedWalletAdaptersWithReadyState = $walletStore.wallets
    .filter((walletAdapterAndReadyState) => {
      return walletAdapterAndReadyState.readyState === 'Installed';
    })
    .sort((walletAdapterAndReadyStateA, walletAdapterAndReadyStateB) => {
      return byInstalledStatus(walletAdapterAndReadyStateA, walletAdapterAndReadyStateB);
    });

  async function handleConnect(wallet: Adapter) {
    $walletStore.select(wallet.name);
    await $walletStore.connect();
    isOpen = false;
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText($walletStore.publicKey!.toBase58());
    isOpen = false;
  }

  async function handleDisconnect() {
    await $walletStore.disconnect();
    isOpen = false;
  }

  function abbrAddress(address: string) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  import { onMount } from 'svelte';

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.wallet-button-container')) {
      isOpen = false;
    }
  }

  onMount(() => {
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  });

  $: if (typeof window !== 'undefined' && isOpen) {
    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 0);
  } else if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside);
  }
</script>

{#if $walletStore.connected}
  <div class="wallet-button-container relative inline-block">
    <button
      id="connected-wallet-btn"
      on:click|stopPropagation={() => (isOpen = !isOpen)}
      class="flex items-center rounded-full border-2 border-transparent bg-black px-5 py-1 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10">
      <img
        alt="icon of {$walletStore!.adapter!.name}"
        src={$walletStore!.adapter!.icon}
        class="mr-2 h-5 w-5" />
      <span class="font-medium">{abbrAddress($walletStore.publicKey!.toBase58())}</span>
    </button>
    {#if isOpen}
      <ul
        id="connected-wallet-menu"
        transition:fade
        class="animate-in fade-in slide-in-from-top-2 fixed right-4 top-[4.5rem] z-[99999] min-w-[280px] rounded-2xl border border-white/20 bg-black/90 p-3 font-[-apple-system,system-ui] shadow-2xl backdrop-blur-xl duration-200">
        <li>
          <div
            class="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-4 py-3 text-left">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
              <Coins class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="font-medium text-white">$VIRAL Balance</div>
              <div
                class="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-lg font-bold text-transparent">
                {#if tokenBalance === null}
                  <div class="flex items-center gap-2">
                    <Clock class="h-4 w-4 text-gray-400" />
                    <span class="text-sm text-gray-400">Loading...</span>
                  </div>
                {:else}
                  {tokenBalance.toLocaleString()}
                {/if}
              </div>
            </div>
          </div>
        </li>
        <li>
          <button
            on:click={copyToClipboard}
            class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-300 transition-all duration-200 hover:bg-white/5">
            <Copy class="h-5 w-5 text-gray-500" />
            <div>
              <div class="font-medium text-white">Copy Address</div>
              <div class="text-sm text-gray-400">Copy your wallet address to clipboard</div>
            </div>
          </button>
        </li>
        <li>
          <button
            on:click={handleDisconnect}
            class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-400 transition-all duration-200 hover:bg-red-500/10">
            <LogOut class="h-5 w-5" />
            <div>
              <div class="font-medium">Disconnect Wallet</div>
              <div class="text-sm text-red-400">Sign out of your wallet</div>
            </div>
          </button>
        </li>
      </ul>
    {/if}
  </div>
{:else}
  <div class="wallet-button-container relative inline-block">
    <button
      id="select-wallet-btn"
      on:click|stopPropagation={() => (isOpen = !isOpen)}
      class="rounded-full border-2 border-transparent bg-black px-5 py-1 font-medium tracking-tight text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10">
      Connect Solana Wallet
    </button>
    {#if isOpen}
      <div
        id="select-wallet-modal"
        transition:fade
        class="animate-in fade-in slide-in-from-top-2 fixed right-4 top-[4.5rem] z-[99999] min-w-[320px] rounded-2xl border border-white/20 bg-black/90 p-3 font-[-apple-system,system-ui] shadow-2xl backdrop-blur-xl duration-200">
        {#if installedWalletAdaptersWithReadyState.length === 0}
          <div class="p-6 text-center">
            <div
              class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20">
              <Coins class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="mb-2 text-lg font-semibold tracking-tight text-white">No Wallet Found</h3>
            <p class="mb-5 leading-relaxed text-gray-400">
              Install Phantom or another Solana wallet to continue
            </p>
            <a
              href="https://phantom.app/download"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-2.5 font-medium tracking-tight text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md">
              Get Phantom Wallet
              <ExternalLink class="ml-2 h-4 w-4" />
            </a>
          </div>
        {:else}
          <div class="space-y-0.5">
            {#each installedWalletAdaptersWithReadyState as wallet}
              <li>
                {#if !wallet.adapter.connected}
                  <button
                    on:click={() => handleConnect(wallet.adapter)}
                    type="button"
                    class="group relative flex w-full items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/5">
                    <img
                      alt="icon of {wallet.adapter.name}"
                      src={wallet.adapter.icon}
                      class="mr-4 h-8 w-8 transition-transform duration-200 group-hover:scale-105" />
                    <div>
                      <div class="font-medium tracking-tight text-white">{wallet.adapter.name}</div>
                      <div class="text-sm text-gray-400">Click to connect your wallet</div>
                    </div>
                    <ChevronRight class="absolute right-4 h-5 w-5 text-gray-400" />
                  </button>
                {/if}
              </li>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}
