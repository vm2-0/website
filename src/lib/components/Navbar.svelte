<!-- Navbar.svelte -->
<script lang="ts">
  import logo from '$lib/assets/logo.png';
  import logoTitle from '$lib/assets/Logo_Standard_dark.png';
  import {
    Download,
    Book,
    Coins,
    Menu,
    X,
    Database,
    ChevronDown,
    Users,
    Hammer,
    Dumbbell,
    Earth,
    Monitor,
    ChevronUp
  } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import WalletMultiButton from '$lib/components/solana/WalletMultiButton.svelte';
  import { slide } from 'svelte/transition';
  import { afterNavigate } from '$app/navigation';

  let isScrolled = false;
  let isMobileMenuOpen = false;
  let isDropdownOpen: 'community' | 'research' | 'ecosystem' | null = null;
  let isMobileCommunityDropdownOpen = true;

  afterNavigate(() => {
    if (isMobileMenuOpen) toggleMobileMenu();
  });

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<div class="fixed left-0 right-0 top-0 z-50 text-gray-600 transition-all duration-300">
  <div
    class="absolute inset-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-opacity duration-300"
    class:opacity-0={!isScrolled}
    class:opacity-100={isScrolled}>
  </div>

  <div class="relative z-10 mx-auto max-w-7xl px-6">
    <div class="flex h-16 items-center justify-between">
      <!-- Left side with logo -->
      <div class="flex items-center space-x-8">
        <a href="/" class="group flex items-center">
          <img
            src={logo}
            alt="ViralMind"
            class="hidden h-8 w-8 transition-transform group-hover:scale-105 lg:block" />
          <img src={logoTitle} alt="ViralMind" class="block h-8 transition-transform lg:hidden" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden items-center space-x-8 lg:flex">
          <!-- Ecosystem Dropdown -->
          <div class="relative">
            <button
              class="navbar-dropdown-button group flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              onclick={() => (isDropdownOpen = isDropdownOpen === 'ecosystem' ? null : 'ecosystem')}
              onblur={(e) => {
                // Only close if not clicking another dropdown button
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('.navbar-dropdown-button')) {
                  setTimeout(() => (isDropdownOpen = null), 200);
                }
              }}>
              <Earth class="h-4 w-4 transition-transform group-hover:scale-110" />
              Ecosystem
              <ChevronDown class="h-4 w-4" />
            </button>

            {#if isDropdownOpen === 'ecosystem'}
              <div
                class="absolute left-0 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                transition:slide>
                <a
                  href="/viral"
                  class="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Coins class="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Viral Token</div>
                    <div class="text-xs text-gray-500">Earn and spend $VIRAL</div>
                  </div>
                </a>
                <a
                  href="/desktop"
                  class="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Monitor class="h-4 w-4 min-w-4 text-purple-500" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Viralmind Desktop</div>
                    <div class="text-xs text-gray-500">All-in-one AI application</div>
                  </div>
                </a>
                <a
                  href="/desktop#gym"
                  class="ml-4 flex items-center gap-3 rounded-lg p-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Dumbbell class="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Training Gym</div>
                    <div class="text-xs text-gray-500">Contribute demonstrations</div>
                  </div>
                </a>
                <a
                  href="/desktop#forge"
                  class="ml-4 flex items-center gap-3 rounded-lg p-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Hammer class="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">The Forge</div>
                    <div class="text-xs text-gray-500">Build custom agents</div>
                  </div>
                </a>
                <a
                  href="/gym"
                  class="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Earth class="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">Training Gym Classic</div>
                    <div class="text-xs text-gray-500">Browser-based version</div>
                  </div>
                </a>
              </div>
            {/if}
          </div>

          <!-- Community Dropdown -->
          <div class="relative">
            <button
              class="navbar-dropdown-button group flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              onclick={() => (isDropdownOpen = isDropdownOpen === 'community' ? null : 'community')}
              onblur={(e) => {
                // Only close if not clicking another dropdown button
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('.navbar-dropdown-button')) {
                  setTimeout(() => (isDropdownOpen = null), 200);
                }
              }}>
              <Users class="h-4 w-4 transition-transform group-hover:scale-110" />
              Community
              <ChevronDown class="h-4 w-4" />
            </button>

            {#if isDropdownOpen === 'community'}
              <div
                class="absolute left-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
                transition:slide>
                <a
                  href="https://discord.gg/C9NyQmkz5W"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <i class="si si-discord h-4 w-4"></i>
                  Discord
                </a>
                <a
                  href="https://t.me/viralmind"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <i class="si si-telegram h-4 w-4"></i>
                  Telegram
                </a>
                <a
                  href="https://twitter.com/ViralMindAI"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <i class="si si-twitter h-4 w-4"></i>
                  Twitter
                </a>
                <a
                  href="https://github.com/viralmind-ai"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <i class="si si-github h-4 w-4"></i>
                  GitHub
                </a>
              </div>
            {/if}
          </div>

          <!-- Research Dropdown -->
          <div class="relative">
            <button
              class="navbar-dropdown-button group flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              onclick={() => (isDropdownOpen = isDropdownOpen === 'research' ? null : 'research')}
              onblur={(e) => {
                // Only close if not clicking another dropdown button
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('.navbar-dropdown-button')) {
                  setTimeout(() => (isDropdownOpen = null), 200);
                }
              }}>
              <Database class="h-4 w-4 transition-transform group-hover:scale-110" />
              Research
              <ChevronDown class="h-4 w-4" />
            </button>

            {#if isDropdownOpen === 'research'}
              <div
                class="absolute left-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
                transition:slide>
                <a
                  href="/datasets"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <Database class="h-4 w-4" />
                  Datasets
                </a>
                <a
                  href="https://docs.viralmind.ai/"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                  <Book class="h-4 w-4" />
                  Documentation
                </a>
              </div>
            {/if}
          </div>
        </nav>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <div class="hidden md:block">
          <WalletMultiButton />
        </div>
        <a
          href="/download"
          class="group hidden items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 py-1.5 pl-4 pr-5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:from-purple-500 hover:to-blue-400 hover:shadow-purple-500/30 sm:flex">
          <div class="rounded-full bg-white/10 p-1">
            <Download class="h-4 w-4 transition-transform group-hover:scale-110" />
          </div>
          <div class="flex items-center gap-2">
            <span>Download for Desktop</span>
          </div>
        </a>

        <!-- Mobile menu button -->
        <button
          class="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          onclick={toggleMobileMenu}>
          {#if isMobileMenuOpen}
            <X class="h-6 w-6" />
          {:else}
            <Menu class="h-6 w-6" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if isMobileMenuOpen}
      <div
        transition:slide
        class="absolute left-0 right-0 top-16 border-b border-gray-200 bg-white/95 backdrop-blur-lg lg:hidden">
        <nav class="space-y-2 px-6 py-2">
          <!-- Ecosystem Section -->
          <div class="border-t border-gray-200 pt-2">
            <p class="px-2 py-1 text-xs font-semibold uppercase text-gray-500">Ecosystem</p>
            <a
              href="/viral"
              class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Coins class="h-5 w-5" />
              Viral Token
            </a>
            <a
              href="/desktop"
              class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Monitor class="h-5 w-5 min-w-5" />
              Viralmind Desktop
            </a>
            <!-- <a
              href="/desktop#gym"
              class="ml-5 flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Dumbbell class="h-5 w-5" />
              Training Gym
            </a>
            <a
              href="/desktop#forge"
              class="ml-5 flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Hammer class="h-5 w-5" />
              The Forge
            </a> -->
            <a
              href="/gym"
              class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Earth class="h-5 w-5" />
              Training Gym Classic
            </a>
          </div>

          <!-- Community Section -->
          <div class="border-t border-gray-200 pt-2">
            <button
              onclick={() => (isMobileCommunityDropdownOpen = !isMobileCommunityDropdownOpen)}
              class="flex w-full flex-row items-center text-left">
              <p class="grow px-2 py-1 text-xs font-semibold uppercase text-gray-500">Community</p>
              <ChevronUp
                class={`h-5 w-5 grow-0 ${isMobileCommunityDropdownOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>
            {#if isMobileCommunityDropdownOpen}
              <div transition:slide>
                <a
                  href="https://github.com/viralmind-ai"
                  target="_blank"
                  class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
                  <i class="si si-github h-5 w-5"></i>
                  <span class="animated-underline">GitHub</span>
                </a>
                <a
                  href="https://discord.gg/C9NyQmkz5W"
                  target="_blank"
                  class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
                  <i class="si si-discord h-5 w-5"></i>
                  Discord
                </a>
                <a
                  href="https://t.me/viralmind"
                  target="_blank"
                  class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
                  <i class="si si-telegram h-5 w-5"></i>
                  Telegram
                </a>
                <a
                  href="https://twitter.com/ViralMindAI"
                  target="_blank"
                  class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
                  <i class="si si-twitter h-5 w-5"></i>
                  Twitter
                </a>
              </div>
            {/if}
          </div>

          <!-- Research Section -->
          <div class="border-t border-gray-200 pt-2">
            <p class="px-2 py-1 text-xs font-semibold uppercase text-gray-500">Research</p>
            <a
              href="/datasets"
              class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Database class="h-5 w-5" />
              Datasets
            </a>
            <a
              href="https://docs.viralmind.ai/"
              target="_blank"
              class="flex items-center gap-3 px-2 py-2 text-gray-600 transition-colors hover:text-gray-900">
              <Book class="h-5 w-5" />
              Documentation
            </a>
          </div>

          <div class="mt-2 border-t border-gray-200 pt-4">
            <a
              href="/download"
              class="flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2.5 text-white transition-all hover:from-purple-500 hover:to-blue-400">
              <Download class="h-5 w-5 text-white/90" />
              <span class="font-medium">Download for Desktop</span>
            </a>
          </div>

          <div class="">
            <WalletMultiButton />
          </div>
        </nav>
      </div>
    {/if}
  </div>
</div>

<!-- Spacer -->
<div class="h-16"></div>
