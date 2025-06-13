<script lang="ts">
  import { BellRing, MessagesSquare, ArrowRight } from 'lucide-svelte';
</script>

<div class="mx-auto max-w-2xl rounded-3xl bg-stone-900/25 p-8 backdrop-blur-sm md:p-12">
  <div class="mb-6 flex items-center justify-center gap-3">
    <BellRing class="h-6 w-6 text-purple-400" />
    <h3 class="text-xl font-semibold">Get Notified When We Launch</h3>
  </div>

  <div class="flex justify-center">
    <a href="https://t.me/viralmind" target="_blank" class="group inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition-all hover:bg-white/15">
      <MessagesSquare class="h-5 w-5" />
      Join Our Telegram
      <ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </a>
  </div>
</div>
