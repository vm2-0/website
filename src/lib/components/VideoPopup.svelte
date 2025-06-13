<script lang="ts">
  import { X } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  
  export let videoId: string;
  export let isOpen = false;

  function closePopup() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    transition:fade={{ duration: 200 }}
    on:click={closePopup}
  >
    <div 
      class="relative w-full max-w-4xl rounded-lg bg-black"
      on:click|stopPropagation
    >
      <button
        class="absolute -right-3 -top-3 rounded-full bg-white p-1 text-black shadow-lg hover:bg-gray-100 z-10"
        on:click={closePopup}
      >
        <X class="h-6 w-6" />
      </button>
      
      <div class="relative aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/{videoId}?autoplay=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="absolute inset-0 rounded-lg"
        ></iframe>
      </div>
    </div>
  </div>
{/if}
