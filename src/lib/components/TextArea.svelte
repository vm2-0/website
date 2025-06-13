<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    label?: string | undefined;
    validationState?: 'default' | 'error';
    errorText?: string | undefined;
    helper?: string | undefined;
    sizeVariant?: 'default' | 'sm' | 'lg';
    className?: string | undefined;
  }

  let {
    id = undefined,
    value = $bindable(''),
    placeholder = undefined,
    className,
    disabled
  }: Props = $props();
</script>

<textarea
  {id}
  bind:value
  {disabled}
  {placeholder}
  class={`h-32 w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${className}`}
></textarea>
