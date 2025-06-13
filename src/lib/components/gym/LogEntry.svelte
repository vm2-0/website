<script lang="ts">
    import { Brain, Mouse, Keyboard, Terminal, HelpCircle, Trophy, Scale, Gem } from 'lucide-svelte';
    import { eventColors, type TrainingEvent } from '$lib/stores/training';

    export let id: string;
    export let type: TrainingEvent['type'];
    export let message: string;
    export let timestamp: string;
    export let coordinates: { x: number; y: number } | undefined = undefined;
    export let repeat: number | undefined = undefined;
    export let trajectory: { x: number; y: number; timestamp: number }[] | undefined = undefined;

    const specialKeyMap: Record<string, string> = {
        'backspace': '⌫',
        'delete': '⌦',
        'return': '↵',
        'enter': '↵',
        'tab': '⇥',
        'space': '␣',
        'escape': 'esc',
        'up': '↑',
        'down': '↓',
        'left': '←',
        'right': '→',
        'ctrl': '⌃',
        'alt': '⌥',
        'shift': '⇧',
        'super': '⌘',
        'meta': '⌘',
    };

    
    // Function to parse keyboard input into segments (regular text and special keys)
    function parseKeyboardInput(input: string) {
        // Remove the "Key pressed: " prefix if it exists
        const keySequence = input.replace('Key pressed: ', '');
        
        // Split by + for key combinations
        const segments = keySequence.split('+').map(segment => segment.trim().toLowerCase());
        
        return segments.map(segment => ({
            key: segment,
            isSpecial: segment in specialKeyMap,
            display: specialKeyMap[segment] || segment
        }));
    }

    function getStyles(eventType: TrainingEvent['type']): { containerClasses: string, iconClasses: string } {
        const baseContainer = "log-entry flex gap-2 items-start p-2 rounded-lg backdrop-blur-lg animate-fadeIn transition-all duration-300";
        const baseIcon = "p-1.5 rounded-lg flex items-center justify-center";
        const color = eventColors[eventType];
        
        switch (eventType) {
            case 'task':
                return { 
                    containerClasses: `${baseContainer} bg-purple-950/40 border border-purple-500/30 shadow-[0_0_10px_rgba(149,117,205,0.15)]`,
                    iconClasses: `${baseIcon} bg-purple-400/20 text-purple-400`
                };
            case 'mouse':
                return { 
                    containerClasses: `${baseContainer} bg-black/30 border border-blue-500/20`,
                    iconClasses: `${baseIcon} bg-blue-400/10 text-blue-400`
                };
            case 'keyboard':
                return { 
                    containerClasses: `${baseContainer} bg-black/30 border border-green-500/20`,
                    iconClasses: `${baseIcon} bg-green-400/10 text-green-400`
                };
            case 'scroll':
                return { 
                    containerClasses: `${baseContainer} bg-black/30 border border-yellow-500/20`,
                    iconClasses: `${baseIcon} bg-yellow-400/10 text-yellow-400`
                };
            case 'system':
                return { 
                    containerClasses: `${baseContainer} bg-black/30 border border-red-500/20`,
                    iconClasses: `${baseIcon} bg-red-400/10 text-red-400`
                };
            case 'hint':
                return { 
                    containerClasses: `${baseContainer} bg-sky-950/40 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]`,
                    iconClasses: `${baseIcon} bg-sky-400/20 text-sky-400`
                };
            case 'quest':
                return { 
                    containerClasses: `${baseContainer} bg-amber-950/40 border border-amber-500/30 shadow-[0_0_10px_rgba(217,119,6,0.15)]`,
                    iconClasses: `${baseIcon} bg-amber-400/20 text-amber-400`
                };
            default:
                return { 
                    containerClasses: `${baseContainer} bg-black/30 border border-white/10`,
                    iconClasses: `${baseIcon} bg-white/10 text-white/60`
                };
        }
    }

    function getIcon(eventType: TrainingEvent['type']): typeof Brain | typeof Mouse | typeof Keyboard | typeof Terminal | typeof HelpCircle | typeof Trophy {
        switch (eventType) {
            case 'task': return Brain;
            case 'mouse': return Mouse;
            case 'keyboard': return Keyboard;
            case 'scroll': return Mouse;
            case 'system': return Terminal;
            case 'hint': return HelpCircle;
            case 'quest': return Trophy;
            case 'reasoning': return Scale;
            case 'reward': return Gem;
            default: return Terminal;
        }
    }

    function formatCoordinates(x: number, y: number): string {
        return `(${x}, ${y})`;
    }

    const { containerClasses, iconClasses } = getStyles(type);
    const Icon = getIcon(type);
</script>

<div class={containerClasses}>
    <div class={iconClasses}>
        <svelte:component this={Icon} size={16} />
    </div>
    <div class="flex-1">
        <div class="text-sm leading-relaxed text-white/90">
            {#if type === 'keyboard'}
                <div class="flex flex-wrap items-center gap-1">
                    {#each parseKeyboardInput(message) as segment}
                        {#if segment.isSpecial}
                            <span class="inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/70 text-xs font-mono leading-none">
                                {segment.display}
                            </span>
                        {:else}
                            {segment.display}
                        {/if}
                    {/each}
                    {#if repeat && repeat > 1}
                        <span class="text-white/60 ml-1">×{repeat}</span>
                    {/if}
                </div>
            {:else}
                {message}
                {#if repeat && repeat > 1}
                    <span class="text-white/60 ml-1">×{repeat}</span>
                {/if}
            {/if}
        </div>
        
        {#if type === 'mouse' && trajectory}
            <div class="mt-1 text-xs text-white/50 font-mono flex items-center gap-1">
                <span>({trajectory[0].x}, {trajectory[0].y})</span>
                <span class="text-white/30">→</span>
                <span>({trajectory[trajectory.length - 1].x}, {trajectory[trajectory.length - 1].y})</span>
            </div>
        {:else if coordinates}
            <div class="mt-0.5 text-xs text-white/50 font-mono">({coordinates.x}, {coordinates.y})</div>
        {/if}
        
        <div class="mt-1 text-xs text-white/40">{timestamp}</div>
    </div>
</div>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    :global(.animate-fadeIn) {
        animation: fadeIn 0.3s ease-out;
    }
</style>
