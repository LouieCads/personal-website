<script lang="ts">
	import { onMount } from 'svelte';
	import BinaryFace from './BinaryFace.svelte';
	import {
		armGlitchAudio,
		onGlitchAudioReady,
		playGlitch,
		preloadGlitchSample
	} from '$lib/audio/glitch';

	interface Props {
		/**
		 * Hero intro phase. The stack stays hidden on 'idle', wipes up on
		 * 'animating', and fires its one and only automatic glitch burst when it
		 * reaches 'done'. After that the burst is hover/tap-driven only.
		 */
		phase?: 'idle' | 'animating' | 'done';
		src?: string;
		alt?: string;
		/** Play a synthesised stab with each burst. */
		sound?: boolean;
	}

	let {
		phase = 'done',
		src = '/profile.png',
		alt = 'Louigie Caminoy',
		sound = true
	}: Props = $props();

	const stackClass = $derived(
		phase === 'idle' ? 'is-idle' : phase === 'animating' ? 'is-revealing' : 'is-open'
	);

	/** Must match the longest keyframe duration in the stylesheet below. */
	const BURST_MS = 900;

	let root = $state<HTMLDivElement>();
	let burstTimer: ReturnType<typeof setTimeout> | undefined;
	let catchUpTimer: ReturnType<typeof setTimeout> | undefined;
	let bursting = false;
	let burstEndsAt = 0;
	let firedIntro = false;
	/** The load burst has been played at least once with audio actually on. */
	let heardIntro = false;

	const prefersReducedMotion = () =>
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/**
	 * Restart the one-shot burst. The class has to be removed and reflowed
	 * before it goes back on, otherwise re-adding it on an element that already
	 * has it is a no-op and the animation never replays.
	 */
	function fire(intensity: number) {
		if (!root || bursting || prefersReducedMotion()) return;
		bursting = true;
		burstEndsAt = performance.now() + BURST_MS;

		root.classList.remove('is-glitching');
		void root.offsetWidth;
		root.classList.add('is-glitching');

		if (sound) playGlitch(intensity);

		clearTimeout(burstTimer);
		burstTimer = setTimeout(() => {
			root?.classList.remove('is-glitching');
			bursting = false;
		}, BURST_MS);
	}

	onMount(() => {
		const disarm = armGlitchAudio();
		let offReady: (() => void) | undefined;

		if (sound) {
			// Start decoding straight away, at low fetch priority. It has to be
			// in memory before the load burst at ~1.6s, and the priority hint is
			// what keeps it from competing with the portrait (the LCP element).
			void preloadGlitchSample();

			// The load burst is muted by the browser's autoplay policy unless the
			// visitor has already interacted. Rather than lose it, replay the
			// whole burst — audible this time — the moment audio unlocks.
			offReady = onGlitchAudioReady(() => {
				if (heardIntro) return;
				heardIntro = true;
				// Audio unlocked before the load burst even ran (a returning
				// Chrome visitor, or an in-app navigation that carried the
				// gesture over) — that burst will be audible on its own.
				if (!firedIntro) return;
				if (prefersReducedMotion()) return;
				// Don't fire into the tail of the silent burst the unlocking
				// click may have just started; queue behind it instead.
				const wait = Math.max(0, burstEndsAt - performance.now());
				catchUpTimer = setTimeout(() => {
					// Only if the portrait is actually on screen — a glitch sound
					// with no visible glitch reads as a stray noise.
					const box = root?.getBoundingClientRect();
					if (box && box.bottom > 0 && box.top < window.innerHeight) fire(1);
				}, wait);
			});
		}

		return () => {
			disarm();
			offReady?.();
			clearTimeout(burstTimer);
			clearTimeout(catchUpTimer);
		};
	});

	// A mouse *click* never fires a burst — the hover that preceded it already
	// did. Touch devices have no hover, so a tap stands in for it there.
	function onHover() {
		if (window.matchMedia('(hover: hover)').matches) fire(0.8);
	}

	function onTap(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		fire(0.95);
	}

	// The single automatic burst, once the reveal wipe has finished.
	$effect(() => {
		if (phase !== 'done' || firedIntro) return;
		firedIntro = true;
		fire(1);
	});
