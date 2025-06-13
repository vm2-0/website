<script lang="ts">
import { onMount } from 'svelte';
import { 
    Dumbbell,
    Trophy,
    Timer,
    MessagesSquare,
    ArrowRight,
    BellRing
} from 'lucide-svelte';

let mousePosition = { x: 0, y: 0 };
let countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
};

// TODO: set launch date here
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 30);

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;

    countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
}

function handleMouseMove(event: MouseEvent) {
    mousePosition.x = (event.clientX / window.innerWidth) * 100;
    mousePosition.y = (event.clientY / window.innerHeight) * 100;
}

onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    clearInterval(timer);
    };
});
</script>

<div class="min-h-screen bg-black text-white pb-24">
<div class="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
    <!-- Content Container -->
    <div class="w-full max-w-4xl mx-auto text-center px-4 relative z-10">
    <!-- Coming Soon Badge -->
    <div class="inline-block px-4 py-2 rounded-full bg-purple-600/20 text-purple-400 mb-8">
        <div class="flex items-center gap-2">
        <Timer class="w-4 h-4" />
        <span>Coming Soon</span>
        </div>
    </div>

    <!-- Main Title -->
    <h1 class="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
        Training Gym
    </h1>
    
    <!-- Subtitle -->
    <p class="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
        Train AI agents through demonstration. Earn $VIRAL for quality contributions.
    </p>

    <!-- Countdown Timer -->
    <!-- <div class="grid grid-cols-4 gap-4 max-w-xl mx-auto mb-16">
        {#each Object.entries(countdown) as [unit, value]}
        <div class="bg-stone-900/40 rounded-xl p-4 backdrop-blur-sm">
            <div class="text-3xl md:text-4xl font-bold mb-1">{value}</div>
            <div class="text-sm text-gray-400">{unit}</div>
        </div>
        {/each}
    </div> -->

    <!-- Feature Cards -->
    <div class="grid md:grid-cols-2 gap-6 mb-12">
        <!-- Free Races -->
        <div class="bg-stone-900/25 rounded-2xl p-8 text-left backdrop-blur-sm">
        <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-purple-600/20 rounded-xl">
            <Trophy class="w-6 h-6 text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold">Free Races</h3>
        </div>
        <p class="text-gray-400 mb-4">Join races by simply holding $VIRAL. No staking required, pure reward potential.</p>
        <a href="https://docs.viralmind.ai/viralmind.ai/training-gym/free-races">
            <div class="flex items-center text-purple-400 group cursor-pointer">
                <span class="mr-2">Learn more</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </a>
        </div>

        <!-- Staked Races -->
        <div class="bg-stone-900/25 rounded-2xl p-8 text-left backdrop-blur-sm">
        <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-purple-600/20 rounded-xl">
            <Dumbbell class="w-6 h-6 text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold">Staked Races</h3>
        </div>
        <p class="text-gray-400 mb-4">Stake $VIRAL to join high-reward races. Win big from redistributed stakes.</p>
        <a href="https://docs.viralmind.ai/viralmind.ai/training-gym/staked-races">
        <div class="flex items-center text-purple-400 group cursor-pointer">
            <span class="mr-2">Learn more</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
        </a>
        </div>
    </div>

    <!-- Notification Sign Up -->
    <div class="bg-stone-900/25 rounded-3xl p-8 md:p-12 backdrop-blur-sm max-w-2xl mx-auto">
        <div class="flex items-center justify-center gap-3 mb-6">
        <BellRing class="w-6 h-6 text-purple-400" />
        <h3 class="text-xl font-semibold">Get Notified When We Launch</h3>
        </div>
        
        <div class="flex justify-center">
        <a 
            href="https://t.me/viralmind" 
            target="_blank"
            class="flex items-center gap-2 px-8 py-3 bg-purple-600 rounded-full font-semibold hover:bg-purple-700 transition-colors"
        >
            <MessagesSquare class="w-5 h-5" />
            Join Our Telegram
        </a>
        </div>
    </div>
    </div>
</div>

<!-- Background effects -->
<div class="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-[1]"></div>
<div 
    class="absolute inset-0 transition-transform duration-1000 ease-out z-[2]"
    style="background: radial-gradient(600px circle at {mousePosition.x}% {mousePosition.y}%, rgb(147, 51, 234, 0.1), transparent 100%); 
            transform: translate({(mousePosition.x - 50) * -0.05}px, {(mousePosition.y - 50) * -0.05}px)"
></div>
<div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-[3]"></div>
</div>
