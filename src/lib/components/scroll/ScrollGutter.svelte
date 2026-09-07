<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollToOffset, scrollToTop } from '$lib/scroll';
	import { hoverSound } from '$lib/actions/hoverSound';
	import { sections } from '$lib/data/portfolio';

	/** How long the readout stays lit after the page stops moving. */
	const LIVE_MS = 600;
	/** How far down the page the up button appears, as a share of the viewport.
	    Half a screen is past "began scrolling" but well short of a full page. */
	const UP_AT = 0.5;

	let root: HTMLDivElement;
	let rail: HTMLDivElement;
	let fill: HTMLDivElement;
	let thumb: HTMLDivElement;
	let readout: HTMLDivElement;
	let hit: HTMLDivElement;
	let up: HTMLButtonElement;

	/** One tick per section that is actually on this page. Detail pages have
	    none of these ids, so they get a bare rail and no map. */
	let ticks = $state<{ id: string; number: string; top: number; active: boolean }[]>([]);

	onMount(() => {
		let frame = 0;
		let liveTimer = 0;
		let dragging = false;
		let maxScroll = 0;
		/* Rail geometry is read back from the DOM rather than duplicated as
		   constants here: layout.css moves the inset and the thumb per
		   breakpoint, and a second copy of those numbers would silently drift
		   out of step with it. */
		let railTop = 0;
		let thumbLen = 0;
		/** Usable run: the span the thumb's top edge can occupy. */
		let railRun = 0;
		/** Readout length, cached. Unpadded text means this changes as the number
		    gains a digit, so it is re-read on a change rather than every frame. */
		let readoutLen = 0;
		let readoutText = '';

		const measure = () => {
			const r = rail.getBoundingClientRect();
			railTop = r.top;
			thumbLen = thumb.offsetHeight;
			railRun = Math.max(0, r.height - thumbLen);
			readoutText = '';
			maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
			placeTicks();
			draw();
		};

		/** Ticks sit at each section's own scroll fraction, so the rail is a map
		    of the document rather than of the viewport. */
		const placeTicks = () => {
			if (maxScroll <= 0) {
				ticks = [];
				return;
			}
			ticks = sections.flatMap((s) => {
				const el = document.getElementById(s.id);
				if (!el) return [];
				const offset = el.getBoundingClientRect().top + window.scrollY;
				const p = Math.min(1, Math.max(0, offset / maxScroll));
				return [
					{
						id: s.id,
						number: s.number,
						top: railTop + thumbLen / 2 + p * railRun,
						active: false
					}
				];
			});
		};

		const draw = () => {
			const p = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
			const thumbTop = railTop + p * railRun;
			const centre = thumbTop + thumbLen / 2;

			root.classList.toggle('is-active', maxScroll > 0);
			// Tied to distance, not to `is-live`: a control that fades out while
			// idle is a control you cannot tap.
			up.classList.toggle('is-visible', window.scrollY > window.innerHeight * UP_AT);
			fill.style.height = `${centre - railTop}px`;
			thumb.style.transform = `translateY(${thumbTop}px)`;

			// Written before it is measured: the number is unpadded, so it runs
			// 0% to 100% and the element's length grows with each extra digit.
			const text = `${Math.round(p * 100)}%`;
			if (text !== readoutText) {
				readoutText = text;
				readout.textContent = text;
				readoutLen = readout.offsetHeight;
			}

			// Readout rides the thumb but stays inside the rail's run, so it never
			// hangs off the top or bottom of the viewport at the extremes.
			readout.style.transform = `translateY(${Math.min(
				railTop + railRun + thumbLen - readoutLen,
				Math.max(railTop, centre - readoutLen / 2)
			)}px)`;

			// The nearest tick at or above the thumb is the section being read.
			let activeIndex = -1;
			for (let i = 0; i < ticks.length; i++) {
				if (ticks[i].top <= centre + 1) activeIndex = i;
			}
			for (let i = 0; i < ticks.length; i++) {
				ticks[i].active = i === activeIndex;
			}
		};

		/** Coalesce scroll bursts into one paint per frame. */
		const schedule = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				draw();
			});
		};

		const markLive = () => {
			root.classList.add('is-live');
			clearTimeout(liveTimer);
			liveTimer = window.setTimeout(() => {
				if (!dragging) root.classList.remove('is-live');
			}, LIVE_MS);
		};

		const onScroll = () => {
			schedule();
			markLive();
		};

		/** Map a pointer's y to a document offset, aiming the thumb's centre at
		    the cursor rather than its top edge. */
		const seek = (clientY: number, immediate: boolean) => {
			if (railRun <= 0) return;
			const p = Math.min(1, Math.max(0, (clientY - railTop - thumbLen / 2) / railRun));
			scrollToOffset(p * maxScroll, immediate);
		};

		const onPointerDown = (e: PointerEvent) => {
			dragging = true;
			root.classList.add('is-live');
			hit.setPointerCapture(e.pointerId);
			// The first press eases to the target; the drag that follows is direct.
			seek(e.clientY, false);
			e.preventDefault();
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!dragging) return;
			seek(e.clientY, true);
		};

		const onPointerUp = (e: PointerEvent) => {
			if (!dragging) return;
			dragging = false;
			hit.releasePointerCapture(e.pointerId);
			markLive();
		};

		// Content height moves as sections reveal and remote data lands, so the
		// rail is re-measured from the document itself, not just on resize.
		const observer = new ResizeObserver(measure);
		observer.observe(document.documentElement);

		/* The pinned CLI owns the bottom edge, so the up button is stacked on top
		   of it rather than given a guessed offset — its height changes with the
		   breakpoint, and would change again if that bar ever grows. */
		const cli = document.querySelector('[data-cli-bar]');
		let cliObserver: ResizeObserver | null = null;
		if (cli) {
			const trackCli = () => {
				up.style.setProperty('--cli-h', `${cli.getBoundingClientRect().height}px`);
			};
			cliObserver = new ResizeObserver(trackCli);
			cliObserver.observe(cli);
			trackCli();
		}

		/* No stowing on CLI focus: that bar focuses its own input on mount and
		   refocuses it on every document click, so keying off focus hid the
		   button permanently. Its suggestion panel can open under the button
		   instead — the button is z-60 to the bar's z-50 and sits at the panel's
		   empty right end, so nothing readable is covered. */

		measure();

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', measure);
		hit.addEventListener('pointerdown', onPointerDown);
		hit.addEventListener('pointermove', onPointerMove);
		hit.addEventListener('pointerup', onPointerUp);
		hit.addEventListener('pointercancel', onPointerUp);

		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(liveTimer);
			observer.disconnect();
			cliObserver?.disconnect();
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', measure);
			hit.removeEventListener('pointerdown', onPointerDown);
			hit.removeEventListener('pointermove', onPointerMove);
			hit.removeEventListener('pointerup', onPointerUp);
			hit.removeEventListener('pointercancel', onPointerUp);
		};
	});
