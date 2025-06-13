<script lang="ts">
    import { BrainCircuit, X, AlertCircle, Heart } from 'lucide-svelte';
    export let show = false;
    export let onClose = () => {};
    export let selectedCount = 0;
   
    function handleClose() {
      show = false;
      onClose();
    }
   </script>
   
   {#if show}
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" on:click={handleClose}></div>
      
      <!-- Dialog -->
      <div class="relative z-10 w-full max-w-lg rounded-2xl bg-stone-900 p-6 shadow-2xl">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-purple-600/20 p-3">
              <BrainCircuit class="h-6 w-6 text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-white">One-Click Train</h2>
          </div>
          <button 
            class="rounded-lg p-1 text-gray-400 hover:bg-stone-800 hover:text-white"
            on:click={handleClose}
          >
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div class="mb-6 rounded-lg bg-stone-800/50 p-4">
          <div class="flex items-start gap-3">
            <AlertCircle class="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
            <div>
              <p class="text-sm text-gray-300">
                  Generate a custom LoRA adapter from {selectedCount} selected demonstrations:
              </p>
              <ul class="my-3 list-inside list-disc space-y-1 text-sm text-gray-400">
                  <li>Augment raw actions with synthetic reasoning</li>
                  <li>Attend skillful trajectories into agentic behaviors</li>
                  <li>Instant plug-in for your favorite LLM</li>
              </ul>
              <div class="flex items-center gap-1 text-xs text-purple-400/70">
                <span>Built with</span>
                <Heart class="h-3.5 w-3.5 text-red-300/70" />
                <span>from AI researchers to AI dreamers.</span>
              </div>
              <p class="text-sm text-purple-400/90 mt-1">
                Together we're democratizing the future of embodied AI.
              </p>
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
            class="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
          >
            Generate LORA
            <span class="ml-2 rounded bg-yellow-500 px-2 py-0.5 text-xs text-black">Soon</span>
          </button>
        </div>
      </div>
    </div>
   {/if}