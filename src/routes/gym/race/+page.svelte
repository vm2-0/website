<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import TrainingLog from '$lib/components/gym/TrainingLog.svelte';
  import { playTrainingSound } from '$lib/utils/audio';
  import Timeline from '$lib/components/gym/Timeline.svelte';
  import QuestOverlay from '$lib/components/gym/QuestOverlay.svelte';
  import { walletStore } from '$lib/walletStore';
  import { trainingEvents } from '$lib/stores/training';
  import { activeRace, startPolling, stopPolling } from '$lib/stores/activeRace';
  import type { RaceSession } from '$lib/types';
  import { findFastestRegion } from '$lib/utils';
  import { goto } from '$app/navigation';

  // Initialize with empty URLSearchParams for SSR
  let urlParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams('');
  let isLoading = true;
  let hasShownWalletMessage = false;
  let startTime: number;
  let raceSession: RaceSession | null = null;
  let error: string | null = null;
  let currentQuest = '';
  let currentHint = '';
  let maxReward = 0;
  let focusInterval: NodeJS.Timeout;
  let hintInterval: NodeJS.Timeout;

  function handleError(message: string) {
    error = message;
    isLoading = false;
    trainingEvents.addEvent({
      type: 'system',
      message: `Error: ${message}`,
      timestamp: Date.now()
    });
  }

  async function requestHint() {
    const sessionId = urlParams.get('s');
    if (!sessionId || !raceSession?.vm_credentials) return;

    try {
      // Get screenshot from canvas
      const outerIframe = document.querySelector(
        'iframe[title="Guacamole Remote Desktop"]'
      ) as HTMLIFrameElement;
      if (!outerIframe) {
        console.error('Outer iframe not found');
        return;
      }

      // Access the outer iframe's document
      const outerIframeDocument =
        outerIframe.contentDocument || outerIframe.contentWindow?.document;
      if (!outerIframeDocument) {
        console.error('Could not access iframe document');
        return;
      }

      // Locate the canvas element inside the iframe
      const canvas = outerIframeDocument.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas element not found inside iframe');
        return;
      }

      // Get the canvas context and extract as image
      let imageData;
      try {
        imageData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality
      } catch (err) {
        console.error('Error capturing canvas content:', err);
        return;
      }

      const res = await fetch(`/api/v1/races/session/${sessionId}/hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          screenshot: imageData
        })
      });

      if (!res.ok) {
        console.error('Failed to get hint');
        return;
      }

      const result = await res.json();
      const data = result.success ? result.data : result;
      console.log(data);

      // Update quest if one exists
      if (data.quest || data.newQuest) {
        currentQuest = data.newQuest || data.quest;
        maxReward = data.maxReward || 0;
      }

      // Update hint
      currentHint = data.hint;

      // Add events to training log
      data.events?.forEach((event: any) => {
        trainingEvents.addEvent({
          type: event.type,
          message: event.message,
          timestamp: event.timestamp,
          frame: event.frame,
          metadata: event.metadata
        });
      });
    } catch (err) {
      console.error('Error requesting hint:', err);
    }
  }

  async function initializeRace() {
    // Wait a bit for wallet to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { connected, publicKey } = $walletStore;
    if (!connected || !publicKey) {
      handleError('Please connect your wallet to participate in races');
      hasShownWalletMessage = true;
      return;
    }

    // Check if there's already an active race
    if ($activeRace && $activeRace.sessionId !== urlParams.get('s')) {
      if (confirm('You have another active race session. Would you like to return to it?')) {
        goto(`/gym/race?s=${$activeRace.sessionId}`);
        return;
      } else {
        // Stop the other session
        await fetch(`/api/v1/races/session/${$activeRace.sessionId}/stop`, {
          method: 'POST'
        });
        stopPolling();
      }
    }

    console.log('using address', publicKey.toBase58());

    const raceId = urlParams.get('id');
    const sessionId = urlParams.get('s');

    if (!raceId && !sessionId) {
      handleError('No race ID provided');
      return;
    }

    if (sessionId) {
      try {
        // Get existing session
        const res = await fetch(`/api/v1/races/session/${sessionId}`);
        if (!res.ok) {
          const data = await res.json();
          handleError(data.error || 'Failed to load session');
          return;
        }

        const result = await res.json();
        const data = result.success ? result.data : result;
        raceSession = data;
        startTime = new Date(data.created_at).getTime();

        // Wait for iframe and canvas to load
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Generate initial quest
        await requestHint();

        isLoading = false;
      } catch (err) {
        handleError(err instanceof Error ? err.message : 'Failed to load session');
      }
    } else {
      // get closest aws region... default to us-east
      const region = (await findFastestRegion()) || 'us-east-2';

      try {
        trainingEvents.addEvent({
          type: 'system',
          message: `Starting race ${raceId}...`,
          timestamp: Date.now()
        });

        const res = await fetch(`/api/v1/races/${raceId}/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: publicKey.toBase58(),
            region
          })
        });

        if (!res.ok) {
          const data = await res.json();
          const errorMsg = data.error || 'Failed to start race';
          handleError(errorMsg);
          throw new Error(errorMsg);
        }

        const resp = await res.json();
        const data = resp.data;

        // Set up Guacamole auth token
        if (data.vm_credentials?.guacToken && typeof window !== 'undefined') {
          localStorage.setItem(
            'GUAC_AUTH',
            JSON.stringify({
              authToken: data.vm_credentials.guacToken,
              dataSource: 'mysql'
            })
          );
        }

        // Store session data
        const sessionData = {
          status: 'active',
          vm_credentials: {
            ...data.vm_credentials
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        raceSession = sessionData;
        startTime = Date.now();

        // Start polling for session status
        startPolling(data.sessionId);

        trainingEvents.addEvent({
          type: 'system',
          message: `Race started successfully`,
          timestamp: Date.now()
        });

        // Update URL with session ID
        urlParams.set('s', data.sessionId);
        if (typeof window !== 'undefined') {
          window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${urlParams.toString()}`
          );
        }

        if (sessionData.status !== 'active') {
          handleError('Session is not active');
          return;
        }

        // Wait for iframe and canvas to load
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Generate initial quest
        await requestHint();

        isLoading = false;
      } catch (err) {
        handleError(err instanceof Error ? err.message : 'Failed to load session');
      }
    }
  }

  let handleBeforeUnload: ((e: BeforeUnloadEvent) => void) | undefined;

  async function stopRace() {
    const sessionId = urlParams.get('s');
    if (sessionId) {
      try {
        const response = await fetch(`/api/v1/races/session/${sessionId}/stop`, {
          method: 'POST'
        });
        const result = await response.json();
        const data = result.success ? result.data : result;
        if (data.totalRewards) {
          trainingEvents.addEvent({
            type: 'system',
            message: `Total rewards for this session: ${data.totalRewards} $VIRAL`,
            timestamp: Date.now()
          });
          // Wait a moment for the message to be visible
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error('Error stopping race:', error);
      }
      stopPolling();
    }
    if (handleBeforeUnload) window.removeEventListener('beforeunload', handleBeforeUnload);
    goto('/gym');
  }

  // Function to refocus Guacamole iframe
  function refocusGuacamole() {
    // Do not refocus if focus is on an input field
    const focused = document.activeElement;
    if (focused && focused !== document.body && focused.tagName !== 'IFRAME') {
      return;
    }

    // Get iframe and focus it
    const iframe = document.querySelector(
      'iframe[title="Guacamole Remote Desktop"]'
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.focus();
    }
  }

  // Subscribe to training events to play sounds
  let unsubscribeTraining: () => void;

  onMount(() => {
    // Update URL params with actual window location
    urlParams = new URLSearchParams(window.location.search);

    // Subscribe to training events
    unsubscribeTraining = trainingEvents.subscribe((events) => {
      const latestEvent = events[events.length - 1];
      if (latestEvent) {
        playTrainingSound(latestEvent.type === 'reward' ? 'reward' : 'other');
      }
    });

    // Add beforeunload handler
    handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initialize the race
    initializeRace();

    // Set up interval for hint requests after a delay
    setTimeout(() => {
      hintInterval = setInterval(requestHint, 5000); // Request hints every 5 seconds
    }, 5000); // Wait 5 seconds before starting hint requests

    // Start polling for session status
    const sessionId = urlParams.get('s');
    if (sessionId) {
      startPolling(sessionId);
    }

    // Add aggressive refocus handlers
    document.addEventListener('click', refocusGuacamole);
    document.addEventListener('keydown', refocusGuacamole);

    // Set up interval to constantly try to refocus
    focusInterval = setInterval(refocusGuacamole, 100);

    // Subscribe to activeRace store to handle expiration
    const unsubscribe = activeRace.subscribe((race) => {
      if (!race && sessionId) {
        // Session expired, redirect to gym
        goto('/gym');
      }
    });

    return () => {
      document.removeEventListener('click', refocusGuacamole);
      document.removeEventListener('keydown', refocusGuacamole);
      clearInterval(focusInterval);
      unsubscribe();
    };
  });

  onDestroy(() => {
    trainingEvents.addEvent({
      type: 'system',
      message: 'Race session ended',
      timestamp: Date.now()
    });
    if (handleBeforeUnload) window.removeEventListener('beforeunload', handleBeforeUnload);
    if (unsubscribeTraining) unsubscribeTraining();
    if (focusInterval) clearInterval(focusInterval);
    if (hintInterval) clearInterval(hintInterval);
    stopPolling();
  });
</script>

<div class="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] bg-black">
  <!-- Main Content -->
  <div class="flex flex-1 flex-col">
    <!-- Guacamole Stream -->
    <div class="flex flex-1 items-center justify-center p-6">
      <div
        style="width: calc(100vw - 319px); height: calc(100vh - 300px);"
        class="aspect-video w-full overflow-hidden rounded-sm bg-black/50 shadow-lg">
        <div class="relative h-full w-full">
          {#if raceSession?.vm_credentials?.guacToken}
            <div class="absolute inset-0 rounded-sm focus-within:ring-2 focus-within:ring-blue-500">
              <iframe
                src={`/guacamole/#/client/${raceSession.vm_credentials.guacClientId}?token=${raceSession.vm_credentials.guacToken}`}
                title="Guacamole Remote Desktop"
                class="h-full w-full border-0"
                allow="clipboard-read; clipboard-write">
              </iframe>
            </div>
          {/if}

          <!-- Quest Overlay -->
          {#if currentQuest}
            <QuestOverlay quest={currentQuest} hint={currentHint} {maxReward} isHintActive={true} />
          {/if}
        </div>
      </div>
    </div>

    {#if !isLoading}
      <Timeline {startTime} />
    {/if}

    <div class="space-y-4 p-4">
      <button
        class="w-full rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
        on:click={stopRace}>
        Stop Race
      </button>
    </div>
  </div>

  <!-- Right Sidebar (Training Log) -->
  <TrainingLog {startTime} race={raceSession} />
</div>
