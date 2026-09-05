import {
	armGlitchAudio,
	playGlitch,
	preloadGlitchSample,
	type GlitchVoice
} from '$lib/audio/glitch';

/**
 * Whether the device can actually hover. Touch browsers synthesise a
 * `mouseenter` on tap, so every hover trigger has to check this or a tap fires
 * twice — once as the real pointer event, once as the synthetic mouse one.
 */
export function isHoverDevice() {
	return typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
}

interface Options {
	voice?: GlitchVoice;
	intensity?: number;
}

/**
 * Plays a stab on hover, or on tap where there is no hover. Sound only — no
 * visual effect and no CSS hook; use `glitchLink` when the element should
 * glitch as well.
 *
 * A mouse *click* deliberately does not trigger it: the hover that preceded it
 * already did.
 */
export function hoverSound(node: HTMLElement, options: Options = {}) {
	if (typeof window === 'undefined') return;

	let { voice = 'card', intensity = 0.55 } = options;

	armGlitchAudio();
	void preloadGlitchSample(voice);

	const stab = () => playGlitch(intensity, voice);

	const onEnter = () => {
		if (isHoverDevice()) stab();
	};

	const onPointerDown = (e: PointerEvent) => {
		if (e.pointerType === 'mouse') return;
		stab();
	};

	node.addEventListener('mouseenter', onEnter);
	node.addEventListener('pointerdown', onPointerDown);

	return {
		update(next: Options = {}) {
			voice = next.voice ?? 'card';
			intensity = next.intensity ?? 0.55;
		},
		destroy() {
			node.removeEventListener('mouseenter', onEnter);
			node.removeEventListener('pointerdown', onPointerDown);
		}
	};
}
