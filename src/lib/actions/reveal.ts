export function reveal(node: HTMLElement) {
	// Ensure initial hidden state for the reveal animation.
	node.classList.add('reveal');

	// During SSR there is no IntersectionObserver.
	if (typeof window === 'undefined') return;

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduceMotion) {
		node.classList.add('is-visible');
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			node.classList.add('is-visible');
			observer.disconnect();
		},
		{
			threshold: 0.15,
			rootMargin: '0px 0px -10% 0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
