import type Lenis from 'lenis';

/**
 * The page's Lenis instance, set once by the root layout. Everything that
 * scrolls programmatically goes through here so it stays in step with the
 * smooth scroller instead of fighting it.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
	instance = next;
}

export function scrollToTop() {
	if (instance) {
		instance.scrollTo(0);
		return;
	}
	if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
}

export function scrollToId(id: string) {
	if (typeof document === 'undefined') return;
	const el = document.getElementById(id);
	if (!el) return;

	if (instance) {
		instance.scrollTo(el, { offset: -64 });
		return;
	}
	el.scrollIntoView({ block: 'start' });
}
