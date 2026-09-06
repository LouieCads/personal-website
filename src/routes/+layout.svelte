<script lang="ts">
	import './layout.css';
	import { theme } from '$lib/stores/theme';
	import { setLenis } from '$lib/scroll';
	import { onMount } from 'svelte';
	import BracketCursor from '$lib/components/BracketCursor.svelte';

	let { children } = $props();

	onMount(() => {
		// Apply stored theme immediately to avoid flash
		const stored = localStorage.getItem('theme') ?? 'light';
		if (stored === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		theme.set(stored as 'light' | 'dark');
	});

	onMount(() => {
		// Smooth scrolling via Lenis. Anyone who asked for reduced motion keeps
		// the browser's own instant scrolling.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let frame = 0;
		let destroy: (() => void) | null = null;
		let cancelled = false;

		import('lenis').then(({ default: Lenis }) => {
			if (cancelled) return;

			// lerp tracks the wheel far more tightly than a fixed duration ease,
			// which reads as "smooth" rather than "floaty and behind my input"
			const lenis = new Lenis({
				lerp: 0.14,
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 1.6
			});

			setLenis(lenis);

			const loop = (time: number) => {
				lenis.raf(time);
				frame = requestAnimationFrame(loop);
			};
			frame = requestAnimationFrame(loop);

			destroy = () => {
				cancelAnimationFrame(frame);
				lenis.destroy();
				setLenis(null);
			};
		});

		return () => {
			cancelled = true;
			destroy?.();
		};
	});
</script>

<BracketCursor />

{@render children()}
