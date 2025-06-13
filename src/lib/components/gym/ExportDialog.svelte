<script lang="ts">
  import { Download, X, AlertCircle, Heart } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  export let show = false;
  export let onClose = () => {};
  export let onExport = (type: 'raw' | 'full') => {};
  export let selectedCount = 0;

  let format = "openai";
  let augmentations = {
    multimodal: { 
      enabled: true, 
      percentage: 50,
      tooltip: "Include visual data and textual data for multi-modal training. Required for training a LAM."
    },
    ocr: { 
      enabled: true, 
      percentage: 50,
      tooltip: "Extract text & icons from screen regions and train on OCR-based RAG. Significantly speeds up training with current MLLMs."
    },
    cropping: { 
      enabled: true, 
      percentage: 50,
      tooltip: "Generate multiple cropped views of the same interaction. Significantly improves spatial precision during inference."
    },
    chainOfThought: { 
      enabled: true, 
      percentage: 50,
      tooltip: "Include intermediate reasoning steps in the training data"
    },
    windowLayout: { 
      enabled: true, 
      percentage: 50,
      tooltip: "Randomize window positions and sizes to improve layout robustness"
    },
    pyautogui: {
      enabled: true,
      percentage: 50,
      tooltip: "Convert actions into PyAutoGUI Python code for direct automation"
    }
  };

  let minQuality = 0;
  let maxQuality = 100;

  function handleExportFull() {
    // Show desktop app message
    alert('Please use the desktop app for full data processing. The web version currently does not support data processing.');
  }

  function handleExportRaw() {
    onExport('raw');
  }

  function handleClose() {
    show = false;
    onClose();
  }

  $: if (!show) {
    // Reset values when dialog closes
    format = "openai";
    augmentations = {
      multimodal: { 
        enabled: true, 
        percentage: 50,
        tooltip: "Include visual data and textual data for multi-modal training. Required for training a LAM."
      },
      ocr: { 
        enabled: true, 
        percentage: 50,
        tooltip: "Extract text & icons from screen regions and train on OCR-based RAG. Significantly speeds up training."
      },
      cropping: { 
        enabled: true, 
        percentage: 50,
        tooltip: "Generate multiple cropped views of the same interaction. Significantly improves spatial precision."
      },
      chainOfThought: { 
        enabled: true, 
        percentage: 50,
        tooltip: "Include intermediate reasoning steps in the training data"
      },
      windowLayout: { 
        enabled: true, 
        percentage: 50,
        tooltip: "Randomize window positions and sizes to improve layout robustness"
      },
      pyautogui: {
        enabled: true,
        percentage: 50,
        tooltip: "Convert actions into PyAutoGUI Python code for direct automation"
      }
    };
    minQuality = 0;
    maxQuality = 100;
  }
</script>

{#if show}
<div class="fixed inset-0 z-50 flex items-center justify-center px-4">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" on:click={handleClose}></div>
  
  <!-- Dialog -->
  <div class="relative z-10 w-full max-w-2xl rounded-2xl bg-stone-900 p-8 shadow-2xl">
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-purple-600/20 p-3">
          <Download class="h-6 w-6 text-purple-400" />
        </div>
        <h2 class="text-xl font-bold text-white">Export Dataset</h2>
      </div>
      <button 
        class="rounded-lg p-1 text-gray-400 hover:bg-stone-800 hover:text-white"
        on:click={handleClose}
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <!-- Format Selection -->
    <div class="mb-8">
      <div class="mb-3 flex items-center gap-3">
        <h3 class="font-medium text-white">Format</h3>
        <select 
          bind:value={format}
          class="rounded-lg bg-stone-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="openai">OpenAI Fine-tuning JSONL</option>
          <option value="sharegpt">ShareGPT Format</option>
          <option value="alpaca">Alpaca JSON</option>
          <option value="huggingface">Hugging Face Dataset</option>
        </select>
      </div>
      <p class="text-sm text-gray-400">Export {selectedCount} selected demonstrations in your preferred data format</p>
    </div>

    <!-- Augmentations -->
    <div class="mb-8">
      <h3 class="mb-4 font-medium text-white">Data Augmentations</h3>
      <div class="grid gap-3">
        {#each Object.entries(augmentations) as [key, value]}
          <div class="group relative flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                bind:checked={value.enabled}
                class="rounded border-gray-600 bg-stone-800 text-purple-500 focus:ring-purple-500"
              />
              <span class="text-sm text-gray-300">
                {key === 'multimodal' ? 'Multimodal Input' :
                 key === 'ocr' ? 'OCR/Set-of-marks Reasoning' :
                 key === 'cropping' ? 'Multi-round Cropping' :
                 key === 'windowLayout' ? 'Randomize Window Layout' :
                 key === 'pyautogui' ? 'PyAutoGUI Code' :
                 'Chain of Thought'}
              </span>
            </label>
            <div class="flex items-center gap-2">
              <input
                type="number"
                bind:value={value.percentage}
                min="0"
                max="100"
                class="w-20 rounded bg-stone-800 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span class="text-sm text-gray-400">%</span>
            </div>
            <div class="invisible absolute left-full ml-2 w-64 z-[60] rounded-lg bg-black px-3 py-2 text-xs text-white shadow-xl transition-opacity duration-200 group-hover:visible">
              {value.tooltip}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Quality Range -->
    <div class="mb-8">
      <h3 class="mb-4 font-medium text-white">Quality Filters</h3>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-300">Min</span>
          <input
            type="number"
            bind:value={minQuality}
            min="0"
            max="100"
            class="w-20 rounded bg-stone-800 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-300">Max</span>
          <input
            type="number"
            bind:value={maxQuality}
            min="0"
            max="100"
            class="w-20 rounded bg-stone-800 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        class="rounded-lg px-4 py-2 text-gray-400 hover:bg-stone-800 hover:text-white"
        on:click={handleClose}
      >
        Cancel
      </button>
      <button
        class="rounded-lg bg-stone-800 px-4 py-2 font-medium text-white hover:bg-stone-700"
        on:click={handleExportRaw}
        disabled={selectedCount === 0}
      >
        Export Raw
      </button>
      <button
        class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
        on:click={handleExportFull}
        disabled={selectedCount === 0}
      >
        <Download class="h-4 w-4" />
        Export High-Quality Dataset
      </button>
    </div>
  </div>
</div>
{/if}
