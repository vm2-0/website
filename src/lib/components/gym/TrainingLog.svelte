<!-- TrainingLog.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Brain } from 'lucide-svelte';
  import LogEntry from './LogEntry.svelte';
  import { trainingEvents } from '$lib/stores/training';
  import type { RaceSession } from '$lib/types';

  export let startTime: number;
  export let race: RaceSession | null;

  let logContainer: HTMLDivElement;
  let accumulatedRewards = 0;

  // Calculate accumulated rewards from events
  $: {
    accumulatedRewards = $trainingEvents.reduce((sum, event) => {
      if (event.type === 'reward' && event.metadata?.rewardValue) {
        return sum + event.metadata.rewardValue;
      }
      return sum;
    }, 0);
  }
  let highlightedEventId: string | null = null;
  let highlightTimeout: ReturnType<typeof setTimeout>;

  function isSpecialKey(message: string): boolean {
    const specialKeys = [
      'backspace',
      'delete',
      'return',
      'enter',
      'tab',
      'space',
      'escape',
      'up',
      'down',
      'left',
      'right',
      'ctrl',
      'alt',
      'shift',
      'super',
      'meta'
    ];

    const key = message.replace('Key pressed: ', '').toLowerCase();
    return specialKeys.some((specialKey) => key.includes(specialKey));
  }

  function combineConsecutiveEvents(events: typeof $trainingEvents) {
    const combined = [];
    let currentGroup = null;
    let repeatCount = 1;
    let lastEventTime = 0;

    for (const event of events) {
      const timeSinceLastEvent = event.timestamp - lastEventTime;

      // Start a new group if too much time has passed
      if (timeSinceLastEvent > 1000) {
        if (currentGroup) {
          combined.push({
            ...currentGroup,
            repeat: repeatCount
          });
          currentGroup = null;
          repeatCount = 1;
        }
      }

      if (event.type === 'keyboard') {
        const isSpecial = isSpecialKey(event.message);
        const lastEvent = currentGroup;

        if (!isSpecial) {
          // Regular text input
          if (lastEvent?.type === 'keyboard' && !isSpecialKey(lastEvent.message)) {
            if (currentGroup)
              currentGroup.message = (
                currentGroup?.message + event.message.replace('Key pressed: ', '')
              ).trim();
          } else {
            if (currentGroup) {
              combined.push({
                ...currentGroup,
                repeat: repeatCount
              });
            }
            currentGroup = {
              ...event,
              message: event.message.replace('Key pressed: ', '')
            };
            repeatCount = 1;
          }
        } else {
          // Special key
          if (lastEvent?.message === event.message && timeSinceLastEvent < 300) {
            repeatCount++;
          } else {
            if (currentGroup) {
              combined.push({
                ...currentGroup,
                repeat: repeatCount
              });
            }
            currentGroup = { ...event };
            repeatCount = 1;
          }
        }
      } else {
        // Non-keyboard events
        const lastEvent = currentGroup;
        if (
          lastEvent?.type === event.type &&
          lastEvent?.message === event.message &&
          timeSinceLastEvent < 1000
        ) {
          repeatCount++;
          if (event.coordinates && currentGroup) {
            currentGroup.coordinates = event.coordinates;
          }
        } else {
          if (currentGroup) {
            combined.push({
              ...currentGroup,
              repeat: repeatCount
            });
          }
          currentGroup = { ...event };
          repeatCount = 1;
        }
      }

      lastEventTime = event.timestamp;
    }

    // Don't forget the last group
    if (currentGroup) {
      combined.push({
        ...currentGroup,
        repeat: repeatCount
      });
    }

    return combined;
  }

  $: combinedEvents = combineConsecutiveEvents($trainingEvents);

  onMount(() => {
    const handleHighlight = (e: CustomEvent<{ id: string }>) => {
      scrollToEvent(e.detail.id);
    };

    window.addEventListener('highlight-training-event', handleHighlight as EventListener);

    return () => {
      window.removeEventListener('highlight-training-event', handleHighlight as EventListener);
    };
  });

  onDestroy(() => {
    if (highlightTimeout) clearTimeout(highlightTimeout);
  });

  function scrollToEvent(id: string) {
    if (!logContainer) return;

    const element = logContainer.querySelector(`[data-event-id="${id}"]`);
    if (!element) return;

    const containerRect = logContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const scrollMargin = 40;

    const scrollTop =
      elementRect.top - containerRect.top - containerRect.height / 2 + elementRect.height / 2;
    const minScroll = scrollMargin;
    const maxScroll = logContainer.scrollHeight - containerRect.height - scrollMargin;
    const finalScroll = Math.max(
      minScroll,
      Math.min(maxScroll, logContainer.scrollTop + scrollTop)
    );

    logContainer.scrollTo({
      top: finalScroll,
      behavior: 'smooth'
    });

    highlightedEventId = id;
    if (highlightTimeout) clearTimeout(highlightTimeout);
    highlightTimeout = setTimeout(() => {
      highlightedEventId = null;
    }, 2000);
  }

  function scrollToBottom() {
    if (logContainer) {
      logContainer.scrollTo({
        top: logContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  function formatTimestamp(ms: number): string {
    return new Date(startTime + ms).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  $: if ($trainingEvents.length > 0) {
    setTimeout(scrollToBottom, 0);
  }
</script>

<div
  class="relative flex w-[320px] flex-col overflow-hidden border-l border-purple-500/30 bg-black/95 shadow-[-4px_0_20px_rgba(149,117,205,0.1)]"
>
  <div class="relative z-10 border-b border-purple-500/20 bg-black/70 p-3">
    <div
      class="flex items-center gap-2 text-lg font-medium text-purple-400 drop-shadow-[0_0_10px_rgba(149,117,205,0.5)]"
    >
      <Brain size={20} />
      Neural Link
    </div>
    <div class="ml-7 mt-0.5 text-xs text-white/60">Live Training Session</div>
    {#if accumulatedRewards > 0}
      <div class="ml-7 mt-2 text-sm">
        <span class="text-purple-400">{accumulatedRewards.toFixed(2)} $VIRAL</span>
        <div class="text-xs text-white/60">Will be released at the end of the race</div>
      </div>
    {/if}
  </div>

  <div
    bind:this={logContainer}
    class="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%_-_20px),transparent)] [&::-webkit-scrollbar-thumb:hover]:bg-purple-400/50 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-purple-400/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1"
  >
    {#each combinedEvents as event (event.id)}
      <div
        data-event-id={event.id}
        class="transition-all duration-300"
        class:highlight={highlightedEventId === event.id}
      >
        <LogEntry {...event} timestamp={formatTimestamp(event.timestamp)} />
      </div>
    {/each}
  </div>
</div>

<style>
  .highlight {
    transform: scale(1.01);
  }
  .highlight :global(.log-entry) {
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
    animation: glow 1.5s ease-out;
    position: relative;
    background: rgba(168, 85, 247, 0.1);
  }
  .highlight :global(.log-entry)::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    border: 1px solid rgba(168, 85, 247, 0.4);
    animation: border-glow 1.5s ease-out;
    pointer-events: none;
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
      background: rgba(168, 85, 247, 0.1);
    }
    50% {
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
      background: rgba(168, 85, 247, 0.15);
    }
    100% {
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
      background: rgba(168, 85, 247, 0.1);
    }
  }

  @keyframes border-glow {
    0% {
      border-color: rgba(168, 85, 247, 0.4);
    }
    50% {
      border-color: rgba(168, 85, 247, 0.6);
    }
    100% {
      border-color: rgba(168, 85, 247, 0.4);
    }
  }
</style>
