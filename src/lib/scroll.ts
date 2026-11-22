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

/**
 * Freeze page scrolling while a modal is open. Lenis listens to the wheel on
 * the window, so it has to be stopped too, not just the document's overflow.
 */
export function lockScroll(locked: boolean) {
	if (typeof document === 'undefined') return;
	document.documentElement.style.overflow = locked ? 'hidden' : '';
	if (locked) instance?.stop();
	else instance?.start();
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

/**
 * Jump to an absolute document offset. Used by the scroll gutter, where the
 * target comes from a pointer position on the rail rather than from an element.
 * `immediate` skips the ease so a drag tracks the pointer instead of chasing it.
 */
export function scrollToOffset(y: number, immediate = false) {
	if (instance) {
		instance.scrollTo(y, { immediate });
		return;
	}
	if (typeof window !== 'undefined') {
		window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
	}
}
