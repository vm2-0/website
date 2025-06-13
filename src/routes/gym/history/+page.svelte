<script lang="ts">
  import { onMount } from 'svelte';
  import { Coins, Download, BrainCircuit } from 'lucide-svelte';
  import { walletStore } from '$lib/walletStore';
  import TrainDialog from '$lib/components/gym/TrainDialog.svelte';
  import ExportDialog from '$lib/components/gym/ExportDialog.svelte';
  import SkillNetwork from '$lib/components/gym/SkillNetwork.svelte';
  import RaceHistoryGrid from '$lib/components/gym/RaceHistoryGrid.svelte';

  let mousePosition = { x: 0, y: 0 };
  let showTrainDialog = false;
  let showActionsMenu = false;

  interface Race {
    id: string;
    name: string;
    actionTokens: number;
    earnings: number;
    selected: boolean;
    status: string;
    skills: string[];
    transaction_signature?: string;
  }

  let races: Race[] = [];
  let showExportDialog = false;
  let selectedCount = 0;
  let selectedSkills: Set<string> = new Set();
  let allSelected = false;

  async function loadRaceSessions() {
    if (!$walletStore.connected || !$walletStore.publicKey) {
      races = [];
      return;
    }

    try {
      const response = await fetch('/api/v1/races/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': $walletStore.publicKey.toString()
        }
      });
      const result = await response.json();
      const data = result.success ? result.data : result;

      // Transform API data to match the Race interface
      races = data.map((session: any, index: number) => ({
        id: session._id,
        name: session.title || `Race ${session.challenge}`,
        selected: false,
        status: session.status || 'active',
        skills: session.category ? [session.category] : [],
        actionTokens: session.actionTokens || 0,
        earnings: Number((session.earnings || 0).toFixed(2)),
        transaction_signature: session.transaction_signature
      }));
    } catch (error) {
      console.error('Error loading race sessions:', error);
    }
  }

  $: {
    selectedCount = races.filter((r) => r.selected).length;
    selectedSkills = new Set();
    races
      .filter((r) => r.selected)
      .forEach((race) => {
        race.skills.forEach((skill) => selectedSkills.add(skill));
      });
    allSelected = races.length > 0 && races.every((r) => r.selected);
  }

  function handleMouseMove(event: MouseEvent) {
    mousePosition.x = (event.clientX / window.innerWidth) * 100;
    mousePosition.y = (event.clientY / window.innerHeight) * 100;
  }

  function handleSelectionChanged(selectedRows: any[]) {
    races = races.map((race) => ({
      ...race,
      selected: selectedRows.some((row) => row.id === race.id)
    }));
  }

  async function handleExport(type: 'raw' | 'full') {
    if (type === 'raw') {
      try {
        const selectedIds = races.filter((r) => r.selected).map((r) => r.id);
        const response = await fetch('/api/v1/races/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionIds: selectedIds })
        });

        if (!response.ok) throw new Error('Export failed');

        const result = await response.json();

        const data = result.success ? result.data : result;

        // Create and download the JSON file
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const jsonUrl = window.URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `race-sessions-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        window.URL.revokeObjectURL(jsonUrl);
        document.body.removeChild(jsonLink);

        // Download videos for each session
        for (const session of data) {
          if (session.video_path) {
            try {
              const videoResponse = await fetch(session.video_path);
              if (!videoResponse.ok) {
                console.error(`Failed to fetch video for session ${session.session_id}`);
                continue;
              }

              const videoBlob = await videoResponse.blob();
              const videoUrl = window.URL.createObjectURL(videoBlob);
              const videoLink = document.createElement('a');
              videoLink.href = videoUrl;

              // Extract filename from path or use session ID
              const filename =
                session.video_path.split('/').pop() || `session-${session.session_id}.mp4`;
              videoLink.download = filename;

              document.body.appendChild(videoLink);
              videoLink.click();
              window.URL.revokeObjectURL(videoUrl);
              document.body.removeChild(videoLink);
            } catch (error) {
              console.error(`Error downloading video for session ${session.session_id}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error exporting data:', error);
      }
    }
    showExportDialog = false;
  }

  function handleTrain() {
    // TODO: Implement training functionality
    console.log('Training initiated');
  }

  function handleTrade() {
    // TODO: Implement trade functionality
    console.log('Trade marketplace coming soon');
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  // Watch wallet store changes
  $: if ($walletStore) {
    loadRaceSessions();
  }
</script>

<div class="min-h-screen bg-black pb-24 text-white">
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    <!-- Content Container -->
    <div class="relative z-10 mx-auto w-full max-w-[1400px] px-8">
      <!-- Main Title -->
      <h1 class="my-6 text-5xl font-bold drop-shadow-lg md:text-7xl">Training History</h1>

      <!-- Subtitle -->
      <p class="mb-12 max-w-2xl text-xl text-gray-400 md:text-2xl">
        Your recorded computer-use demonstrations for training AI agents, ready to be used as
        behavioral datasets.
      </p>

      <!-- Info Section -->
      <div class="mb-12 grid gap-4 text-sm text-gray-400 md:grid-cols-2">
        <div class="rounded-xl bg-stone-900/25 p-4 backdrop-blur-sm">
          <div class="flex items-center gap-2 text-purple-400">
            <BrainCircuit class="h-4 w-4" />
            <span class="font-semibold">Neural Upload</span>
          </div>
          <p class="mt-2">
            Upload human behaviors into agents directly through powerful neural fine-tuning or
            flexible skill databases. Instant datasets for LoRA, RAG, etc
          </p>
        </div>
        <div class="rounded-xl bg-stone-900/25 p-4 backdrop-blur-sm">
          <div class="flex items-center gap-2 text-green-400">
            <Coins class="h-4 w-4" />
            <span class="font-semibold">Data Marketplace</span>
          </div>
          <p class="mt-2">
            Trade valuable training data in the decentralized marketplace. Share agentic knowledge
            and earn rewards from the AI training community.
          </p>
        </div>
      </div>

      <!-- Action Menu Bar -->
      <div
        class="mb-8 flex items-center justify-between rounded-xl bg-stone-900/25 px-4 py-3 backdrop-blur-sm">
        <button
          on:click={() => (showExportDialog = true)}
          class="flex items-center gap-2 rounded-lg bg-stone-800/50 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700/50 disabled:opacity-50"
          disabled={selectedCount === 0}>
          <Download class="h-4 w-4" />
          Export Dataset
        </button>

        <div class="flex items-center gap-2">
          <button
            on:click={() => (showTrainDialog = true)}
            class="flex items-center gap-2 rounded-lg bg-stone-800/50 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700/50">
            <BrainCircuit class="h-4 w-4" />
            Train
            <span class="rounded bg-yellow-500 px-1.5 py-0.5 text-xs text-black">Soon</span>
          </button>

          <button
            on:click={handleTrade}
            class="flex items-center gap-2 rounded-lg bg-stone-800/50 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700/50">
            <Coins class="h-4 w-4" />
            Trade
            <span class="rounded bg-yellow-500 px-1.5 py-0.5 text-xs text-black">Soon</span>
          </button>
        </div>
      </div>

      <RaceHistoryGrid {races} onSelectionChanged={handleSelectionChanged} />

      <!-- Neural Network Visualization -->
      <div class="mt-12">
        <div class="mb-4 flex items-center gap-2">
          <BrainCircuit class="h-5 w-5 text-purple-400" />
          <span class="text-lg font-semibold">Neural Skill Network</span>
          <span class="ml-2 text-sm text-gray-400">
            Visualization of known skill signals in the selected data
          </span>
        </div>
        <SkillNetwork skills={Array.from(selectedSkills)} />
      </div>
    </div>
  </div>

  <!-- Background effects -->
  <div class="absolute inset-0 z-[1] bg-gradient-to-b from-purple-900/20 to-black"></div>
  <div
    class="absolute inset-0 z-[2] transition-transform duration-1000 ease-out"
    style="background: radial-gradient(600px circle at {mousePosition.x}% {mousePosition.y}%, rgb(147, 51, 234, 0.1), transparent 100%); 
            transform: translate({(mousePosition.x - 50) * -0.05}px, {(mousePosition.y - 50) *
      -0.05}px)">
  </div>
  <div class="absolute inset-0 z-[3] bg-gradient-to-b from-black via-transparent to-black"></div>
</div>

<TrainDialog
  bind:show={showTrainDialog}
  {selectedCount}
  onClose={() => (showTrainDialog = false)} />

<ExportDialog
  bind:show={showExportDialog}
  {selectedCount}
  onClose={() => (showExportDialog = false)}
  onExport={handleExport} />
