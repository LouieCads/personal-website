<script lang="ts">
	import BinaryName from './BinaryName.svelte';
	import BinaryBackground from './BinaryBackground.svelte';

	interface Props {
		navigate: (view: string) => void;
	}

	let { navigate }: Props = $props();
</script>

<div class="view-enter scanlines relative grid h-full grid-rows-[auto_1fr_auto] overflow-hidden">
	<!-- Full-cover binary background -->
	<BinaryBackground />
	<!-- Top anchor row -->
	<div class="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-8 md:px-16 lg:px-24 sm:pt-6">
		<div class="flex items-center gap-2">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-accent)"></span>
			<span class="font-mono text-xs tracking-widest text-(--color-accent)">Welcome!</span>
		</div>
		<span class="hidden font-mono text-xs tracking-widest text-(--color-text-muted) sm:inline">// comfort kills greatness</span>
	</div>

	<!-- Main area: name canvas left, binary face right -->
	<div class="relative flex overflow-hidden">
		<BinaryName />
	</div>

	<!-- Bottom anchor row -->
	<div class="relative z-10 px-4 pb-6 sm:px-8 sm:pb-10 md:px-16 lg:px-24 lg:pb-14">
		<p class="mb-4 font-mono text-xs font-light tracking-[0.2em] text-(--color-text-secondary) sm:mb-6 sm:text-sm sm:tracking-[0.3em] md:text-lg lg:text-2xl">
			<span class="font-medium text-(--color-text-primary)">CTO</span>
			<span class="hidden sm:inline"> | </span>
			<span class="sm:hidden"> · </span>
			<span class="font-medium text-(--color-text-primary) md:hidden">BLOCKCHAIN DEV</span>
			<span class="hidden font-medium text-(--color-text-primary) md:inline">BLOCKCHAIN DEVELOPER</span>
			<span class="hidden sm:inline"> | </span>
			<span class="sm:hidden"> · </span>
			<span class="font-medium text-(--color-text-primary) md:hidden">PM</span>
			<span class="hidden font-medium text-(--color-text-primary) md:inline">PROJECT MANAGER</span>
		</p>

		<div class="mt-2 flex items-center gap-2 sm:gap-3">
			<button
				onclick={() => navigate('about')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-3 py-2 font-mono text-[9px] md:text-[11px] tracking-widest text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary) sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:px-8 md:py-3 md:text-xs md:tracking-[0.25em]"
			>
				[ ABOUT ]
			</button>
			<button
				onclick={() => navigate('projects')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-3 py-2 font-mono text-[9px] md:text-[11px] tracking-widest text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary) sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:px-8 md:py-3 md:text-xs md:tracking-[0.25em]"
			>
				[ PROJECTS ]
			</button>
			<button
				onclick={() => navigate('contact')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-3 py-2 font-mono text-[9px] md:text-[11px] tracking-widest text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary) sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:px-8 md:py-3 md:text-xs md:tracking-[0.25em]"
			>
				[ GET IN TOUCH ]
			</button>
		</div>
	</div>
</div>
