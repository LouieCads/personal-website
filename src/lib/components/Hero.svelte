<script lang="ts">
	import { onMount } from 'svelte';
	import BinaryName from './BinaryName.svelte';
	import BinaryBackground from './BinaryBackground.svelte';
	import BinaryFace from './BinaryFace.svelte';

	interface Props {
		navigate: (view: string) => void;
	}

	let { navigate }: Props = $props();

	// 'idle' → 'animating' → 'done'
	let introPhase = $state<'idle' | 'animating' | 'done'>('idle');

	onMount(() => {
		const t1 = setTimeout(() => { introPhase = 'animating'; }, 400);
		// 400ms delay + 1200ms animation + 50ms buffer
		const t2 = setTimeout(() => { introPhase = 'done'; }, 1650);
		return () => { clearTimeout(t1); clearTimeout(t2); };
	});
</script>

<style>
	@keyframes faceIntro {
		from { clip-path: inset(100% 0 0 0); }
		to   { clip-path: inset(0 0 0 0); }
	}
	.face-intro {
		animation: faceIntro 1.2s ease-out forwards;
	}
</style>

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

	<!-- Main area: stacked + centered on mobile/tablet; side-by-side on lg+ -->
	<div class="relative z-10 flex flex-col items-center overflow-hidden lg:flex-row lg:items-stretch">

		<!-- Profile image: centered on mobile/tablet; left column on lg+ -->
		<div class="flex shrink-0 flex-col items-center justify-center pt-6 pb-3 sm:pt-8 sm:pb-4 lg:self-stretch lg:justify-center lg:pt-0 lg:pb-0 lg:pl-16 xl:pl-24">
			<div class="relative w-45 sm:w-55 md:w-70 lg:h-80 lg:w-auto lg:aspect-square">
				<span class="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-(--color-border-hover)"></span>
				<span class="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-(--color-border-hover)"></span>
				<span class="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-(--color-border-hover)"></span>
				<span class="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-(--color-border-hover)"></span>
				<div class="group/face aspect-square w-full overflow-hidden lg:h-full lg:aspect-auto">
					<BinaryFace />
					<img
						src="/profile.jpg"
						alt="Louigie Caminoy"
						class="absolute inset-0 h-full w-full object-cover
							{introPhase === 'idle' ? 'opacity-0' : ''}
							{introPhase === 'animating' ? 'face-intro' : ''}
							{introPhase === 'done' ? 'opacity-100' : ''}"
					/>
				</div>
			</div>
		</div>

		<!-- Name canvas: full width on mobile/tablet; remaining space on lg+ -->
		<div class="relative w-full min-h-0 flex-1 self-stretch">
			<BinaryName />
		</div>
	</div>

	<!-- Bottom anchor row: centered on mobile/tablet; left-aligned on lg+ -->
	<div class="relative z-10 flex flex-col items-center px-4 pb-6 sm:pb-10 lg:items-start lg:px-16 lg:pb-14 xl:px-24">
		<p class="mb-4 text-center font-mono text-xs font-light tracking-[0.2em] text-(--color-text-secondary) sm:mb-6 sm:text-sm sm:tracking-[0.3em] md:text-lg lg:text-left lg:text-2xl">
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

		<div class="mt-2 flex items-center justify-center gap-2 sm:gap-3 lg:justify-start">
			<button
				onclick={() => navigate('about')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-3 py-2 font-mono text-[9px] tracking-widest text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary) sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:px-8 md:py-3 md:text-xs md:tracking-[0.25em] lg:px-9 lg:py-3.5 lg:text-[13px] lg:tracking-[0.27em]"
			>
				[ ABOUT ]
			</button>
			<button
				onclick={() => navigate('projects')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-3 py-2 font-mono text-[9px] tracking-widest text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary) sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:px-8 md:py-3 md:text-xs md:tracking-[0.25em] lg:px-9 lg:py-3.5 lg:text-[13px] lg:tracking-[0.27em]"
			>
				[ PROJECTS ]
			</button>
			<button
				onclick={() => navigate('contact')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-3 py-2 font-mono text-[9px] tracking-widest text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary) sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:px-8 md:py-3 md:text-xs md:tracking-[0.25em] lg:px-9 lg:py-3.5 lg:text-[13px] lg:tracking-[0.27em]"
			>
				[ GET IN TOUCH ]
			</button>
		</div>
	</div>
</div>
