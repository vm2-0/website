<script lang="ts">
  import { onMount } from 'svelte';
  import { walletStore } from '$lib/walletStore';
  import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
  } from '@solana/web3.js';
  import { page } from '$app/stores';
  import {
    Brain,
    CheckCircle,
    AlertCircle,
    Loader2,
    Dumbbell,
    ArrowRight,
    Sparkles,
    Coins
  } from 'lucide-svelte';

  // Form state
  let gymName = '';
  let skills = '';
  let tokenType = 'VIRAL'; // Default to VIRAL
  let tokenAddress = 'HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump'; // Default VIRAL token address
  let customTokenAddress = '';
  let loading = false;
  let currentStep = '';
  let error = '';
  let success = false;
  let poolId = '';

  // Token options
  const tokenOptions = [
    {
      value: 'VIRAL',
      label: 'VIRAL',
      address: 'HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump',
      disabled: false
    },
    { value: 'SOL', label: 'SOL', address: '11111111111111111111111111111111', disabled: true },
    { value: 'CUSTOM', label: 'Custom Token', address: '', disabled: true }
  ];

  // Transaction steps
  const steps = [
    { id: 'preparing', message: 'Preparing gym on server...' },
    { id: 'extracting', message: 'Extracting skills from input...' },
    { id: 'engineering', message: 'Preparing transaction...' },
    { id: 'designing', message: 'Confirming transaction...' },
    { id: 'notifying', message: 'Designing environments...' },
    { id: 'finalizing', message: 'Finalizing gym setup...' }
  ];

  // Connection to Solana
  const connection = new Connection(
    'https://snowy-delicate-sponge.solana-mainnet.quiknode.pro/99269d0ad3e8500a9423bbeea089c8caf45a98aa',
    'confirmed'
  );

  // Handle token type change
  function handleTokenTypeChange() {
    const selectedToken = tokenOptions.find((t) => t.value === tokenType);
    if (selectedToken) {
      tokenAddress = selectedToken.address;
    }
  }

  // Get URL parameters
  onMount(() => {
    const urlParams = $page.url.searchParams;
    const nameParam = urlParams.get('name');
    const skillsParam = urlParams.get('skills');
    const tokenTypeParam = urlParams.get('tokenType');
    const tokenAddressParam = urlParams.get('tokenAddress');

    if (nameParam) gymName = nameParam;
    if (skillsParam) skills = skillsParam;
    if (tokenTypeParam && tokenOptions.some((t) => t.value === tokenTypeParam)) {
      tokenType = tokenTypeParam;
    }
    if (tokenAddressParam) {
      tokenAddress = tokenAddressParam;
      if (tokenType === 'CUSTOM') {
        customTokenAddress = tokenAddressParam;
      }
    }
  });

  async function handleCreateGym() {
    if (!$walletStore.connected || !$walletStore.publicKey) {
      error = 'Please connect your wallet first';
      return;
    }

    if (!gymName.trim()) {
      error = 'Please enter a gym name';
      return;
    }

    if (!skills.trim()) {
      error = 'Please enter at least one skill to train';
      return;
    }

    loading = true;
    error = '';
    success = false;

    try {
      // Step 1: Create gym on backend to get deposit address
      currentStep = 'preparing';

      // Get token details based on selected type
      let tokenDetails = {
        type: tokenType,
        symbol: tokenType,
        address: tokenAddress
      };

      // If custom token is selected, use the custom address
      if (tokenType === 'CUSTOM' && customTokenAddress) {
        tokenDetails.address = customTokenAddress;
      }

      const createResponse = await fetch('/api/v1/forge/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: gymName,
          skills: skills,
          token: tokenDetails,
          ownerAddress: $walletStore.publicKey.toString()
        })
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create gym on server');
      }

      const resp = await createResponse.json();

      const gymData = resp.data;

      poolId = gymData._id;
      const depositAddress = gymData.depositAddress;

      if (!depositAddress) {
        throw new Error('No deposit address returned from server');
      }

      // Step 2: Prepare transaction to deposit address
      currentStep = 'extracting';
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      // Create a transfer transaction (1 SOL)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: $walletStore.publicKey,
          toPubkey: new PublicKey(depositAddress),
          lamports: 1 * LAMPORTS_PER_SOL
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = $walletStore.publicKey;

      // Step 3: Send transaction
      currentStep = 'engineering';
      const signature = await $walletStore.sendTransaction(transaction, connection, {
        maxRetries: 5
      });

      // Step 4: Confirm transaction
      currentStep = 'designing';
      await connection.confirmTransaction(signature, 'confirmed');

      // Step 5: Refresh pool to update balance
      currentStep = 'notifying';

      const refreshResponse = await fetch('/api/v1/forge/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: poolId
        })
      });

      if (!refreshResponse.ok) {
        console.warn('Failed to refresh pool balance, but gym was created');
      }

      // Step 6: Finalize
      currentStep = 'finalizing';
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      success = true;
    } catch (err: any) {
      console.error('Error creating gym:', err);
      error = err?.message || 'An unknown error occurred';
    } finally {
      loading = false;
      currentStep = '';
    }
  }
