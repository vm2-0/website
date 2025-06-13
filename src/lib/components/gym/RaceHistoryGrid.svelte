<script lang="ts">
  import { Shapes, Trophy, CircleDot, HandCoins, FileText, Video } from 'lucide-svelte';
  import CustomCheckbox from './CustomCheckbox.svelte';

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

  export let races: Race[] = [];
  export let onSelectionChanged: (selectedRows: Race[]) => void;

  $: selectedRaces = new Set(races.filter((r) => r.selected).map((r) => r.id));

  function toggleSelection(race: Race) {
    const updatedRaces = races.map((r) => (r.id === race.id ? { ...r, selected: !r.selected } : r));
    onSelectionChanged(updatedRaces.filter((r) => r.selected));
  }

  function toggleAll() {
    const allSelected = races.every((r) => r.selected);
    const updatedRaces = races.map((r) => ({ ...r, selected: !allSelected }));
    onSelectionChanged(updatedRaces.filter((r) => r.selected));
  }

  function getSkillColor(skill: string): { bg: string; text: string } {
    const colors = [
      { bg: 'bg-blue-500/20', text: 'text-blue-400' },
      { bg: 'bg-purple-500/20', text: 'text-purple-400' },
      { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
      { bg: 'bg-amber-500/20', text: 'text-amber-400' },
      { bg: 'bg-rose-500/20', text: 'text-rose-400' },
      { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
      { bg: 'bg-pink-500/20', text: 'text-pink-400' },
      { bg: 'bg-orange-500/20', text: 'text-orange-400' },
      { bg: 'bg-cyan-500/20', text: 'text-cyan-400' }
    ];

    const hash = skill.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }
</script>

<div class="w-full overflow-hidden rounded-lg bg-stone-900/25 backdrop-blur-sm">
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-stone-900/50 text-sm text-gray-400">
        <tr>
          <th class="w-12 p-3">
            <CustomCheckbox checked={races.every((r) => r.selected)} onChange={toggleAll} />
          </th>
          <th class="w-1/2 p-3 text-left font-medium">Race</th>
          <th class="w-24 p-3 text-left font-medium">Training Tokens</th>
          <th class="w-24 p-3 text-left font-medium">Earnings</th>
          <th class="w-24 p-3 text-left font-medium">Status</th>
          <th class="w-32 p-3 text-left font-medium">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-800/50">
        {#each races as race}
          <tr class="hover:bg-stone-800/25">
            <td class="p-3">
              <CustomCheckbox checked={race.selected} onChange={() => toggleSelection(race)} />
            </td>
            <td class="p-3">
              <div class="font-medium text-white">{race.name}</div>
              <span class="text-[10px] text-gray-400">ID: {race.id}</span>
            </td>
            <td class="p-3">
              <div class="flex items-center gap-1 text-gray-400">
                <Shapes class="h-4 w-4 text-stone-500" />
                {race.actionTokens}
              </div>
            </td>
            <td class="p-3">
              <div class="flex items-center gap-1 text-gray-400">
                <Trophy class="h-4 w-4 text-stone-500" />
                {race.earnings}
              </div>
            </td>
            <td class="p-3">
              <span
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-sm {race.status ===
                'expired'
                  ? 'bg-green-600/20 text-green-400'
                  : race.status === 'processing'
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'bg-yellow-600/20 text-yellow-400'}"
              >
                <CircleDot class="h-3 w-3" />
                {race.status === 'expired'
                  ? 'Ready'
                  : race.status === 'processing'
                    ? 'Processing'
                    : 'Active'}
              </span>
            </td>
            <td class="p-3">
              <div class="flex items-center gap-2">
                <a
                  class="rounded-lg bg-stone-800/50 p-1.5 text-gray-400 hover:bg-stone-700/50 hover:text-white"
                  title="View Logs"
                  target="_blank"
                  href="/api/v1/races/export?sessionId={race.id}"
                >
                  <FileText class="h-4 w-4" />
                </a>
                {#if race.transaction_signature}
                  <a
                    href={`https://solscan.io/tx/${race.transaction_signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="rounded-lg bg-stone-800/50 p-1.5 text-gray-400 hover:bg-stone-700/50 hover:text-white"
                    title="View Transaction"
                  >
                    <HandCoins class="h-4 w-4" />
                  </a>
                {/if}
                <a
                  class="group rounded-lg bg-stone-800/50 p-1.5 text-gray-400 transition-all duration-100 hover:bg-stone-700/50 hover:text-white"
                  title="Download Recording"
                  target="_blank"
                  href="https://training-gym.s3.us-east-2.amazonaws.com/recording-{race.id}"
                >
                  <Video class="h-4 w-4" />
                </a>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
