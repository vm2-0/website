<!-- Datasets.svelte -->
<script lang="ts">
    import { ArrowLeft } from 'lucide-svelte';
    
    const handleSendRequest = (datasetName: string) => {
      const subject = encodeURIComponent(`[Access Request] ${datasetName}`);
      window.location.href = `mailto:tech-research@viralmind.ai?subject=${subject}`;
    };
  </script>
  
<div class="min-h-screen bg-white px-4 pt-8 md:px-8 lg:px-16">
    <!-- Hero Section -->
    <div class="mb-24 my-6 text-center">
      <h1 class="mb-6 text-6xl font-bold text-gray-900 md:text-7xl">
        Datasets
      </h1>
      <p class="mx-auto max-w-2xl text-xl text-gray-600">
        Community-powered data collection for open frontier AI research
      </p>
    </div>  
  
    <!-- Dataset Grid -->
    <div class="mx-auto grid max-w-7xl gap-8">
      <!-- Desktop Actions Dataset -->
      <div class="rounded-2xl bg-gray-100 p-8 shadow-sm">
        <div class="mb-6">
          <div class="text-sm text-gray-500">
            Jan 29, 2025
          </div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900">
            Multimodal Desktop Action and Accessibility Dataset
          </h2>
          <p class="text-gray-600">
            A large-scale dataset of goal-directed desktop interactions, collected from users completing AI-generated tasks across both VMs and personal computers. Each trajectory includes screen recordings, accessibility trees, interaction logs, and the various AI task prompts that guided the human behavior. Spans Linux, Windows, and macOS environments. Designed for training action models & UI parsing models.
          </p>
        </div>
        <button
          on:click={() => handleSendRequest("Desktop Action and Accessibility Dataset")}
          class="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-medium text-white transition-all hover:bg-purple-700"
        >
          Send request
          <span class="text-lg">→</span>
        </button>
      </div>
    </div>
  </div>
  
<style>
    /* Light mode gradient background */
    :global(body) {
      background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(245, 245, 250));
    }
  </style>
