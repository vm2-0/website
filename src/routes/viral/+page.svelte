<script lang="ts">
  import {
    Coins,
    Activity,
    ArrowRight,
    Sparkles,
    Bot,
    Gauge,
    Wallet,
    Lock,
    ExternalLink,
    Database,
    Check,
    Copy
  } from 'lucide-svelte';
  import ButtonCta from '$lib/components/ButtonCTA.svelte';
  import ViralMetrics from '$lib/components/ViralMetrics.svelte';

  let copied = false;
  function copyAddress() {
    navigator.clipboard.writeText(TOKEN_DATA.contractAddress);
    copied = true;
    setTimeout(() => (copied = false), 1000);
  }

  function handleInputClick(event: MouseEvent & { currentTarget: EventTarget & HTMLInputElement }) {
    event.currentTarget.select();
  }

  const TOKEN_DATA = {
    contractAddress: 'HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump',
    dexscreenerUrl: 'https://dexscreener.com/solana/HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump'
  };
</script>

<svelte:head>
  <title>viralmind.ai - $VIRAL</title>
  <meta property="og:title" content="viralmind.ai - $VIRAL" />
  <meta name="twitter:title" content="viralmind.ai - $VIRAL" />
  <meta
    name="description"
    content="Incentivizing high-quality AI training data at scale through instant, quality-based rewards." />
  <meta
    name="twitter:description"
    content="Incentivizing high-quality AI training data at scale through instant, quality-based rewards." />
  <meta
    property="og:description"
    content="Incentivizing high-quality AI training data at scale through instant, quality-based rewards." />
</svelte:head>

<main class="min-h-screen">
  <!-- Hero Section -->
  <div class="bg-white py-24">
    <div class="mx-auto max-w-7xl px-16 text-center">
      <h1
        class="mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
        $VIRAL Token
      </h1>
      <p class="mb-8 text-xl text-gray-600">
        Incentivizing high-quality AI training data at scale through instant, quality-based rewards.
      </p>
      <div class="flex flex-col items-center justify-center gap-6 md:flex-row">
        <div
          class="flex w-full items-center justify-center gap-3 rounded-full border-2 bg-gray-50 px-6 py-2 md:w-1/2">
          <input
            type="text"
            readonly
            value={TOKEN_DATA.contractAddress}
            on:click={handleInputClick}
            class="w-full cursor-pointer truncate bg-transparent font-mono text-gray-900 outline-none hover:text-gray-500" />
          <button
            class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            on:click={copyAddress}>
            {#if copied}
              <Check class="h-4 w-4 text-green-500" />
            {:else}
              <Copy class="h-4 w-4" />
            {/if}
          </button>
        </div>
        <ButtonCta href={TOKEN_DATA.dexscreenerUrl} target="_blank">
          <Coins class="h-5 w-5" />
          Trade $VIRAL
        </ButtonCta>
      </div>
    </div>

    <!-- Get Started Section -->
    <section class="mt-16 bg-white">
      <div class="mx-auto max-w-7xl px-16">
        <div class="grid gap-20 md:grid-cols-3">
          <!-- How to Earn -->
          <div>
            <h3 class="mb-6 text-xl font-bold text-gray-900">How do I earn $VIRAL?</h3>
            <p class="mb-6 text-gray-600">
              Use the Training Gym to earn tokens by providing AI training data. Rewards scale with
              data quality.
            </p>
          </div>

          <!-- How to Spend -->
          <div>
            <h3 class="mb-6 text-xl font-bold text-gray-900">How do I spend $VIRAL?</h3>
            <p class="mb-6 text-gray-600">
              Create your own training gyms and fund reward pools. Export gym data to train
              specialized agents.
            </p>
          </div>

          <!-- How to Trade -->
          <div>
            <h3 class="mb-6 text-xl font-bold text-gray-900">Where do I trade $VIRAL?</h3>
            <p class="mb-2 text-gray-600">
              Buy or sell $VIRAL with $USDC or $SOL through secure exchanges:
            </p>
            <a
              href={TOKEN_DATA.dexscreenerUrl}
              target="_blank"
              class="inline-flex items-center gap-2 text-purple-500 hover:text-purple-600">
              View Markets
              <ExternalLink class="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <div class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-16">
        <ViralMetrics />
      </div>
    </div>

    <!-- Tokenomics Section -->
    <section class="bg-gradient-to-b from-white to-purple-50/30 py-24">
      <div class="mx-auto max-w-7xl px-16">
        <h2
          class="mb-16 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-center text-4xl font-bold text-transparent">
          Tokenomics
        </h2>
        <div class="grid gap-8 md:grid-cols-2">
          <!-- Lock Details -->
          <div
            class="group rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-purple-50/30 p-8 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
            <div
              class="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-blue-50">
              <Lock class="h-8 w-8 text-purple-500" />
            </div>
            <h3 class="mb-4 text-2xl font-bold text-gray-900">Team Supply Lock</h3>
            <p class="mb-6 text-lg text-gray-600">
              <strong class="text-purple-600">3.41%</strong>
              of the total supply is locked using Streamflow until
              <strong class="text-purple-600">2026</strong>
              .
            </p>
            <a
              href="https://app.streamflow.finance/contract/solana/mainnet/EG7wNTj5Vd6XdZGY6gwodoEyUC9sP9WFx3F2quEdLaYj"
              target="_blank"
              class="inline-flex items-center gap-2 font-medium text-purple-500 hover:text-purple-600">
              View Lock Contract
              <ExternalLink class="h-5 w-5" />
            </a>
          </div>

          <!-- Treasury Details -->
          <div
            class="group rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-purple-50/30 p-8 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
            <div
              class="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-blue-50">
              <Wallet class="h-8 w-8 text-purple-500" />
            </div>
            <h3 class="mb-4 text-2xl font-bold text-gray-900">Self-Funded Treasury</h3>
            <p class="mb-4 text-lg text-gray-600">
              The ViralMind team invested <strong class="text-purple-600">$50,000</strong>
              of their own capital to build their own $VIRAL position.
            </p>
            <p class="text-lg text-gray-600">
              This position funds ecosystem rewards, ensuring sustainable incentives without
              requiring external funding.
            </p>
          </div>

          <!-- Data Economy -->
          <div
            class="group rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-purple-50/30 p-10 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl md:col-span-2">
            <div
              class="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-blue-50">
              <Database class="h-8 w-8 text-purple-500" />
            </div>
            <h3 class="mb-6 text-2xl font-bold text-gray-900">$VIRAL-Gated Data Economy</h3>
            <div class="grid gap-12 md:grid-cols-2">
              <div class="space-y-6">
                <p class="text-lg font-medium text-gray-600">
                  The $VIRAL token powers a self-sustaining data economy where quality is
                  incentivized through token mechanics:
                </p>
                <ul class="space-y-4">
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">
                      Gym users choose tasks based on reward value
                    </span>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">
                      Token rewards scale with quality score
                    </span>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">Forge users fund new training gyms</span>
                  </li>
                </ul>
              </div>
              <div class="space-y-6">
                <p class="text-lg font-medium text-gray-600">
                  This creates a virtuous cycle where:
                </p>
                <ul class="space-y-4">
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">High quality data is rewarded more</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">Poor quality returns to pool</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">Workers decide sustainable rewards</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-100/50 p-2">
                      <ArrowRight class="h-5 w-5 text-purple-500" />
                    </div>
                    <span class="text-lg text-gray-700">
                      Community demonstrations accelerate computer-use AI development
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</main>
