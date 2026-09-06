<script module lang="ts">
	/**
	 * Has the bottom-to-top reveal wipe been seen yet this page load?
	 *
	 * The wipe is a first impression, so it plays once and then gets out of the
	 * way; the glitch marks every entrance and is not gated by this. Module
	 * scope gives exactly the right lifetime — it survives client-side
	 * navigation and resets on a real page load, same as the document.
	 */
	let revealPlayed = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import BinaryName from '../BinaryName.svelte';
	import GlitchFace from '../GlitchFace.svelte';
	import GlitchLayers from './GlitchLayers.svelte';
	import { heroMetrics, socials } from '$lib/data/portfolio';
	import { onGlitchAudioReady, playGlitch } from '$lib/audio/glitch';
	import { pulseGlitch } from '$lib/glitchPulse';

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

	// Returning to the page mid-session starts already open: no wipe, and no
	// blank frame before the glitch lands.
	let introPhase = $state<'idle' | 'animating' | 'done'>(revealPlayed ? 'done' : 'idle');
	let burstKey = $state(0);

	/** Matches GlitchFace's BURST_MS — the section runs the same 900ms timeline. */
	const SECTION_BURST_MS = 900;
	let sectionGlitching = $state(false);
	let sectionTimer: ReturnType<typeof setTimeout> | undefined;
	let sectionEl: HTMLElement | undefined = $state();
	/** The section burst has run at least once with audio actually audible. */
	let sectionHeard = false;
	let offSectionReady: (() => void) | undefined;

	function burst() {
		sectionGlitching = true;
		// Every opted-in section glitches on the same beat, so the page reads as
		// one event instead of six independent ones.
		pulseGlitch();
		// Same voice as the portrait, at full intensity: one effect, one sound.
		if (playGlitch(1, 'face')) sectionHeard = true;
		clearTimeout(sectionTimer);
		sectionTimer = setTimeout(() => (sectionGlitching = false), SECTION_BURST_MS);
	}

	// Chained off GlitchFace's onIntroEnd, so the section takes over the instant
	// the portrait's own burst finishes rather than overlapping it. Runs on
	// every entrance, matching the portrait.
	function runSectionGlitch() {
		if (reduceMotion) return;
		burst();
		offSectionReady?.();
		if (sectionHeard) return;

		// On a cold load nothing can play until the visitor interacts, so the
		// burst above was silent. Replay it once the moment audio unlocks —
		// delayed by one burst so it still follows the portrait's catch-up in
		// the same order the intro plays them.
		offSectionReady = onGlitchAudioReady(() => {
			if (sectionHeard || reduceMotion) return;
			sectionTimer = setTimeout(() => {
				// Skip it if the hero has been scrolled past: a glitch sound with no
				// visible glitch just reads as a stray noise.
				const box = sectionEl?.getBoundingClientRect();
				if (box && box.bottom > 0 && box.top < window.innerHeight) burst();
			}, SECTION_BURST_MS);
		});
	}

	let introTimers: ReturnType<typeof setTimeout>[] = [];

	/** Rewind and run the whole intro: face wipe, portrait burst, section burst. */
	function startIntro() {
		introTimers.forEach(clearTimeout);

		if (revealPlayed) {
			// Wipe already spent this page load. Stay open and let the glitch carry
			// the entrance on its own, after a beat so it does not collide with the
			// navigation that brought us here.
			introPhase = 'done';
			introTimers = [setTimeout(() => burstKey++, 220)];
			return;
		}

		revealPlayed = true;
		introPhase = 'idle';
		// 280ms hold, then an 800ms wipe: quick, so the portrait hands over to
		// its glitch sooner.
		introTimers = [
			setTimeout(() => (introPhase = 'animating'), 280),
			setTimeout(() => (introPhase = 'done'), 1130),
			setTimeout(() => burstKey++, 1130)
		];
	}

	onMount(() => {
		startIntro();

		// A bfcache restore (back/forward, and on iOS plenty of ordinary
		// back-navigations) hands back the live JS heap: the module flag and
		// introPhase both survive, so the intro would never replay. To the
		// visitor that is a fresh arrival at the page, so treat it as one.
		const onPageShow = (e: PageTransitionEvent) => {
			if (!e.persisted) return;
			sectionHeard = false;
			startIntro();
		};
		window.addEventListener('pageshow', onPageShow);

		return () => {
			introTimers.forEach(clearTimeout);
			window.removeEventListener('pageshow', onPageShow);
			clearTimeout(sectionTimer);
			offSectionReady?.();
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
	bind:this={sectionEl}
	id="hero"
	class="relative overflow-hidden border-b border-(--color-rule) {sectionGlitching
		? 'section-glitching'
		: ''}"
>
	<GlitchLayers />
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
					<GlitchFace phase={introPhase} {burstKey} onIntroEnd={runSectionGlitch} />
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
