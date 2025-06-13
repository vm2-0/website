<script lang="ts">
  import logo_full from '$lib/assets/Logo_Standard_dark.png';
  import logo from '$lib/assets/logo.png';
  import exampleUsage from '$lib/assets/exampleusage.mp4';
  import data from '$lib/assets/databrwozing.mp4';
  import gym from '$lib/assets/gym.png';
  import ButtonCTA from '$lib/components/ButtonCTA.svelte';
  import { onMount } from 'svelte';

  let copied = false;
  function copyToClipboard() {
    navigator.clipboard.writeText('HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump');
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
  import {
    Sparkles,
    Hammer,
    Dumbbell,
    Check,
    Bot,
    User,
    Search,
    PlayCircle,
    Book,
    Download,
    Github,
    Star,
    Coins,
    Info,
    Copy
  } from 'lucide-svelte';
  import type { SettingsRes } from '$lib/types';
  import VideoPopup from '$lib/components/VideoPopup.svelte';
  import posthog from 'posthog-js';

  // Dataset sample type definition
  type DatasetSample = {
    input: {
      screenshot: string;
      instruction: string;
    };
    action: string;
  };

  // Dataset samples
  let datasetSamples: DatasetSample[] = [];

  let dreamAgentInput = '';
  let placeholderIndex = 0;
  let estimatedAmount = 75000; // Default value
  let pricePerDemo = 5.5; // Default value
  let settings: SettingsRes;
  let showTrainingVideo = false;
  let showForgeVideo = false;
  let showAgentVideo = false;

  const placeholders = [
    'An agent that can book flights and hotels...',
    'An agent that can edit videos in Premiere Pro...',
    'An agent that can manage my email inbox...',
    'An agent that can create presentations...'
  ];

  onMount(() => {
    // Cycle through placeholders
    setInterval(() => {
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);

    // Update estimates
    setInterval(() => {
      estimatedAmount = Math.floor(Math.random() * (100000 - 50000) + 50000);
      pricePerDemo = Math.floor(Math.random() * (6 - 5) * 10 + 50) / 10;
    }, 5000);

    // Fetch dataset samples
    fetch('/dataset_preview.json')
      .then(async (res) => {
        if (!res.ok) throw Error(res.status + ': ' + res.statusText);
        const data = await res.json();
        // Add data URI prefix to base64 encoded screenshots
        datasetSamples = data.map((sample: any) => ({
          ...sample,
          input: {
            ...sample.input,
            screenshot: sample.input.screenshot.startsWith('data:')
              ? sample.input.screenshot
              : `data:image/jpeg;base64,${sample.input.screenshot}`
          }
        }));
      })
      .catch((error) => {
        console.error('Failed to fetch dataset samples:', error);
        // Fallback data in case the fetch fails
        datasetSamples = [
          {
            input: {
              screenshot: 'data:image/png;base64,iVBOR...',
              instruction: 'Create a spreadsheet with monthly budget data'
            },
            action: 'click(156, 234)'
          },
          {
            input: {
              screenshot: 'data:image/png;base64,iVBOR...',
              instruction: 'Find and open the settings menu in Photoshop'
            },
            action: "type('Budget 2025')"
          },
          {
            input: {
              screenshot: 'data:image/png;base64,iVBOR...',
              instruction: 'Search for flights from New York to London'
            },
            action: 'doubleClick(450, 120)'
          }
        ];
      });

    // Fetch settings
    fetch('/api/v1/settings')
      .then(async (res) => {
        if (!res.ok) throw Error(res.status + ': ' + res.statusText);
        const result = await res.json();
        settings = result.success ? result.data : result;
      })
      .catch((error) => {
        console.error('Failed to fetch settings:', error);
      });
  });

  function handleGenerateGym() {
    window.location.href = `/download`;
  }
</script>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section class="relative bg-white">
    <div class="mx-auto max-w-7xl px-6 py-8 md:px-4 md:py-24">
      <div class="grid items-start gap-4 lg:grid-cols-2">
        <!-- Left Content -->
        <div>
          <img src={logo_full} alt="ViralMind Logo" class="mb-6 hidden h-8 md:block" />
          <img src={logo} alt="ViralMind Logo" class="mb-6 block h-16 md:hidden" />
          <h1 class="mb-4 text-5xl font-bold">
            <span
              class="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Computer-Use AI for everyone.
            </span>
          </h1>
          <h2 class="mb-6 text-2xl font-semibold text-gray-800">
            We believe we can create a revolution.
          </h2>
          <p class="mb-6 text-xl text-gray-600">
            <!-- Join us in pioneering the future of AI through crowdsourced computer-use demonstrations. We're accelerating frontier AI with open-source datasets and tools, making powerful computer-use agents accessible to everyone. -->
            Building the foundation for powerful computer-use agents through crowdsourced action datasets,
            open-source tools, and frontier agent models. We want to improve the world by providing amazing
            computer-use agents.
          </p>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="https://discord.gg/C9NyQmkz5W"
                target="_blank"
                class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-white transition-colors hover:from-purple-700 hover:to-blue-600">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord
              </a>
              <a
                href="https://github.com/viralmind-ai/desktop"
                target="_blank"
                class="group inline-flex items-center gap-2 px-6 py-3 text-gray-900">
                <Star class="h-5 w-5" />
                <span class="animated-underline">Star on GitHub</span>
              </a>
            </div>
            <div class="relative hidden w-full md:block md:max-w-lg">
              <div
                class="group relative flex w-full items-center rounded-full border-2 border-gray-200/50 bg-white px-4 py-2">
                <button
                  class="flex-1 cursor-pointer text-left font-mono text-xs text-black/50 transition-colors hover:text-purple-600 md:text-sm"
                  on:click={copyToClipboard}>
                  HW7D5MyYG4Dz2C98axfjVBeLWpsEnofrqy6ZUwqwpump
                </button>
                <div class="ml-2 flex items-center gap-3">
                  {#if copied}
                    <div class="rounded-full bg-green-100 p-2">
                      <Check class="h-5 w-5 text-green-500" />
                    </div>
                  {:else}
                    <div class="rounded-full p-2 transition-colors hover:bg-gray-100">
                      <Copy on:click={copyToClipboard} class="h-5 w-5 text-gray-500" />
                    </div>
                  {/if}
                  <a href="/viral" class="rounded-full p-2 transition-colors hover:bg-gray-100">
                    <Info class="h-5 w-5 text-purple-500" />
                  </a>
                </div>

                <!-- Centered tooltip that shows when hovering over the whole container -->
                <div
                  class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Click to copy. Visit the $VIRAL page to learn more.
                  <div
                    class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-black">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div class="relative bottom-0 rounded-xl">
          <video src={exampleUsage} autoplay loop muted playsinline class=" -mr-[25%] w-[125%]">
          </video>
          <div
            class="absolute bottom-0 left-0 -mr-[25%] h-64 w-full bg-gradient-to-t from-white to-transparent md:w-[125%]">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Download Section -->
  <section class="bg-gray-100 py-20">
    <div class="mx-auto max-w-6xl px-4 text-center">
      <h2 class="mb-4 text-4xl font-bold text-gray-900">AI agents built from your data</h2>
      <p class="mb-8 text-xl text-gray-600">Start earning while contributing skills</p>
      <div class="flex flex-col items-center gap-3">
        <div class="flex justify-center gap-4">
          <ButtonCTA href="/download" class="inline-flex items-center gap-2">
            <Download class="h-5 w-5" />
            Download for Desktop
          </ButtonCTA>
          <a
            href="https://github.com/viralmind-ai/desktop"
            target="_blank"
            class="group inline-flex items-center gap-2 px-6 py-3 text-gray-900">
            <Github class="h-5 w-5" />
            <span class="animated-underline">View Source</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="bg-gray-50 py-20">
    <div class="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-12">
      <!-- Training Gym -->
      <div class="mb-20 grid items-center gap-12 lg:grid-cols-2">
        <div class="relative overflow-hidden rounded bg-gray-100 shadow-2xl">
          <img src={gym} alt="Training Gym Demo" class="h-full w-full object-cover" />
        </div>
        <div class="text-left">
          <div
            class="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-800">
            Earn $VIRAL by sharing data
          </div>
          <div class="mb-4 flex items-center gap-3">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5">
              <Dumbbell class="h-6 w-6 text-purple-500" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900">Training Gym</h2>
          </div>
          <p class="mb-6 text-lg text-gray-600">
            Show AI how to use apps, earn rewards. Get instant $VIRAL payments when you upload
            demonstrations.
          </p>
          <button
            on:click={() => {
              showTrainingVideo = true;
              posthog.capture('watch_training_demo');
            }}
            class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-gray-900 shadow transition-colors hover:bg-gray-50">
            <PlayCircle class="h-5 w-5" />
            Watch Demo
          </button>
          <VideoPopup videoId="cUjI2f7w4yM" bind:isOpen={showTrainingVideo} />
        </div>
      </div>

      <!-- The Forge -->
      <div class="mb-20 grid items-center gap-12 lg:grid-cols-2">
        <div class="order-2 text-left lg:order-1">
          <div
            class="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
            Spend $VIRAL to build powerful AI
          </div>
          <div class="mb-4 flex items-center gap-3">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5">
              <Hammer class="h-6 w-6 text-purple-500" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900">The Forge</h2>
          </div>
          <p class="mb-6 text-lg text-gray-600">
            Specify your AI needs, we'll handle the rest. Quality demonstrations at scale train your
            specialized agent.
          </p>
          <button
            on:click={() => {
              showForgeVideo = true;
              posthog.capture('watch_forge_demo');
            }}
            class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-gray-900 shadow transition-colors hover:bg-gray-50">
            <PlayCircle class="h-5 w-5" />
            Watch Demo
          </button>
          <VideoPopup videoId="5N0zWHcLYho" bind:isOpen={showForgeVideo} />
        </div>
        <div
          class="relative order-1 rounded-xl border border-gray-100 bg-white p-8 shadow-2xl lg:order-2">
          <div class="mb-6">
            <div class="mb-3 flex items-center gap-2">
              <h3 class="text-xl font-semibold text-gray-900">Describe your dream agent</h3>
              <Sparkles class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="relative">
              <input
                type="text"
                disabled
                bind:value={dreamAgentInput}
                placeholder={placeholders[placeholderIndex]}
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-purple-500" />
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Hammer class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div class="mb-6 rounded-lg bg-gray-50 p-4">
            <div class="mb-2 text-sm font-medium text-gray-700">Estimated Requirements</div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-2xl font-bold text-purple-600">
                  {estimatedAmount.toLocaleString()}
                </div>
                <div class="text-sm text-gray-600">$VIRAL Required</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-600">
                  {Math.floor(estimatedAmount / pricePerDemo).toLocaleString()}
                </div>
                <div class="text-sm text-gray-600">Demonstrations</div>
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-500">
              At {pricePerDemo} $VIRAL per demonstration
            </div>
          </div>

          <div>
            <button
              on:click={handleGenerateGym}
              class="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-white transition-colors hover:from-purple-700 hover:to-blue-600">
              Create a Gym in the App
            </button>
          </div>
        </div>
      </div>

      <!-- Agent Chat -->
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div
          class="relative order-2 aspect-video overflow-hidden rounded-xl border shadow-2xl lg:order-1">
          <div class="absolute inset-0 bg-gray-50 backdrop-blur-sm"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-full max-w-lg space-y-4 p-6">
              <!-- Bot Welcome -->
              <div class="flex items-start gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                  <Bot class="h-4 w-4 text-purple-400" />
                </div>
                <div class="rounded-lg bg-purple-100 px-3 py-2 text-sm text-purple-900">
                  <p>
                    Hi! I'm VM-1, your computer-use assistant. What would you like help with? 🖥️
                  </p>
                </div>
              </div>

              <!-- User Request -->
              <div class="flex flex-row-reverse items-start gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                  <User class="h-4 w-4 text-blue-400" />
                </div>
                <div class="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-900">
                  <p>Can you help me find a good Italian restaurant nearby that's open late?</p>
                </div>
              </div>

              <!-- Bot Response -->
              <div class="flex items-start gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                  <Bot class="h-4 w-4 text-purple-400" />
                </div>
                <div class="space-y-2">
                  <div class="rounded-lg bg-purple-100 px-3 py-2 text-sm text-purple-900">
                    <p>
                      I'll help you find a great late-night Italian spot! Let me check DoorDash for
                      you.
                    </p>
                  </div>
                  <div
                    class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600">
                    <Search class="h-4 w-4 animate-pulse text-gray-400" />
                    Searching DoorDash...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="order-1 text-left lg:order-2">
          <div class="mb-3 flex flex-wrap gap-2">
            <div
              class="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-800">
              Coming Soon
            </div>
          </div>
          <div class="mb-4 flex items-center gap-3">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5">
              <Bot class="h-6 w-6 text-purple-500" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900">VM-1 Computer Use Agent</h2>
          </div>
          <p class="mb-6 text-lg text-gray-600">
            Complete computer tasks with VM-1, a state-of-the-art computer-use agent trained with
            the data generated by the community.
          </p>

          <button
            on:click={() => {
              showAgentVideo = true;
              posthog.capture('watch_agent_demo');
            }}
            class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-gray-900 shadow transition-colors hover:bg-gray-50">
            <PlayCircle class="h-5 w-5" />
            Watch Demo
          </button>
          <VideoPopup videoId="VVj7I1SyTI8" bind:isOpen={showAgentVideo} />
        </div>
      </div>

      <!-- The Data -->
      <div class="mb-20 grid items-center gap-12 lg:grid-cols-2">
        <div class="text-left">
          <div class="mb-3 flex flex-wrap gap-2">
            <div
              class="inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-800">
              Open Data
            </div>
            <div
              class="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
              Early Access
            </div>
          </div>
          <div class="mb-4 flex items-center gap-3">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5">
              <Book class="h-6 w-6 text-purple-500" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900">Video-Language-Action Dataset</h2>
          </div>
          <p class="mb-6 text-left text-lg text-gray-600">
            The first open dataset of its kind, designed for frontier action models that live on the
            desktop.
          </p>
          <a
            href="/datasets"
            class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-gray-900 shadow transition-colors hover:bg-gray-50">
            <Book class="h-5 w-5" />
            Learn More
          </a>
        </div>
        <div
          class="relative h-[400px] overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div class="mb-3 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Dataset Preview</span>
            <span class="text-xs text-gray-500">5M+ samples</span>
          </div>
          <!-- Filters row -->
          <div class="mb-3 flex items-center gap-2 text-xs text-gray-600 opacity-50">
            <span class="mr-1">Filters:</span>
            <div class="flex items-center gap-1">
              <div
                class="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-purple-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="h-3 w-3 text-purple-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>video</span>
            </div>
            <div class="flex items-center gap-1">
              <div
                class="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-purple-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="h-3 w-3 text-purple-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>task</span>
            </div>
            <div class="flex items-center gap-1">
              <div
                class="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-purple-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="h-3 w-3 text-purple-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>action</span>
            </div>
            <div class="flex items-center gap-1">
              <div
                class="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300">
              </div>
              <span>uitree</span>
            </div>
            <div class="flex items-center gap-1">
              <div
                class="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300">
              </div>
              <span>reward</span>
            </div>
          </div>
          <div class="relative h-[350px] overflow-hidden">
            <!-- White overlay for scroll area -->
            <div
              class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white via-transparent to-white opacity-75">
            </div>
            <div class="grid h-full grid-cols-2 gap-2">
              <!-- Left Column - Scrolling Down -->
              <div class="relative overflow-y-hidden pr-1">
                <div class="animate-scroll-down">
                  {#each datasetSamples as sample, i}
                    {#if i % 2 === 0}
                      <div
                        class="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800 shadow-sm">
                        <!-- Image at 50% size -->
                        <div
                          class="bg-gray-10 mx-auto mb-3 aspect-video overflow-hidden rounded border shadow shadow-sm">
                          <img
                            src={sample.input.screenshot}
                            alt="Screenshot"
                            class="h-full w-full object-cover" />
                        </div>

                        <!-- Task section -->
                        <div class="mb-3">
                          <div class="font-mono text-xs font-bold text-gray-400">task</div>
                          <div class="font-mono text-xs">
                            <code class="text-black">{sample.input.instruction}</code>
                          </div>
                        </div>

                        <!-- Action section -->
                        <div>
                          <div class="font-mono text-xs font-bold text-gray-400">action</div>
                          <div class="font-mono text-xs">
                            <code class="text-black">{sample.action}</code>
                          </div>
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>

              <!-- Right Column - Scrolling Up -->
              <div class="relative overflow-y-hidden pl-1">
                <div class="animate-scroll-up">
                  {#each datasetSamples as sample, i}
                    {#if i % 2 === 1}
                      <div
                        class="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800 shadow-sm">
                        <div
                          class="mx-auto mb-3 aspect-video overflow-hidden rounded border bg-gray-100 shadow shadow-sm">
                          <img
                            src={sample.input.screenshot}
                            alt="Screenshot"
                            class="h-full w-full object-cover" />
                        </div>

                        <!-- Task section -->
                        <div class="mb-3">
                          <div class="font-mono text-xs font-bold text-gray-400">task</div>
                          <div class="font-mono text-xs">
                            <code class="text-black">{sample.input.instruction}</code>
                          </div>
                        </div>

                        <!-- Action section -->
                        <div>
                          <div class="font-mono text-xs font-bold text-gray-400">action</div>
                          <div class="font-mono text-xs">
                            <code class="text-black">{sample.action}</code>
                          </div>
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ready to Get Started -->
      <div class="mt-12 text-center">
        <h2 class="mb-4 text-3xl font-bold text-gray-900">Ready to get started?</h2>
        <p class="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
          Contribute to the future of AI assistance with our desktop app. Download now and join our
          growing community.
        </p>
        <div class="flex justify-center">
          <ButtonCTA href="/download" class="inline-flex items-center gap-2">
            <Download class="h-5 w-5" />
            Download for Desktop
          </ButtonCTA>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="bg-gray-100 py-20">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="mb-12 text-center text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>

      {#if settings?.faq}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each settings.faq as faq}
            <div class="rounded-lg p-6">
              <h3 class="mb-3 text-lg font-semibold text-gray-900">{faq.question}</h3>
              <p class="text-gray-600">{faq.answer}</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>
