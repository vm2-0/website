<script lang="ts">
  import { X, Trophy, Gift } from 'lucide-svelte';
  import { raceWarningModal } from '$lib/stores/raceWarningModal';

  function close() {
    raceWarningModal.close();
  }

  function proceed() {
    if ($raceWarningModal.raceId) {
      window.location.href = `/gym/race?id=${$raceWarningModal.raceId}`;
    }
  }
</script>

{#if $raceWarningModal.visible}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/80" on:click={close}></div>

    <!-- Modal -->
    <div
      class="relative z-10 mx-auto w-full max-w-3xl rounded-2xl border border-purple-500 bg-gradient-to-b from-purple-900/50 to-black/50 p-8 text-white shadow-xl backdrop-blur-md">
      <button
        class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        on:click={close}>
        <X class="h-6 w-6" />
      </button>

      <div class="mb-6 flex items-center gap-3 text-purple-300">
        <Trophy class="h-8 w-8" />
        <h2 class="text-2xl font-bold">Ready for Your Quest?</h2>
      </div>

      <div class="flex flex-row gap-4">
        <div class="w-1/2">
          <!-- Video Preview -->
          <video
            src="https://cdn.viralmind.ai/demo.mp4"
            class="w-full overflow-hidden rounded-lg border border-purple-500/30 bg-black/30 p-0.5"
            autoplay
            loop
            muted
            playsinline>
          </video>
          <p class="my-2">You're about to enter an exciting virtual desktop environment!</p>
        </div>
        <div class="mb-6 w-1/2 text-gray-200">
          <p class="text-lg font-semibold text-purple-300">You Will</p>
          <ul class="flex flex-col gap-4 pt-2">
            <li class="flex items-start gap-2">
              <Gift class="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
              <span>Complete fun desktop quests with AI guidance</span>
            </li>
            <li class="flex items-start gap-2">
              <Trophy class="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
              <span>Earn rewards for completing challenges</span>
            </li>
            <li class="flex items-start gap-2">
              <Gift class="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
              <span>Train in a safe virtual environment</span>
            </li>
            <li class="flex items-start gap-2">
              <Trophy class="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
              <span>Help improve AI through your quest completion</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="my-6 rounded-lg border border-purple-500/30 bg-black/20 p-4 text-sm">
        <p class="font-medium text-purple-200">
          Privacy Notice: This training session will record all activity in the virtual machine,
          including keystrokes and mouse movements. These recordings are saved for AI training and
          can be exported from your <a
            href="/gym/history"
            class="text-purple-400 underline hover:text-purple-300">
            race history
          </a>
          .
          <strong>Please avoid entering any personal information!</strong>
          🎮
        </p>
      </div>

      <div class="flex justify-end gap-4">
        <button class="px-4 py-2 text-gray-400 transition-colors hover:text-white" on:click={close}>
          Maybe Later
        </button>
        <button
          class="rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-2 font-medium text-white shadow-lg transition-all hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/25"
          on:click={proceed}>
          Start Quest!
        </button>
      </div>
    </div>
  </div>
{/if}