</script>

<!-- The outer box is deliberately NOT clipped: the angular shards throw
     outward past the portrait's bounds. Only .frame clips, so the photo, its
     colour echoes and the binary canvas stay inside the bracket. -->
<div
	bind:this={root}
	class="glitch-face {stackClass}"
	style="--face: url('{src}')"
	onmouseenter={onHover}
	onpointerdown={onTap}
	role="presentation"
>
	<div class="shards" aria-hidden="true">
		<span class="shard shard-1"></span>
		<span class="shard shard-2"></span>
		<span class="shard shard-3"></span>
		<span class="shard shard-4"></span>
		<span class="shard shard-5"></span>
		<span class="shard shard-6"></span>
	</div>

	<div class="frame">
		<BinaryFace />

		<!-- Flat-colour silhouettes of the cut-out PNG, masked by its own alpha.
		     These sit *behind* the photo so the face never loses its features —
		     they only ever read as offset echoes leaking past the edges. -->
		<span class="echo echo-far" aria-hidden="true"></span>
		<span class="echo echo-mid" aria-hidden="true"></span>
		<span class="echo echo-near" aria-hidden="true"></span>

		<img class="plate base" {src} {alt} decoding="async" />

		<!-- Chromatic ghosting: the same plate tinted to the accent and to the
		     neutral end of the palette, offset in opposite directions. -->
		<img class="plate ghost ghost-cool" {src} alt="" aria-hidden="true" decoding="async" />
		<img class="plate ghost ghost-flat" {src} alt="" aria-hidden="true" decoding="async" />

		<!-- Fragmented geometric slices: horizontal bands of the plate torn out
		     and displaced sideways in hard steps. -->
		<img class="plate slice slice-1" {src} alt="" aria-hidden="true" decoding="async" />
		<img class="plate slice slice-2" {src} alt="" aria-hidden="true" decoding="async" />
		<img class="plate slice slice-3" {src} alt="" aria-hidden="true" decoding="async" />

		<span class="halftone" aria-hidden="true"></span>
		<span class="scan" aria-hidden="true"></span>
		<span class="tear" aria-hidden="true"></span>
	</div>
</div>

