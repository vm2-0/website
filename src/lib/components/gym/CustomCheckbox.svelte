<script lang="ts">
  export let checked = false;
  export let onChange: (checked: boolean) => void = () => {};
</script>

<button
  class="flex h-5 w-5 items-center justify-center rounded bg-stone-800/50 hover:bg-stone-700/50 transition-colors"
  on:click={() => {
    checked = !checked;
    onChange(checked);
  }}
>
  {#if checked}
    <div class="h-3 w-3 rounded-sm bg-purple-500"></div>
  {/if}
</button>