</script>

<!-- Decorative: the page is fully scrollable by keyboard and wheel without it,
     and a screen reader gains nothing from a percentage readout. -->
<div class="gutter" bind:this={root} aria-hidden="true">
	<div class="gutter-rail" bind:this={rail}></div>
	<div class="gutter-fill" bind:this={fill}></div>

	{#each ticks as tick (tick.id)}
		<div class="gutter-tick" class:is-active={tick.active} style="top: {tick.top}px"></div>
	{/each}

	<div class="gutter-readout" bind:this={readout}>0%</div>

	<div class="gutter-thumb" bind:this={thumb}>
		<span class="gc gc-tl"></span>
		<span class="gc gc-tr"></span>
		<span class="gc gc-bl"></span>
		<span class="gc gc-br"></span>
	</div>

	<div class="gutter-hit" bind:this={hit}></div>
</div>

<!-- A real control, so it lives outside the aria-hidden gutter above: it is
     reachable by keyboard, and `visibility` (not opacity) hides it, which keeps
     it out of the tab order while it is off screen. -->
<button
	class="gutter-up"
	bind:this={up}
	onclick={scrollToTop}
	use:hoverSound={{ voice: 'nav', intensity: 0.45 }}
	aria-label="Back to top"
>
	<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
		<path d="M3 10 L8 5 L13 10" fill="none" stroke="currentColor" stroke-width="1.25" />
	</svg>
	<span class="corner corner-tl"></span>
	<span class="corner corner-tr"></span>
	<span class="corner corner-bl"></span>
	<span class="corner corner-br"></span>
</button>
