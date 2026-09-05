import { armGlitchAudio, playGlitch, preloadGlitchSample } from '$lib/audio/glitch';

/** Arm the audio context once per page load, from whichever target mounts first. */
let armed = false;

/**
 * Marks a link or button as a glitch target.
 *
 * Adds the `.glitch-link` CSS hook that drives the stacked GlitchText layers
 * (keyframes live in routes/layout.css) and fires the 'nav' audio stab on
 * hover and on keyboard focus. Pair it with a `<GlitchText>` around the label:
 * this action supplies the trigger, GlitchText supplies the layers.
 */
export function glitchLink(node: HTMLElement, intensity = 0.55) {
	node.classList.add('glitch-link');

	if (typeof window === 'undefined') return;

	if (!armed) {
		armed = true;
		armGlitchAudio();
		void preloadGlitchSample('nav');
	}

	let level = intensity;
	let tapTimer: ReturnType<typeof setTimeout> | undefined;

	const stab = () => playGlitch(level, 'nav');

	// A mouse *click* never triggers anything — the hover that preceded it
	// already did. Touch has no hover at all, so a tap stands in for it.
	const onEnter = () => {
		if (window.matchMedia('(hover: hover)').matches) stab();
	};

	// Touch and pen only. On a pure touch device the browser also synthesises a
	// mouseenter on tap, but `(hover: hover)` is false there so onEnter ignores
	// it; on a hybrid laptop the audio rate limit swallows the duplicate.
	const onPointerDown = (e: PointerEvent) => {
		if (e.pointerType === 'mouse') return;
		stab();
		// The CSS burst hangs off :hover, which a tap never enters — drive it
		// from a class instead. Remove/reflow/add so a second tap replays it.
		node.classList.remove('is-tapped');
		void node.offsetWidth;
		node.classList.add('is-tapped');
		clearTimeout(tapTimer);
		tapTimer = setTimeout(() => node.classList.remove('is-tapped'), 420);
	};

	// Match the CSS, which animates on :focus-visible — a mouse click also
	// focuses the link, and that shouldn't count as a trigger.
	const onFocus = () => {
		if (node.matches(':focus-visible')) stab();
	};

	node.addEventListener('mouseenter', onEnter);
	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('focus', onFocus);

	return {
		update(next: number) {
			level = next;
		},
		destroy() {
			clearTimeout(tapTimer);
			node.removeEventListener('mouseenter', onEnter);
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('focus', onFocus);
		}
	};
}
