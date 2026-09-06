/**
 * One page-entrance glitch, broadcast to every section that opted in.
 *
 * The hero fires this alongside its own burst, so the whole page glitches as a
 * single event. The alternative — each section reacting to its own scroll
 * position — was rejected deliberately: a burst arriving as you scroll past
 * reads as a rendering fault rather than a flourish, and it makes the effect
 * depend on which direction you happened to be scrolling.
 */
const listeners = new Set<() => void>();

export function onGlitchPulse(fn: () => void): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

export function pulseGlitch() {
	// Copy first: a listener that unsubscribes itself must not disturb the walk.
	for (const fn of [...listeners]) fn();
}