</script>

<!-- Quick Info Banner -->
<div class="bg-gray-100">
  <div class="bg-gradient-to-r from-purple-600/80 to-blue-600/80">
    <div class="mx-auto max-w-6xl px-4 py-3 text-center">
      <div class="flex items-center justify-center gap-2 text-sm">
        <Sparkles class="h-4 w-4 text-white" />
        <span class="text-white">Create your own AI agent training gym for just 1 SOL</span>
      </div>
    </div>
  </div>

  <div class="min-h-screen pb-24 text-black">
    <div class="mx-auto max-w-3xl px-4 pt-8">
      <!-- Hero Section -->
      <div class="mb-12 text-center">
        <h1
          class="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text pb-4 text-5xl font-bold text-transparent md:text-6xl">
          Create AI Agent Gym
        </h1>
        <p class="mx-auto mb-8 max-w-2xl text-xl text-gray-500">
          Build your own training environment to collect demonstrations for your AI agents.
        </p>
      </div>

      <div class="rounded-xl bg-white shadow-md">
        {#if !success}
          <!-- Processing Steps -->
          {#if loading}
            <div class="mb-8 rounded-xl p-6 backdrop-blur-md">
              <h3 class="mb-4 text-xl font-semibold text-purple-600">Creating Your Gym</h3>
              <div class="space-y-4">
                {#each steps as step}
                  <div class="flex items-center gap-3">
                    {#if currentStep === step.id}
                      <div class="h-5 w-5 flex-shrink-0">
                        <Loader2 class="h-5 w-5 animate-spin text-purple-400" />
                      </div>
                      <p class="text-purple-500">{step.message}</p>
                    {:else if steps.findIndex((s) => s.id === currentStep) > steps.findIndex((s) => s.id === step.id)}
                      <div class="h-5 w-5 flex-shrink-0">
                        <CheckCircle class="h-5 w-5 text-green-400" />
                      </div>
                      <p class="text-gray-600">{step.message}</p>
                    {:else}
                      <div class="h-5 w-5 flex-shrink-0">
                        <div class="mx-auto my-1 h-3 w-3 rounded-full bg-gray-200"></div>
                      </div>
                      <p class="text-gray-600">{step.message}</p>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <div class="mb-8 rounded-xl p-6 backdrop-blur-md">
            <div class="mb-8">
              <h3 class="mb-6 flex items-center gap-2 text-xl font-bold">
                <Dumbbell class="h-6 w-6 text-purple-500" />
                Gym Details
              </h3>

              <!-- Gym Name Input -->
              <label class="mb-4 block text-sm font-medium text-gray-600">
                Gym Name
                <input
                  type="text"
                  bind:value={gymName}
                  placeholder="Enter a name for your gym"
                  class="mt-2 block w-full appearance-none rounded-md border border-purple-900/30 bg-white p-2 text-black placeholder-gray-500 focus:border-purple-500
                    focus:outline-none focus:ring-1 focus:ring-purple-500" />
              </label>

              <!-- Skills Textarea -->
              <label class="mb-6 block text-sm font-medium text-gray-600">
                Skills to Train
                <textarea
                  bind:value={skills}
                  placeholder="List the skills you want to train your AI agent on (one per line)..."
                  rows="6"
                  class="text-blac mt-2 block w-full resize-none appearance-none rounded-md border
                    border-purple-900/30 bg-white p-2 placeholder-gray-500
                    focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                </textarea>
              </label>
            </div>

            <div class="mb-8">
              <h3 class="mb-6 flex items-center gap-2 text-xl font-bold">
                <Coins class="h-6 w-6 text-purple-400" />
                Treasury Token
              </h3>

              <!-- Token Type Selection -->
              <div class="mb-6 space-y-3">
                {#each tokenOptions as option}
                  <label
                    class="flex items-center space-x-3 rounded-lg p-3 {!option.disabled
                      ? 'border border-purple-700/30 bg-purple-700/20'
                      : 'opacity-50'}">
                    <input
                      type="radio"
                      bind:group={tokenType}
                      value={option.value}
                      on:change={handleTokenTypeChange}
                      disabled={option.disabled}
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500" />
                    <span class={option.disabled ? 'text-gray-500' : 'font-medium text-gray-600'}>
                      {option.label}
                    </span>
                  </label>
                {/each}
              </div>

              {#if tokenType === 'CUSTOM'}
                <div class="mt-3">
                  <label class="mb-2 block text-sm font-medium text-gray-400">
                    Custom Token Address
                    <input
                      type="text"
                      bind:value={customTokenAddress}
                      placeholder="Enter token address"
                      class="mt-2 block w-full appearance-none rounded-md border border-purple-900/30 bg-black/50
                        p-2 text-gray-100 placeholder-gray-500 focus:border-purple-500
                        focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </label>
                </div>
              {/if}
            </div>

            <!-- Wallet Status -->
            <div class="mb-6 rounded-lg border border-purple-600/30 bg-white p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-sm text-black">Wallet Status:</span>
                {#if $walletStore.connected}
                  <span class="text-sm font-medium text-green-400">
                    Connected: {$walletStore.publicKey
                      ?.toString()
                      .slice(0, 6)}...{$walletStore.publicKey?.toString().slice(-4)}
                  </span>
                {:else}
                  <span class="text-sm font-medium text-red-400">Not Connected</span>
                {/if}
              </div>
            </div>

            <!-- Create Button -->
            <button
              on:click={handleCreateGym}
              disabled={loading || !$walletStore.connected}
              class="w-full transform rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3
                font-semibold text-white shadow-lg transition duration-200
                ease-in-out hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 disabled:opacity-50">
              {#if loading}
                <span class="flex items-center justify-center">
                  <Loader2 class="-ml-1 mr-3 h-5 w-5 animate-spin text-white" />
                  Processing...
                </span>
              {:else}
                Create AI Agent Gym for 1 SOL
              {/if}
            </button>

            <!-- Error Message -->
            {#if error}
              <div
                class="mt-4 flex items-start gap-3 rounded-md border border-red-800 bg-red-900/30 p-4">
                <AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <p class="text-sm text-red-300">{error}</p>
              </div>
            {/if}
          </div>

          <!-- Benefits Section -->
          <div class="mb-8 grid gap-8 md:grid-cols-2">
            <div class="rounded-xl p-6 backdrop-blur-md">
              <h3 class="mb-6 flex items-center gap-2 text-xl font-bold">
                <Dumbbell class="h-6 w-6 text-purple-500" />
                Training & Data
              </h3>
              <ul class="space-y-4 text-black">
                <li class="flex gap-2">
                  <ArrowRight class="h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>Collect high-quality demonstrations</span>
                </li>
                <li class="flex gap-2">
                  <ArrowRight class="h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>Train agents on specific skills</span>
                </li>
                <li class="flex gap-2">
                  <ArrowRight class="h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>Customize training environments</span>
                </li>
              </ul>
            </div>

            <div class="rounded-xl p-6 backdrop-blur-md">
              <h3 class="mb-6 flex items-center gap-2 text-xl font-bold">
                <Brain class="h-6 w-6 text-purple-500" />
                AI Development
              </h3>
              <ul class="space-y-4 text-black">
                <li class="flex gap-2">
                  <ArrowRight class="h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>Build specialized AI agents</span>
                </li>
                <li class="flex gap-2">
                  <ArrowRight class="h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>Access VM-1 training capabilities</span>
                </li>
                <li class="flex gap-2">
                  <ArrowRight class="h-5 w-5 flex-shrink-0 text-purple-500" />
                  <span>Leverage community demonstrations</span>
                </li>
              </ul>
            </div>
          </div>
        {:else}
          <!-- Success Message -->
          <div class="mb-8 rounded-xl p-6 backdrop-blur-md">
            <div class="mb-4 flex items-center gap-3">
              <CheckCircle class="h-6 w-6 text-green-400" />
              <h3 class="text-xl font-semibold text-green-400">Gym Created Successfully!</h3>
            </div>

            <p class="mb-6 text-gray-600">
              Your AI agent gym "{gymName}" has been created successfully. You can now manage it
              from the dashboard.
            </p>

            <div class="mb-6 rounded-lg border p-4">
              <h4 class="mb-2 text-sm font-medium text-gray-400">Gym ID</h4>
              <p class="font-mono text-black">{poolId}</p>
            </div>

            <div class="flex gap-4">
              <a
                href="/gym"
                class="flex-1 transform rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3
                  text-center font-semibold text-white shadow-lg transition
                  duration-200 ease-in-out hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700">
                Go to Training Gym
              </a>

              <button
                on:click={() => {
                  gymName = '';
                  skills = '';
                  success = false;
                  poolId = '';
                }}
                class="flex-1 rounded-full border-2 border-purple-400/50 bg-white px-4
                  py-3 font-semibold text-purple-400 shadow-lg backdrop-blur-sm transition-all
                  hover:scale-105 hover:border-purple-400 hover:bg-purple-600/40 hover:text-white">
                Create Another Gym
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
