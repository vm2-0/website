import { writable } from 'svelte/store';

export interface TrainingEvent {
    id: string;
    type: 'task' | 'mouse' | 'keyboard' | 'scroll' | 'system' | 'hint' | 'quest' | 'reasoning' | 'reward';
    message: string;
    timestamp: number; // Unix timestamp in ms
    frame?: number; // VNC frame number
    coordinates?: { x: number; y: number };
    metadata?: {
        maxReward?: number;
        scoreValue?: number;
        rewardValue?: number;
        transaction?: string;
    };
}

export interface EventColors {
    task: string;
    mouse: string;
    keyboard: string;
    scroll: string;
    system: string;
    hint: string;
    quest: string;
    reasoning: string;
    reward: string;
}

export const eventColors: EventColors = {
    task: 'rgb(168, 85, 247)',    // Purple
    mouse: 'rgb(96, 165, 250)',   // Blue
    keyboard: 'rgb(34, 197, 94)', // Green
    scroll: 'rgb(234, 179, 8)',   // Yellow
    system: 'rgb(239, 68, 68)',   // Red
    hint: 'rgb(14, 165, 233)',    // Sky blue
    quest: 'rgb(217, 119, 6)',    // Amber
    reasoning: 'rgb(251, 146, 60)',  // Orange
    reward: 'rgb(234, 179, 8)'   // Yellow
};

function createTrainingStore() {
    const { subscribe, set, update } = writable<TrainingEvent[]>([]);

    return {
        subscribe,
        addEvent: (event: Omit<TrainingEvent, 'id'>) => {
            update(events => {
                // Deduplicate rapid identical events
                const lastEvent = events[events.length - 1];
                if (lastEvent && 
                    lastEvent.type === event.type && 
                    lastEvent.message === event.message &&
                    event.timestamp - lastEvent.timestamp < 100) { // 100ms threshold
                    return events;
                }

                // Add new event
                return [...events, {
                    ...event,
                    id: crypto.randomUUID()
                }];
            });
        },
        reset: () => set([]),
        highlightEvent: (id: string) => {
            // This will be used by components to highlight events
            window.dispatchEvent(new CustomEvent('highlight-training-event', { 
                detail: { id } 
            }));
        }
    };
}

export const trainingEvents = createTrainingStore();
