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
	<div class="relative z-10 flex items-center justify-between px-18 pt-6">
		<div class="flex items-center gap-2">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-accent)"></span>
			<span class="font-mono text-xs tracking-widest text-(--color-accent)">Welcome!</span>
		</div>
		<span class="font-mono text-xs tracking-widest text-(--color-text-muted)">// comfort kills greatness</span>
	</div>

	<!-- Main area: name canvas left, binary face right -->
	<div class="relative flex overflow-hidden">
		<BinaryName />
	</div>

	<!-- Bottom anchor row -->
	<div class="relative z-10 px-18 pb-18">
		<p class="mb-6 font-mono text-lg font-light tracking-[0.3em] text-(--color-text-secondary) sm:text-xl md:text-2xl">
			<span class="font-medium text-(--color-text-primary)">CTO</span>
			|
			<span class="font-medium text-(--color-text-primary)">BLOCKCHAIN DEVELOPER</span>
			|
			<span class="font-medium text-(--color-text-primary)">PROJECT MANAGER</span>
		</p>

		<div class="mt-2 flex flex-wrap items-center gap-3">
			<button
				onclick={() => navigate('about')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-8 py-3 font-mono text-xs tracking-[0.25em] text-(--color-text-secondary)/ backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
			>
				[ ABOUT ME ]
			</button>
			<button
				onclick={() => navigate('projects')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-8 py-3 font-mono text-xs tracking-[0.25em] text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
			>
				[ PROJECTS]
			</button>
			<button
				onclick={() => navigate('contact')}
				class="cursor-pointer border border-(--color-border) bg-(--color-surface-alt)/50 px-8 py-3 font-mono text-xs tracking-[0.25em] text-(--color-text-secondary) backdrop-blur-sm transition-all hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
			>
				[ GET IN TOUCH ]
			</button>
		</div>
	</div>
</div>
