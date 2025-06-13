<script lang="ts">
  let { class: className = '', bordered = true, children } = $props();
</script>

<div
  class={`rounded-xl ${bordered ? 'border border-purple-600/30' : ''} bg-stone-900/30 p-6 backdrop-blur-md ${className}`}
>
  {@render children()}
</div>
