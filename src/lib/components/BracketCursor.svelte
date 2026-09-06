<script lang="ts">
	import { onMount } from 'svelte';

	/** Anything the reticle will lock onto. */
	const TARGETS = 'a, button, [role="button"], summary, [data-cursor="snap"]';
	/** Real text fields keep the native caret. */
	const FIELDS = 'input, textarea, [contenteditable="true"], [data-cursor="text"]';

	/** Side of the free-floating box when nothing is under the pointer. */
	const IDLE = 28;
	/** Breathing room left between a locked target and the brackets. */
	const PAD = 6;
	/** A target wider or taller than this is treated as scenery, not a control —
	    a nav bar or a full-width card wrapper should not swallow the reticle. */
	const MAX_SNAP = 560;

	let box: HTMLDivElement;
	let dot: HTMLDivElement;

	onMount(() => {
		if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

		const root = document.documentElement;
		root.classList.add('has-bracket-cursor');

		// Reduced motion keeps the reticle but drops the chase: it jumps straight
		// to each position instead of easing there.
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const EASE = reduceMotion ? 1 : 0.18;

		let px = 0;
		let py = 0;
		let target: Element | null = null;
		let shown = false;
		let frame = 0;

		// Current (interpolated) box, in viewport coordinates.
		let x = 0;
		let y = 0;
		let w = IDLE;
		let h = IDLE;
		let seeded = false;

		const lerp = (a: number, b: number) => a + (b - a) * EASE;

		const loop = () => {
			frame = requestAnimationFrame(loop);

			let tx = px - IDLE / 2;
			let ty = py - IDLE / 2;
			let tw = IDLE;
			let th = IDLE;

			if (target) {
				// Re-read every frame rather than caching on hover: Lenis is moving
				// the page under the pointer, so a rect captured once drifts.
				const r = target.getBoundingClientRect();
				tx = r.left - PAD;
				ty = r.top - PAD;
				tw = r.width + PAD * 2;
				th = r.height + PAD * 2;
			}

			if (!seeded) {
				// First frame lands exactly, so the brackets never fly in from 0,0.
				seeded = true;
				[x, y, w, h] = [tx, ty, tw, th];
			} else {
				x = lerp(x, tx);
				y = lerp(y, ty);
				w = lerp(w, tw);
				h = lerp(h, th);
			}

			box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
			box.style.width = `${w}px`;
			box.style.height = `${h}px`;
			// The dot is the honest one: no easing, so it sits exactly where a
			// click will land while the brackets are still catching up.
			dot.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
		};

		const onMove = (e: PointerEvent) => {
			if (e.pointerType === 'touch') return;
			px = e.clientX;
			py = e.clientY;
			if (!shown) {
				shown = true;
				box.classList.add('is-visible');
				dot.classList.add('is-visible');
				if (!frame) frame = requestAnimationFrame(loop);
			}
		};

		const onOver = (e: PointerEvent) => {
			const el = e.target as Element | null;
			if (!el?.closest) return;

			const field = !!el.closest(FIELDS);
			root.classList.toggle('has-bracket-cursor', !field);
			box.classList.toggle('is-field', field);
			dot.classList.toggle('is-field', field);
			if (field) {
				target = null;
				return;
			}

			const hit = el.closest(TARGETS);
			const r = hit?.getBoundingClientRect();
			target = r && r.width <= MAX_SNAP && r.height <= MAX_SNAP ? hit : null;
			box.classList.toggle('is-locked', !!target);
		};

		const onDown = () => box.classList.add('is-down');
		const onUp = () => box.classList.remove('is-down');

		const onOut = (e: PointerEvent) => {
			if (e.relatedTarget) return;
			shown = false;
			box.classList.remove('is-visible');
			dot.classList.remove('is-visible');
		};

		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('pointerover', onOver, { passive: true });
		window.addEventListener('pointerdown', onDown, { passive: true });
		window.addEventListener('pointerup', onUp, { passive: true });
		document.addEventListener('pointerout', onOut);
		window.addEventListener('blur', onOut as EventListener);

		return () => {
			cancelAnimationFrame(frame);
			root.classList.remove('has-bracket-cursor');
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerover', onOver);
			window.removeEventListener('pointerdown', onDown);
			window.removeEventListener('pointerup', onUp);
			document.removeEventListener('pointerout', onOut);
			window.removeEventListener('blur', onOut as EventListener);
		};
	});
</script>

<div bind:this={box} class="reticle" aria-hidden="true">
	<span class="rc-corner rc-tl"></span>
	<span class="rc-corner rc-tr"></span>
	<span class="rc-corner rc-bl"></span>
	<span class="rc-corner rc-br"></span>
</div>
<div bind:this={dot} class="reticle-dot" aria-hidden="true"></div>
