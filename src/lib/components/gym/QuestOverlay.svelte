<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Gem } from 'lucide-svelte';

    export let quest: string = '';
    export let hint: string = '';
    export let isHintActive: boolean = true;
    export let maxReward: number = 0;

    let overlayPosition: 'left' | 'right' = 'left';
    let mouseX = 0;

    let container: HTMLElement;

    function handleMouseMove(e: MouseEvent) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        overlayPosition = mouseX > rect.width / 2 ? 'left' : 'right';
    }

    onMount(() => {
        container = document.querySelector('.relative.w-full.h-full') as HTMLElement;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => {
                container?.removeEventListener('mousemove', handleMouseMove);
            };
        }
    });
</script>

<div 
    class="absolute top-4 {overlayPosition === 'left' ? 'left-4' : 'right-4'} z-50 max-w-[300px] transition-all duration-300 ease-in-out"
    transition:fade
>
    <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
        <div class="flex items-end justify-between mb-2">
            <h3 class="text-sm uppercase tracking-wider font-bold text-gray-800">Current Quest</h3>
            {#if maxReward > 0}
                <div class="bg-gradient-to-br from-amber-200 to-amber-500 rounded-full px-2 shadow-sm border border-amber-200/50">
                    <span class="text-sm font-bold text-amber-900 flex items-center gap-1">
                        <Gem class="w-3.5 h-3.5" />
                        {Math.ceil(maxReward)}*
                    </span>
                </div>
            {/if}
        </div>
            
        <p class="text-gray-900">{quest}</p>
        
        {#if hint}
            <div class="mt-2">
                <h4 class="text-xs uppercase tracking-wider font-bold text-gray-700 mb-1">Hint</h4>
                <p class="text-sm {isHintActive ? 'text-gray-800' : 'text-gray-400'}">
                    {hint}
                </p>
            </div>
        {/if}

        {#if maxReward > 0}
            <div class="mt-3 text-[10px] text-gray-500">
                * maximum potential reward
            </div>
        {/if}
    </div>
</div>