<style>
	/* ---------------------------------------------------------------------
	   Burst timeline. Every keyframe block below runs ONCE over 900ms and
	   shares one shape:

	     0-28%   cluster one  - hard hit, then two clipped echoes
	     28-46%  quiet
	     46-66%  cluster two  - the aftershock
	     66-100% settled, everything back at rest

	   Nothing loops. The burst is triggered from script on first load and on
	   hover/tap.
	   --------------------------------------------------------------------- */

	.glitch-face {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.frame {
		position: relative;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.plate,
	.echo,
	.halftone,
	.scan,
	.tear {
		position: absolute;
		inset: 0;
		height: 100%;
		width: 100%;
		display: block;
		pointer-events: none;
	}

	.plate {
		object-fit: cover;
		object-position: center;
	}

	.base {
		z-index: 2;
	}

	/* ---- intro reveal -------------------------------------------------- */

	/* Everything but the binary canvas underneath stays hidden until the
	   reveal starts — the canvas is the placeholder the wipe uncovers. */
	.is-idle .plate,
	.is-idle .echo,
	.is-idle .halftone,
	.is-idle .scan,
	.is-idle .tear,
	.is-idle .shards {
		opacity: 0;
	}

	@keyframes gfReveal {
		from {
			clip-path: inset(100% 0 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}

	.is-revealing .frame {
		animation: gfReveal 1.2s ease-out forwards;
	}

	.is-revealing .shards {
		opacity: 0;
	}

	/* ---- offset silhouettes (primary / secondary / neutral echoes) ------ */

	.echo {
		z-index: 1;
		-webkit-mask-image: var(--face);
		mask-image: var(--face);
		-webkit-mask-size: cover;
		mask-size: cover;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		opacity: 0;
	}

	.echo-far {
		background: var(--color-accent-dim);
	}
	.echo-mid {
		background: var(--color-accent);
	}
	.echo-near {
		background: var(--color-text-primary);
	}

	/* steps() keeps the displacement snapping between frames instead of
	   sliding — that's what reads as comic-panel rather than motion blur. */
	@keyframes gfEchoFar {
		0% {
			opacity: 0.55;
			transform: translate3d(-9%, 2%, 0) skewX(-6deg);
		}
		10% {
			opacity: 0.3;
			transform: translate3d(6%, -3%, 0) skewX(4deg);
		}
		19% {
			opacity: 0.5;
			transform: translate3d(-5%, -1%, 0);
		}
		28%,
		46%,
		66%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		50% {
			opacity: 0.4;
			transform: translate3d(7%, 3%, 0) skewX(5deg);
		}
		58% {
			opacity: 0.24;
			transform: translate3d(-4%, 1%, 0);
		}
	}

	@keyframes gfEchoMid {
		0% {
			opacity: 0.45;
			transform: translate3d(5%, -2%, 0);
		}
		8% {
			opacity: 0.7;
			transform: translate3d(-7%, 1%, 0) skewY(3deg);
		}
		18% {
			opacity: 0.35;
			transform: translate3d(3%, 4%, 0);
		}
		27%,
		46%,
		66%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		49% {
			opacity: 0.5;
			transform: translate3d(-6%, -2%, 0) skewY(-3deg);
		}
		57% {
			opacity: 0.28;
			transform: translate3d(4%, 2%, 0);
		}
	}

	@keyframes gfEchoNear {
		0% {
			opacity: 0.35;
			transform: translate3d(3%, 2%, 0) scale(1.03);
		}
		12% {
			opacity: 0.2;
			transform: translate3d(-2%, -2%, 0) scale(0.98);
		}
		24%,
		46%,
		64%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		51% {
			opacity: 0.28;
			transform: translate3d(-3%, 1%, 0) scale(1.02);
		}
	}

	.is-glitching .echo-far {
		animation: gfEchoFar 0.9s steps(1, end) 1;
	}
	.is-glitching .echo-mid {
		animation: gfEchoMid 0.9s steps(1, end) 1;
	}
	.is-glitching .echo-near {
		animation: gfEchoNear 0.9s steps(1, end) 1;
	}

	/* ---- chromatic ghosting -------------------------------------------- */

	.ghost {
		z-index: 3;
		opacity: 0;
		/* Push the plate to a single brand hue rather than an arbitrary RGB
		   split: greyscale first, then re-tint, so both ghosts stay inside the
		   palette in either theme. */
		filter: grayscale(1) brightness(1.15) contrast(1.6) sepia(1) hue-rotate(185deg) saturate(5);
	}

	.ghost-flat {
		filter: grayscale(1) contrast(2.2) brightness(0.9);
	}

	:global(html.dark) .ghost {
		mix-blend-mode: screen;
	}
	:global(html:not(.dark)) .ghost {
		mix-blend-mode: multiply;
	}

	@keyframes gfGhostCool {
		0% {
			opacity: 0.75;
			transform: translate3d(-4%, 0, 0);
		}
		9% {
			opacity: 0.4;
			transform: translate3d(3%, -1%, 0);
		}
		20% {
			opacity: 0.65;
			transform: translate3d(-2.5%, 1%, 0);
		}
		28%,
		46%,
		64%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		48% {
			opacity: 0.6;
			transform: translate3d(3.5%, 0, 0);
		}
		56% {
			opacity: 0.3;
			transform: translate3d(-2%, 0, 0);
		}
	}

	@keyframes gfGhostFlat {
		0% {
			opacity: 0.5;
			transform: translate3d(4%, 1%, 0);
		}
		11% {
			opacity: 0.3;
			transform: translate3d(-3%, 0, 0);
		}
		21% {
			opacity: 0.45;
			transform: translate3d(2%, -1.5%, 0);
		}
		29%,
		46%,
		64%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		50% {
			opacity: 0.4;
			transform: translate3d(-3.5%, 0, 0);
		}
	}

	.is-glitching .ghost-cool {
		animation: gfGhostCool 0.9s steps(1, end) 1;
	}
	.is-glitching .ghost-flat {
		animation: gfGhostFlat 0.9s steps(1, end) 1;
	}

	/* ---- fragmented slices --------------------------------------------- */

	.slice {
		z-index: 4;
		opacity: 0;
	}

	/* Each slice owns a fixed band of the portrait; the animation only moves
	   it sideways, so the tear always lands on the same anatomy. */
	.slice-1 {
		clip-path: inset(16% 0 68% 0);
	}
	.slice-2 {
		clip-path: inset(44% 0 44% 0);
	}
	.slice-3 {
		clip-path: inset(71% 0 12% 0);
	}

	@keyframes gfSliceA {
		0% {
			opacity: 1;
			transform: translate3d(-11%, 0, 0);
		}
		7% {
			opacity: 1;
			transform: translate3d(7%, 0, 0);
		}
		15% {
			opacity: 1;
			transform: translate3d(-4%, 0, 0);
		}
		22%,
		46%,
		62%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		48% {
			opacity: 1;
			transform: translate3d(9%, 0, 0);
		}
		55% {
			opacity: 1;
			transform: translate3d(-3%, 0, 0);
		}
	}

	@keyframes gfSliceB {
		0% {
			opacity: 1;
			transform: translate3d(9%, 0, 0);
		}
		9% {
			opacity: 1;
			transform: translate3d(-8%, 0, 0);
		}
		17% {
			opacity: 1;
			transform: translate3d(3%, 0, 0);
		}
		25%,
		46%,
		62%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		50% {
			opacity: 1;
			transform: translate3d(-7%, 0, 0);
		}
		57% {
			opacity: 1;
			transform: translate3d(2%, 0, 0);
		}
	}

	@keyframes gfSliceC {
		0% {
			opacity: 1;
			transform: translate3d(-6%, 0, 0);
		}
		10% {
			opacity: 1;
			transform: translate3d(10%, 0, 0);
		}
		19% {
			opacity: 1;
			transform: translate3d(-2%, 0, 0);
		}
		26%,
		46%,
		63%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		52% {
			opacity: 1;
			transform: translate3d(6%, 0, 0);
		}
	}

	.is-glitching .slice-1 {
		animation: gfSliceA 0.9s steps(1, end) 1;
	}
	.is-glitching .slice-2 {
		animation: gfSliceB 0.9s steps(1, end) 1;
	}
	.is-glitching .slice-3 {
		animation: gfSliceC 0.9s steps(1, end) 1;
	}

	/* ---- broken halftone ------------------------------------------------ */

	/* Comic-print dots in the accent, clipped to the silhouette AND to a coarse
	   diagonal band pattern — the intersection is what makes the halftone read
	   as broken rather than as a flat screen over the whole face. */
	.halftone {
		z-index: 5;
		background-image: radial-gradient(var(--color-accent) 30%, transparent 32%);
		background-size: 4px 4px;
		opacity: 0;
		-webkit-mask-image:
			var(--face),
			repeating-linear-gradient(
				62deg,
				#000 0 14px,
				transparent 14px 26px,
				#000 26px 32px,
				transparent 32px 58px
			);
		mask-image:
			var(--face),
			repeating-linear-gradient(
				62deg,
				#000 0 14px,
				transparent 14px 26px,
				#000 26px 32px,
				transparent 32px 58px
			);
		-webkit-mask-size: cover, auto;
		mask-size: cover, auto;
		-webkit-mask-position: center, center;
		mask-position: center, center;
		-webkit-mask-repeat: no-repeat, repeat;
		mask-repeat: no-repeat, repeat;
		-webkit-mask-composite: source-in;
		mask-composite: intersect;
	}

	@keyframes gfHalftone {
		0% {
			opacity: 0.9;
			transform: translate3d(2%, 0, 0);
		}
		10% {
			opacity: 0.35;
			transform: translate3d(-3%, 1%, 0);
		}
		20% {
			opacity: 0.75;
			transform: translate3d(1%, -1%, 0);
		}
		28%,
		46%,
		64%,
		100% {
			opacity: 0;
			transform: translate3d(0, 0, 0);
		}
		49% {
			opacity: 0.6;
			transform: translate3d(-2%, 0, 0);
		}
		57% {
			opacity: 0.3;
			transform: translate3d(2%, 1%, 0);
		}
	}

	.is-glitching .halftone {
		animation: gfHalftone 0.9s steps(1, end) 1;
	}

	/* ---- scanline distortion + displacement tear ------------------------ */

	.scan {
		z-index: 6;
		background: repeating-linear-gradient(
			0deg,
			transparent 0 2px,
			color-mix(in srgb, var(--color-accent) 22%, transparent) 2px 3px
		);
		opacity: 0;
	}

	@keyframes gfScan {
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
		50% {
			opacity: 0.8;
			transform: translate3d(0, 2px, 0);
		}
		58% {
			opacity: 0.45;
			transform: translate3d(0, -2px, 0);
		}
	}

	.is-glitching .scan {
		animation: gfScan 0.9s steps(1, end) 1;
	}

	/* A single hard displacement bar sweeping down the portrait — the classic
	   "signal tear" read, in the accent so it stays on-palette. */
	.tear {
		z-index: 7;
		background: linear-gradient(
			180deg,
			transparent 0 46%,
			color-mix(in srgb, var(--color-accent) 55%, transparent) 46% 49%,
			var(--color-surface) 49% 50.5%,
			color-mix(in srgb, var(--color-text-primary) 40%, transparent) 50.5% 52%,
			transparent 52% 100%
		);
		opacity: 0;
	}

	@keyframes gfTear {
		0% {
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
		26%,
		46%,
		62%,
		100% {
			opacity: 0;
			transform: translate3d(0, 40%, 0);
		}
		49% {
			opacity: 1;
			transform: translate3d(0, -12%, 0);
		}
		56% {
			opacity: 1;
			transform: translate3d(0, 12%, 0);
		}
	}

	.is-glitching .tear {
		animation: gfTear 0.9s steps(1, end) 1;
	}

	/* ---- angular shards throwing outward -------------------------------- */

	.shards {
		position: absolute;
		/* Overshoots the frame on purpose — these are the only pieces allowed
		   outside the portrait box. */
		inset: -14%;
		z-index: 8;
		pointer-events: none;
	}

	.shard {
		position: absolute;
		display: block;
		opacity: 0;
	}

	.shard-1 {
		top: 12%;
		left: -2%;
		width: 26%;
		height: 5%;
		background: var(--color-accent);
		clip-path: polygon(0 0, 100% 34%, 78% 100%, 0 62%);
	}

	.shard-2 {
		top: 30%;
		right: -4%;
		width: 32%;
		height: 3.5%;
		background: var(--color-text-primary);
		clip-path: polygon(0 22%, 100% 0, 100% 74%, 14% 100%);
	}

	.shard-3 {
		bottom: 26%;
		left: -6%;
		width: 30%;
		height: 2.5%;
		background: var(--color-accent);
		clip-path: polygon(0 0, 100% 40%, 100% 100%, 22% 66%);
	}

	.shard-4 {
		bottom: 9%;
		right: 2%;
		width: 22%;
		height: 6%;
		background: var(--color-accent-dim);
		clip-path: polygon(10% 0, 100% 18%, 84% 100%, 0 70%);
	}

	.shard-5 {
		top: 4%;
		right: 16%;
		width: 3%;
		height: 20%;
		background: var(--color-border-hover);
		clip-path: polygon(40% 0, 100% 8%, 62% 100%, 0 84%);
	}

	.shard-6 {
		bottom: 2%;
		left: 22%;
		width: 2.5%;
		height: 17%;
		background: var(--color-accent);
		clip-path: polygon(0 10%, 100% 0, 58% 100%, 20% 88%);
	}

	@keyframes gfShardOut {
		0% {
			opacity: 1;
			transform: translate3d(-18%, 0, 0) scaleX(1);
		}
		10% {
			opacity: 0.6;
			transform: translate3d(-34%, -2%, 0) scaleX(1.25);
		}
		20%,
		46%,
		66%,
		100% {
			opacity: 0;
			transform: translate3d(-52%, -3%, 0) scaleX(1.4);
		}
		50% {
			opacity: 0.9;
			transform: translate3d(-26%, 1%, 0) scaleX(1.1);
		}
		58% {
			opacity: 0.4;
			transform: translate3d(-40%, 2%, 0) scaleX(1.3);
		}
	}

	@keyframes gfShardOutR {
		0% {
			opacity: 1;
			transform: translate3d(20%, 0, 0) scaleX(1);
		}
		11% {
			opacity: 0.55;
			transform: translate3d(38%, 2%, 0) scaleX(1.3);
		}
		21%,
		46%,
		66%,
		100% {
			opacity: 0;
			transform: translate3d(56%, 4%, 0) scaleX(1.45);
		}
		51% {
			opacity: 0.85;
			transform: translate3d(28%, -1%, 0) scaleX(1.15);
		}
		59% {
			opacity: 0.35;
			transform: translate3d(44%, 0, 0) scaleX(1.35);
		}
	}

	@keyframes gfShardVert {
		0% {
			opacity: 1;
			transform: translate3d(0, -30%, 0) scaleY(1.1);
		}
		12% {
			opacity: 0.5;
			transform: translate3d(2%, -52%, 0) scaleY(1.3);
		}
		23%,
		46%,
		66%,
		100% {
			opacity: 0;
			transform: translate3d(3%, -70%, 0) scaleY(1.4);
		}
		52% {
			opacity: 0.8;
			transform: translate3d(0, -38%, 0) scaleY(1.2);
		}
	}

	/* Small per-shard delays so the fragments leave the body in a ragged
	   order rather than all at once. */
	.is-glitching .shard-1 {
		animation: gfShardOut 0.9s steps(1, end) 1;
	}
	.is-glitching .shard-2 {
		animation: gfShardOutR 0.86s steps(1, end) 0.04s 1;
	}
	.is-glitching .shard-3 {
		animation: gfShardOut 0.82s steps(1, end) 0.08s 1;
	}
	.is-glitching .shard-4 {
		animation: gfShardOutR 0.78s steps(1, end) 0.12s 1;
	}
	.is-glitching .shard-5 {
		animation: gfShardVert 0.88s steps(1, end) 0.03s 1;
	}
	.is-glitching .shard-6 {
		animation: gfShardVert 0.8s steps(1, end) 0.1s 1 reverse;
	}

	/* ---- base plate kick ------------------------------------------------- */

	@keyframes gfBaseKick {
		0% {
			transform: translate3d(-1.8%, 0, 0);
			filter: contrast(1.4);
		}
		8% {
			transform: translate3d(1.6%, -0.6%, 0);
			filter: contrast(1.1);
		}
		17% {
			transform: translate3d(-0.9%, 0.5%, 0);
			filter: contrast(1.25);
		}
		26%,
		46%,
		62%,
		100% {
			transform: translate3d(0, 0, 0);
			filter: none;
		}
		49% {
			transform: translate3d(1.2%, 0, 0);
			filter: contrast(1.2);
		}
	}

	.is-glitching .base {
		animation: gfBaseKick 0.9s steps(1, end) 1;
	}

	/* ---- reduced motion -------------------------------------------------- */

	/* Script already refuses to fire a burst under reduced motion; this is the
	   belt-and-braces half, plus a static echo pair so the portrait keeps its
	   dimensional read without any movement. */
	@media (prefers-reduced-motion: reduce) {
		.is-revealing .frame,
		.is-glitching .echo,
		.is-glitching .ghost,
		.is-glitching .slice,
		.is-glitching .halftone,
		.is-glitching .scan,
		.is-glitching .tear,
		.is-glitching .shard,
		.is-glitching .base {
			animation: none;
		}

		.is-idle .plate,
		.is-idle .shards,
		.is-revealing .shards {
			opacity: 1;
		}

		.echo-mid {
			opacity: 0.22;
			transform: translate3d(-3%, 1%, 0);
		}
		.echo-far {
			opacity: 0.3;
			transform: translate3d(3%, -1%, 0);
		}
	}
</style>
