<script lang="ts">
	import BitName from './BitName.svelte';

	interface Props {
		navigate: (view: string) => void;
	}

	let { navigate }: Props = $props();
</script>

<div class="view-enter scanlines relative flex h-full flex-col overflow-hidden">
	<!-- Top anchor row -->
	<div class="relative z-10 flex items-center justify-between px-18 pt-6">
		<span class="font-mono text-xs tracking-widest text-[var(--color-text-muted)]">// comfort kills greatness</span>
		<div class="flex items-center gap-2">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
			<span class="font-mono text-xs tracking-widest text-emerald-500/70">Welcome</span>
		</div>
	</div>

	<BitName />

	<div class="relative z-10 mt-auto px-18 pb-18">
		<p class="mb-6 font-mono text-lg font-light tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-xl md:text-2xl">
			<span class="font-medium text-white">CTO</span>
			|
			<span class="font-medium text-white">BLOCKCHAIN DEVELOPER</span>
			|
			<span class="font-medium text-white">PROJECT MANAGER</span>
		</p>

		<div class="mt-2 flex flex-wrap items-center gap-3">
			<button
				onclick={() => navigate('about')}
				class="cursor-pointer border border-[var(--color-border)] bg-[var(--color-surface-alt)]/50 px-8 py-3 font-mono text-xs tracking-[0.25em] text-[var(--color-text-secondary)] backdrop-blur-sm transition-all hover:border-[var(--color-border-hover)] hover:text-white"
			>
				[ ABOUT ME ]
			</button>
			<button
				onclick={() => navigate('projects')}
				class="cursor-pointer border border-[var(--color-border)] bg-[var(--color-surface-alt)]/50 px-8 py-3 font-mono text-xs tracking-[0.25em] text-[var(--color-text-secondary)] backdrop-blur-sm transition-all hover:border-[var(--color-border-hover)] hover:text-white"
			>
				[ PROJECTS]
			</button>
			<button
				onclick={() => navigate('contact')}
				class="cursor-pointer border border-[var(--color-border-hover)] bg-[var(--color-surface-alt)]/50 px-8 py-3 font-mono text-xs tracking-[0.25em] text-[var(--color-text-secondary)] backdrop-blur-sm transition-all hover:border-[var(--color-text-secondary)] hover:text-white"
			>
				[ GET IN TOUCH ]
			</button>
		</div>
	</div>
</div>
