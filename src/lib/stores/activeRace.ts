import { writable } from 'svelte/store';

export interface ActiveRace {
  sessionId: string;
  preview?: string;
  status: string;
  lastUpdated: Date;
  lastQuest?: string;
  createdAt: Date;
}

export const activeRace = writable<ActiveRace | null>(null);

// Poll for active race status
let pollInterval: NodeJS.Timeout | null = null;

export function startPolling(sessionId: string) {
  if (pollInterval) {
    clearInterval(pollInterval);
  }

  // Poll every 5 seconds
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/v1/races/session/${sessionId}`);
      if (!res.ok) {
        if (res.status === 410) { // Session expired
          activeRace.set(null);
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
        return;
      }

      const [sessionRes, eventsRes] = await Promise.all([
        res,
        fetch(`/api/v1/races/export?sessionId=${sessionId}`)
      ]);

      const sessionResult = await sessionRes.json();
      const eventsResult = await eventsRes.json();
      
      // Extract data from the standardized response format
      const data = sessionResult.success ? sessionResult.data : sessionResult;
      const eventsData = eventsResult.success ? eventsResult.data : eventsResult;

      // Find the latest quest event
      const lastQuest = eventsData.events
        ?.filter((e: any) => e.type === 'quest')
        .pop()?.message;

      activeRace.set({
        sessionId,
        preview: data.preview,
        status: data.status,
        lastUpdated: new Date(data.updated_at),
        lastQuest,
        createdAt: new Date(data.created_at)
      });
    } catch (error) {
      console.error('Error polling race status:', error);
    }
  }, 5000);
}

export function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  activeRace.set(null);
}
