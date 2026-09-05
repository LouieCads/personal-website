<script lang="ts">
	import { onMount } from 'svelte';
	import BinaryName from '../BinaryName.svelte';
	import BinaryFace from '../BinaryFace.svelte';
	import { heroMetrics, socials } from '$lib/data/portfolio';

	interface Props {
		/** total GitHub contributions this year, resolved server-side; omitted if the fetch failed */
		githubContributions?: number;
	}
	let { githubContributions }: Props = $props();

	const metrics = $derived(
		githubContributions == null
			? heroMetrics
			: [
					...heroMetrics,
					{ value: githubContributions.toLocaleString(), label: 'GitHub Contributions' }
				]
	);

	let introPhase = $state<'idle' | 'animating' | 'done'>('idle');

	onMount(() => {
		const t1 = setTimeout(() => (introPhase = 'animating'), 400);
		const t2 = setTimeout(() => (introPhase = 'done'), 1650);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	});

	const faceClass = $derived(
		introPhase === 'idle' ? 'opacity-0' : introPhase === 'animating' ? 'face-intro' : 'opacity-100'
	);
</script>

<section id="hero" class="relative overflow-hidden border-b border-(--color-rule)">
	<!-- The name is drawn on canvas (see BinaryName); this is the real, crawlable
	     h1 that carries the page's primary heading and entity signal. -->
	<h1 class="sr-only">Louigie Caminoy — CTO, Blockchain Developer & Project Manager</h1>
	<div
		class="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 pt-10 pb-14 sm:px-8 md:px-14 md:pb-16 lg:px-20 xl:px-24"
	>
		<!-- face + name -->
		<div class="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">
			<div class="bracket relative w-36 shrink-0 sm:w-48 md:w-56 lg:w-64">
				<div class="relative aspect-square w-full overflow-hidden">
					<BinaryFace />
					<img
						src="/profile.png"
						alt="Louigie Caminoy"
						decoding="async"
						class="absolute inset-0 h-full w-full object-cover {faceClass}"
					/>
				</div>
				<span class="corner corner-tl"></span>
				<span class="corner corner-tr"></span>
				<span class="corner corner-bl"></span>
				<span class="corner corner-br"></span>
			</div>

			<div class="relative h-28 w-full min-w-0 sm:h-44 md:h-60 lg:h-72 lg:flex-1">
				<BinaryName />
			</div>
		</div>

		<!-- contact links, in place of the old role line -->
		<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
			{#each socials as s (s.label)}
				<a
					href={s.href}
					target={s.external ? '_blank' : undefined}
					rel="noopener noreferrer"
					class="group inline-flex items-baseline gap-1.5 font-mono text-xs text-(--color-accent) underline decoration-(--color-accent)/40 underline-offset-4 transition-colors hover:decoration-(--color-accent) sm:text-sm"
				>
					{s.display}
					<span
						class="text-[10px] text-(--color-text-muted) transition-transform group-hover:-translate-y-0.5 group-hover:text-(--color-accent)"
					>
						{s.external ? '↗' : '✉'}
					</span>
				</a>
			{/each}
		</div>

		<!-- metrics -->
		<div
			class="metrics-grid grid grid-cols-2 border border-(--color-border) bg-(--color-surface-alt)/40 {metrics.length >
			3
				? 'sm:grid-cols-4'
				: 'sm:grid-cols-3'}"
		>
			{#each metrics as m (m.label)}
				<div class="metric-cell min-w-0 border-(--color-rule) p-3 sm:p-4">
					<p
						class="font-mono text-base font-semibold text-(--color-text-primary) tabular-nums sm:text-lg"
					>
						{m.value}
					</p>
					<p
						class="mt-0.5 break-words font-mono text-[9px] tracking-wider text-(--color-text-muted) sm:text-[10px]"
					>
						{m.label}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes faceIntro {
		from {
			clip-path: inset(100% 0 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}
	.face-intro {
		animation: faceIntro 1.2s ease-out forwards;
	}
	@media (prefers-reduced-motion: reduce) {
		.face-intro {
			animation: none;
		}
	}

	/* Border rule for the metrics grid, matched to its column count per
	   breakpoint — grid-cols-2 on mobile (2 rows) so long labels like "GitHub
	   Contributions" get enough width and don't overflow into the next cell;
	   grid-cols-3/4 from sm up (1 row). A plain "border-left on every cell but
	   the first" only works for a single row — on 2 columns it put a left
	   border on the wrapped row's first cell too. */
	.metric-cell:nth-child(2n) {
		border-left-width: 1px;
	}
	.metric-cell:nth-child(n + 3) {
		border-top-width: 1px;
	}
	@media (min-width: 640px) {
		.metric-cell:nth-child(2n) {
			border-left-width: 0;
		}
		.metric-cell:nth-child(n + 3) {
			border-top-width: 0;
		}
		.metric-cell:not(:first-child) {
			border-left-width: 1px;
		}
	}
</style>
