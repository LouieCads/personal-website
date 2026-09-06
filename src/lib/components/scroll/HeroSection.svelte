<script module lang="ts">
	/**
	 * Once per page load, not per mount.
	 *
	 * SvelteKit keeps this module alive across client-side navigation, so
	 * returning to the home page from /about finds the flag already set and the
	 * section glitch stays quiet. A reload or hard reload evaluates the module
	 * afresh and it plays again.
	 */
	let sectionGlitchPlayed = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import BinaryName from '../BinaryName.svelte';
	import GlitchFace from '../GlitchFace.svelte';
	import { heroMetrics, socials } from '$lib/data/portfolio';
	import { playGlitch } from '$lib/audio/glitch';

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

	/** Matches GlitchFace's BURST_MS — the section runs the same 900ms timeline. */
	const SECTION_BURST_MS = 900;
	let sectionGlitching = $state(false);
	let sectionTimer: ReturnType<typeof setTimeout> | undefined;

	// Chained off GlitchFace's onIntroEnd, so the section takes over the instant
	// the portrait's own burst finishes rather than overlapping it.
	function runSectionGlitch() {
		if (sectionGlitchPlayed || reduceMotion) return;
		sectionGlitchPlayed = true;
		sectionGlitching = true;
		// Same voice as the portrait, at full intensity: one effect, one sound.
		playGlitch(1, 'face');
		sectionTimer = setTimeout(() => (sectionGlitching = false), SECTION_BURST_MS);
	}

	onMount(() => {
		// 280ms hold, then an 800ms wipe: quicker than it was, so the portrait
		// hands over to its glitch sooner.
		const t1 = setTimeout(() => (introPhase = 'animating'), 280);
		const t2 = setTimeout(() => (introPhase = 'done'), 1130);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(sectionTimer);
		};
	});

	// header (bracket/corners) + socials fade-and-rise in once the face starts revealing
	const revealClass = $derived(introPhase === 'idle' ? 'pre-reveal' : 'post-reveal');

	// metrics count-up: parse the leading integer out of each value (keeping
	// any prefix/suffix, e.g. the "20+" technologies count or a comma-formatted
	// GitHub contributions total) and tween it from 0 on reveal.
	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function parseMetric(value: string) {
		const m = value.match(/^(\D*)([\d,]+)(.*)$/);
		if (!m) return null;
		const [, prefix, digits, suffix] = m;
		return { prefix, target: parseInt(digits.replace(/,/g, ''), 10), suffix };
	}

	let displayMetrics = $state(heroMetrics.map((m) => ({ ...m })));
	let countUpStarted = false;

	function animateMetrics(targets: { value: string; label: string }[]) {
		const parsed = targets.map((t) => ({
			label: t.label,
			raw: t.value,
			parts: parseMetric(t.value)
		}));

		if (reduceMotion) {
			displayMetrics = targets.map((t) => ({ ...t }));
			return;
		}

		const duration = 1200;
		const start = performance.now();

		function tick(now: number) {
			const p = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - p) ** 3;
			displayMetrics = parsed.map(({ label, raw, parts }) => {
				if (!parts) return { label, value: raw };
				const current = Math.round(parts.target * eased);
				return { label, value: `${parts.prefix}${current.toLocaleString()}${parts.suffix}` };
			});
			if (p < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	$effect(() => {
		if (introPhase === 'idle') return;
		if (countUpStarted) return;
		countUpStarted = true;
		animateMetrics(metrics);
	});
</script>

<section
	id="hero"
	class="relative overflow-hidden border-b border-(--color-rule) {sectionGlitching
		? 'hero-glitching'
		: ''}"
>
	<!-- The portrait's layer stack, minus the ones needing a copy of the
	     content (colour echoes, chromatic ghosts, image slices) — a whole
	     section is far too much DOM to duplicate. -->
	<span class="hero-halftone" aria-hidden="true"></span>
	<span class="hero-scan" aria-hidden="true"></span>
	<span class="hero-tear" aria-hidden="true"></span>
	<span class="hero-shards" aria-hidden="true">
		<span class="hero-shard hero-shard-1"></span>
		<span class="hero-shard hero-shard-2"></span>
		<span class="hero-shard hero-shard-3"></span>
		<span class="hero-shard hero-shard-4"></span>
		<span class="hero-shard hero-shard-5"></span>
		<span class="hero-shard hero-shard-6"></span>
	</span>
	<!-- The name is drawn on canvas (see BinaryName); this is the real, crawlable
	     h1 that carries the page's primary heading and entity signal. -->
	<h1 class="sr-only">Louigie Caminoy — CTO, Blockchain Developer & Project Manager</h1>
	<div
		class="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 pt-10 pb-14 sm:px-8 md:px-14 md:pb-16 lg:px-20 xl:px-24"
	>
		<!-- face + name -->
		<div class="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">
			<div class="bracket relative w-36 shrink-0 sm:w-48 md:w-56 lg:w-64">
				<div class="relative aspect-square w-full">
					<GlitchFace phase={introPhase} onIntroEnd={runSectionGlitch} />
				</div>
				<span class="corner corner-tl {revealClass}"></span>
				<span class="corner corner-tr {revealClass}"></span>
				<span class="corner corner-bl {revealClass}"></span>
				<span class="corner corner-br {revealClass}"></span>
			</div>

			<div class="relative h-28 w-full min-w-0 sm:h-44 md:h-60 lg:h-72 lg:flex-1">
				<BinaryName />
			</div>
		</div>

		<!-- contact links, in place of the old role line -->
		<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
			{#each socials as s, i (s.label)}
				<a
					href={s.href}
					target={s.external ? '_blank' : undefined}
					rel="noopener noreferrer"
					style="animation-delay: {i * 90}ms"
					class="group social-link inline-flex items-baseline gap-1.5 font-mono text-xs text-(--color-accent) underline decoration-(--color-accent)/40 underline-offset-4 transition-colors hover:decoration-(--color-accent) sm:text-sm {revealClass}"
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
			{#each displayMetrics as m (m.label)}
				<div class="metric-cell min-w-0 border-(--color-rule) p-3 sm:p-4">
					<p
						class="font-mono text-base font-semibold text-(--color-text-primary) tabular-nums sm:text-lg"
					>
						{m.value}
					</p>
					<p
						class="mt-0.5 font-mono text-[9px] tracking-wider break-words text-(--color-text-muted) sm:text-[10px]"
					>
						{m.label}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ---------------------------------------------------------------------
	   Section-wide glitch. Deliberately the SAME burst as the portrait: the
	   900ms duration and every keyframe percentage below are lifted from
	   GlitchFace, so the two read as one effect firing twice rather than two
	   effects that merely resemble each other.

	     0-28%   cluster one  - hard hit, then two clipped echoes
	     28-46%  quiet
	     46-66%  cluster two  - the aftershock
	     66-100% settled

	   The portrait layers that need a duplicate of the content — the colour
	   echoes, the chromatic ghosts, the displaced image slices — are dropped
	   here, since a whole section cannot be cloned five times. The same idea is
	   applied to the section itself instead: hard positional jumps and clip-path
	   band cuts that tear slabs of layout out of place for a frame.
	   --------------------------------------------------------------------- */

	.hero-halftone,
	.hero-scan,
	.hero-tear {
		position: absolute;
		inset: 0;
		z-index: 20;
		opacity: 0;
		pointer-events: none;
	}

	/* ---- the section itself: kick + slice cuts --------------------------- */

	@keyframes heroKick {
		0% {
			transform: translate3d(-9px, 0, 0);
			clip-path: inset(0 0 0 0);
			filter: contrast(1.4) saturate(1.45);
		}
		7% {
			transform: translate3d(7px, -3px, 0);
			clip-path: inset(19% 0 62% 0);
		}
		13% {
			transform: translate3d(-4px, 2px, 0);
			clip-path: inset(0 0 0 0);
			filter: contrast(1.15);
		}
		20% {
			transform: translate3d(10px, 0, 0);
			clip-path: inset(58% 0 11% 0);
			filter: contrast(1.55);
		}
		26%,
		46%,
		66%,
		100% {
			transform: translate3d(0, 0, 0);
			clip-path: inset(0 0 0 0);
			filter: none;
		}
		49% {
			transform: translate3d(6px, 1px, 0);
			clip-path: inset(40% 0 38% 0);
			filter: contrast(1.3);
		}
		56% {
			transform: translate3d(-4px, 0, 0);
			clip-path: inset(0 0 0 0);
		}
		61% {
			transform: translate3d(2px, 0, 0);
			filter: contrast(1.12);
		}
	}

	.hero-glitching {
		animation: heroKick 0.9s steps(1, end) 1;
	}

	/* ---- broken halftone -------------------------------------------------- */

	/* The portrait's comic-print dots, broken by the same diagonal band pattern.
	   Unmasked here (there is no silhouette to clip to), so peak opacity comes
	   right down — it covers vastly more area. */
	.hero-halftone {
		background-image: radial-gradient(var(--color-accent) 30%, transparent 32%);
		background-size: 4px 4px;
		-webkit-mask-image: repeating-linear-gradient(
			62deg,
			#000 0 14px,
			transparent 14px 26px,
			#000 26px 32px,
			transparent 32px 58px
		);
		mask-image: repeating-linear-gradient(
			62deg,
			#000 0 14px,
			transparent 14px 26px,
			#000 26px 32px,
			transparent 32px 58px
		);
	}

	@keyframes heroHalftone {
		0%,
		56%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		2% {
			opacity: 0.34;
			transform: translate3d(6px, 0, 0);
		}
		10% {
			opacity: 0.14;
			transform: translate3d(-8px, 3px, 0);
		}
		20% {
			opacity: 0.28;
			transform: translate3d(3px, -3px, 0);
		}
		28% {
			opacity: 0;
		}
		49% {
			opacity: 0.22;
			transform: translate3d(-5px, 0, 0);
		}
	}

	.hero-glitching .hero-halftone {
		animation: heroHalftone 0.9s steps(1, end) 1;
	}

	/* ---- scanlines + displacement tear ------------------------------------ */

	.hero-scan {
		background: repeating-linear-gradient(
			0deg,
			transparent 0 2px,
			color-mix(in srgb, var(--color-accent) 22%, transparent) 2px 3px
		);
	}

	@keyframes heroScan {
		0% {
			opacity: 1;
			transform: translate3d(0, -2px, 0);
		}
		12% {
			opacity: 0.5;
			transform: translate3d(0, 3px, 0);
		}
		22% {
			opacity: 1;
			transform: translate3d(0, -1px, 0);
		}
		32%,
		46%,
		66%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		49% {
			opacity: 0.8;
			transform: translate3d(0, 2px, 0);
		}
		58% {
			opacity: 0.45;
			transform: translate3d(0, -2px, 0);
		}
	}

	.hero-glitching .hero-scan {
		animation: heroScan 0.9s steps(1, end) 1;
	}

	.hero-tear {
		background: linear-gradient(
			180deg,
			transparent 0 46%,
			color-mix(in srgb, var(--color-accent) 55%, transparent) 46% 48.4%,
			var(--color-surface) 48.4% 49.6%,
			color-mix(in srgb, var(--color-text-primary) 40%, transparent) 49.6% 51%,
			transparent 51% 100%
		);
	}

	@keyframes heroTear {
		0%,
		56%,
		100% {
			opacity: 0;
			transform: translate3d(0, -40%, 0);
		}
		2% {
			opacity: 1;
			transform: translate3d(0, -28%, 0);
		}
		9% {
			opacity: 1;
			transform: translate3d(0, -4%, 0);
		}
		18% {
			opacity: 1;
			transform: translate3d(0, 18%, 0);
		}
		26% {
			opacity: 0;
			transform: translate3d(0, 40%, 0);
		}
		49% {
			opacity: 1;
			transform: translate3d(0, -12%, 0);
		}
	}

	.hero-glitching .hero-tear {
		animation: heroTear 0.9s steps(1, end) 1;
	}

	/* ---- angular shards ---------------------------------------------------- */

	.hero-shards {
		position: absolute;
		inset: 0;
		z-index: 21;
		pointer-events: none;
	}

	.hero-shard {
		position: absolute;
		display: block;
		opacity: 0;
	}

	.hero-shard-1 {
		top: 14%;
		left: 0;
		width: 22%;
		height: 6px;
		background: var(--color-accent);
		clip-path: polygon(0 0, 100% 34%, 78% 100%, 0 62%);
	}

	.hero-shard-2 {
		top: 33%;
		right: 0;
		width: 26%;
		height: 4px;
		background: var(--color-text-primary);
		clip-path: polygon(0 22%, 100% 0, 100% 74%, 14% 100%);
	}

	.hero-shard-3 {
		bottom: 30%;
		left: 0;
		width: 24%;
		height: 3px;
		background: var(--color-accent);
		clip-path: polygon(0 0, 100% 40%, 100% 100%, 22% 66%);
	}

	.hero-shard-4 {
		bottom: 12%;
		right: 4%;
		width: 18%;
		height: 7px;
		background: var(--color-accent-dim);
		clip-path: polygon(10% 0, 100% 18%, 84% 100%, 0 70%);
	}

	.hero-shard-5 {
		top: 0;
		right: 22%;
		width: 3px;
		height: 16%;
		background: var(--color-border-hover);
		clip-path: polygon(40% 0, 100% 8%, 62% 100%, 0 84%);
	}

	.hero-shard-6 {
		bottom: 0;
		left: 28%;
		width: 3px;
		height: 14%;
		background: var(--color-accent);
		clip-path: polygon(0 10%, 100% 0, 58% 100%, 20% 88%);
	}

	@keyframes heroShardOut {
		0%,
		57%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0) scaleX(0.2);
		}
		2% {
			opacity: 1;
			transform: translate3d(-18%, 0, 0) scaleX(1);
		}
		10% {
			opacity: 0.6;
			transform: translate3d(-34%, -2%, 0) scaleX(1.25);
		}
		20% {
			opacity: 0;
			transform: translate3d(-52%, -3%, 0) scaleX(1.4);
		}
		49% {
			opacity: 0.9;
			transform: translate3d(-26%, 1%, 0) scaleX(1.1);
		}
	}

	@keyframes heroShardOutR {
		0%,
		57%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0) scaleX(0.2);
		}
		3% {
			opacity: 1;
			transform: translate3d(20%, 0, 0) scaleX(1);
		}
		11% {
			opacity: 0.55;
			transform: translate3d(38%, 2%, 0) scaleX(1.3);
		}
		21% {
			opacity: 0;
			transform: translate3d(56%, 4%, 0) scaleX(1.45);
		}
		51% {
			opacity: 0.85;
			transform: translate3d(28%, -1%, 0) scaleX(1.15);
		}
	}

	@keyframes heroShardVert {
		0%,
		58%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0) scaleY(0.3);
		}
		4% {
			opacity: 1;
			transform: translate3d(0, -30%, 0) scaleY(1.1);
		}
		12% {
			opacity: 0.5;
			transform: translate3d(2%, -52%, 0) scaleY(1.3);
		}
		23% {
			opacity: 0;
			transform: translate3d(3%, -70%, 0) scaleY(1.4);
		}
		52% {
			opacity: 0.8;
			transform: translate3d(0, -38%, 0) scaleY(1.2);
		}
	}

	.hero-glitching .hero-shard-1 {
		animation: heroShardOut 0.9s steps(1, end) 1;
	}
	.hero-glitching .hero-shard-2 {
		animation: heroShardOutR 0.86s steps(1, end) 0.04s 1;
	}
	.hero-glitching .hero-shard-3 {
		animation: heroShardOut 0.82s steps(1, end) 0.08s 1;
	}
	.hero-glitching .hero-shard-4 {
		animation: heroShardOutR 0.78s steps(1, end) 0.12s 1;
	}
	.hero-glitching .hero-shard-5 {
		animation: heroShardVert 0.88s steps(1, end) 0.03s 1;
	}
	.hero-glitching .hero-shard-6 {
		animation: heroShardVert 0.8s steps(1, end) 0.1s 1 reverse;
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-glitching,
		.hero-glitching .hero-halftone,
		.hero-glitching .hero-scan,
		.hero-glitching .hero-tear,
		.hero-glitching .hero-shard {
			animation: none;
		}
	}

	/* Bracket corners: pop in staggered, after the face starts revealing. */
	@keyframes cornerIn {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.corner.pre-reveal {
		opacity: 0;
	}
	.corner.post-reveal {
		animation: cornerIn 0.45s ease-out forwards;
	}
	.corner-tl.post-reveal {
		animation-delay: 0.05s;
	}
	.corner-tr.post-reveal {
		animation-delay: 0.15s;
	}
	.corner-bl.post-reveal {
		animation-delay: 0.25s;
	}
	.corner-br.post-reveal {
		animation-delay: 0.35s;
	}

	/* Social links: fade + rise, staggered left-to-right via inline animation-delay. */
	@keyframes socialIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.social-link.pre-reveal {
		opacity: 0;
	}
	.social-link.post-reveal {
		animation: socialIn 0.5s ease-out forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.corner.pre-reveal,
		.social-link.pre-reveal {
			opacity: 1;
		}
		.corner.post-reveal,
		.social-link.post-reveal {
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
