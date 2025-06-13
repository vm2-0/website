<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    children: () => any;
    class?: string | undefined;
  }
  let { children, onclick, disabled, type, class: className }: Props = $props();
</script>

<button
  {type}
  {disabled}
  {onclick}
  class={`group inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-all hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50  hover:disabled:bg-purple-600 ${className}`}
>
  {@render children()}
</button>
