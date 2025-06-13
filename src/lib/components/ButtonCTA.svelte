<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    variant?: 'primary' | 'secondary';
    class?: string;
    children: () => any;
  }
  let { href, target = '_self', class: className, variant = 'primary', children }: Props = $props();

  const styles = {
    primary: 'bg-gradient-to-r from-secondary-400 to-secondary-600 text-white',
    secondary:
      'bg-black/60 backdrop-blur-sm border-2 border-purple-500/50 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-900/40'
  };
</script>

<a
  {href}
  {target}
  class="group flex items-center gap-2 rounded-full {styles[
    variant
  ]} px-8 py-3 font-semibold shadow-lg transition-all hover:scale-105 {className}"
>
  {@render children()}
</a>
