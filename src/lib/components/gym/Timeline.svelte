<script lang="ts">
    import { onDestroy } from 'svelte';
    import { Brain, Mouse, Keyboard, Terminal } from 'lucide-svelte';
    import { trainingEvents, eventColors, type TrainingEvent } from '$lib/stores/training';

    export let startTime: number;
    
    let hoveredEvent: TrainingEvent | null = null;
    let currentTime = 0;
    let timeUpdateInterval: ReturnType<typeof setInterval>;

    function formatTime(ms: number): string {
        const totalSeconds = ms / 1000;
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.floor(totalSeconds % 60);
        
        if (mins === 0) {
            return `${secs}s`;
        }
        return `${mins}m${secs}s`;
    }

    function handleEventHover(event: TrainingEvent | null) {
        hoveredEvent = event;
        if (event) {
            trainingEvents.highlightEvent(event.id);
        }
    }

    function shouldShowTick(ms: number): boolean {
        const seconds = ms / 1000;
        if (timeSeconds <= 60) {
            // Show every 5 seconds in first minute
            return seconds % 5 === 0;
        }
        // After first minute, only show:
        // - Start (0s)
        // - Every minute mark
        // - Current time mark
        // - End mark
        return seconds === 0 || 
               seconds % 60 === 0 || 
               Math.abs(seconds - timeSeconds) < 1 ||
               Math.abs(seconds - Math.ceil(timeSeconds)) < 1;
    }

    function getEventIcon(type: TrainingEvent['type']) {
        switch (type) {
            case 'task': return Brain;
            case 'mouse': return Mouse;
            case 'keyboard': return Keyboard;
            case 'system': return Terminal;
        }
    }

    $: timeSeconds = currentTime / 1000;
    $: ticks = Array.from(
        { length: Math.ceil(timeSeconds / 5) + 1 }, 
        (_, i) => i * 5000 // milliseconds
    );
    
    // Update time at 15Hz
    $: {
        if (timeUpdateInterval) clearInterval(timeUpdateInterval);
        timeUpdateInterval = setInterval(() => {
            currentTime = Date.now() - startTime;
        }, 1000 / 15);
    }

    onDestroy(() => {
        if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    });
</script>

<div class="px-6 py-2">
    <div class="relative">
        <!-- Timeline bar with overflow hidden -->
        <div class="relative h-6 bg-purple-950/30 rounded-full border border-purple-500/20 overflow-hidden">
            <!-- Tick marks -->
            {#each ticks as ms}
                {#if shouldShowTick(ms)}
                    <div 
                        class="absolute top-0 bottom-0 w-px bg-purple-400/20"
                        style="left: {(ms / Math.max(currentTime, 5000)) * 100}%"
                    />
                {/if}
            {/each}

            <!-- Current time marker -->
            <div 
                class="absolute top-0 bottom-0 w-px bg-purple-400/60"
                style="left: {(currentTime / Math.max(currentTime, 5000)) * 100}%"
            />

            <!-- Event dots -->
            {#each $trainingEvents as event}
                <button
                    type="button"
                    class="event-dot absolute top-1/2 rounded-full"
                    style="
                        left: {(event.timestamp / Math.max(currentTime, 5000)) * 100}%;
                        background-color: {eventColors[event.type]};
                        box-shadow: 0 0 0 2px {eventColors[event.type]}33, 0 0 10px {eventColors[event.type]}99;
                    "
                    on:mouseenter={() => handleEventHover(event)}
                    on:mouseleave={() => handleEventHover(null)}
                >
                    {#if hoveredEvent === event}
                        <div class="tooltip">
                            <div class="flex items-center gap-2">
                                <div class="p-1 rounded bg-black/50">
                                    <svelte:component this={getEventIcon(event.type)} size={12} class="text-{event.type === 'task' ? 'purple' : event.type === 'mouse' ? 'blue' : event.type === 'keyboard' ? 'green' : 'red'}-400" />
                                </div>
                                <span>{event.message}</span>
                            </div>
                            <div class="text-xs opacity-60 mt-0.5">
                                {formatTime(event.timestamp)}
                                {#if event.coordinates}
                                    <span class="ml-1 font-mono">({event.coordinates.x}, {event.coordinates.y})</span>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </button>
            {/each}

            <!-- Current time -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="text-xs text-purple-200/60 font-medium tracking-wider">
                    {formatTime(currentTime)}
                </span>
            </div>
        </div>

        <!-- Tick labels (outside timeline bar) -->
        {#each ticks as ms}
            {#if shouldShowTick(ms)}
                <div 
                    class="absolute w-0 h-0"
                    style="left: {(ms / Math.max(currentTime, 5000)) * 100}%"
                >
                    <div class="absolute -bottom-4 text-[10px] text-purple-400/40 whitespace-nowrap transform -translate-x-1/2">
                        {formatTime(ms)}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .event-dot {
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease-out;
    }
    .event-dot:hover {
        transform: translate(-50%, -50%) scale(1.3);
        z-index: 10;
    }
    .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 6px;
        padding: 4px 6px;
        background-color: rgba(88, 28, 135, 0.9);
        color: rgb(243, 232, 255);
        font-size: 10px;
        white-space: nowrap;
        border-radius: 4px;
        z-index: 20;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(168, 85, 247, 0.2);
    }
</style>
