/**
 * Glitch stabs for the hero portrait and the primary nav.
 *
 * Plays decoded samples through one small Web Audio graph rather than cloning
 * `new Audio()` elements: one decode per voice, no allocation per hover, and
 * the mute control below applies to everything at once. If a sample can't be
 * fetched or decoded we fall back to a synthesised burst so the effect never
 * goes silently missing.
 */

/** Which sound a burst uses. The portrait and the nav are deliberately different. */
export type GlitchVoice = 'face' | 'nav';

const SAMPLES: Record<GlitchVoice, string> = {
	face: '/mixkit-glitch-static-1457.wav',
	nav: '/mixkit-digital-glitch-break-2951.wav'
};

/** Hard cap on one stab, matched to each voice's visual burst. */
const BURST_S: Record<GlitchVoice, number> = {
	face: 0.9,
	nav: 0.42
};

/**
 * Minimum gap between two stabs of the same voice. Without this, sweeping the
 * cursor across the four nav links machine-guns four overlapping samples.
 */
const MIN_GAP_S: Record<GlitchVoice, number> = {
	face: 0.25,
	nav: 0.11
};

/** Peak output. Single knob for the whole effect — turn this to taste. */
const MASTER_GAIN = 0.26;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let muted = false;

const buffers = new Map<GlitchVoice, AudioBuffer>();
const pending = new Map<GlitchVoice, Promise<void>>();
const lastPlayed = new Map<GlitchVoice, number>();
const readyWaiters = new Set<() => void>();

function flushReady() {
	if (!ctx || ctx.state !== 'running') return;
	const waiters = [...readyWaiters];
	readyWaiters.clear();
	for (const fn of waiters) fn();
}

function ensure(): AudioContext | null {
	if (ctx) return ctx;
	if (typeof window === 'undefined') return null;

	const AC: typeof AudioContext | undefined =
		window.AudioContext ??
		(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
	if (!AC) return null;

	ctx = new AC();
	master = ctx.createGain();
	master.gain.value = muted ? 0 : MASTER_GAIN;
	master.connect(ctx.destination);
	// Covers the cases we don't drive ourselves: a context that starts
	// 'running' outright (Chrome grants that on sites with a high media
	// engagement score), or one the browser resumes on its own.
	ctx.onstatechange = flushReady;

	return ctx;
}

/**
 * Run `fn` once, as soon as audio is actually permitted to play.
 *
 * Fires immediately if the context is already running. Otherwise it waits for
 * the first user gesture — see `armGlitchAudio`. This is what lets the hero
 * replay its load burst *audibly* the moment the visitor first interacts,
 * instead of that first burst being silently lost to the autoplay policy.
 *
 * Returns an unsubscribe function.
 */
export function onGlitchAudioReady(fn: () => void): () => void {
	if (typeof window === 'undefined') return () => {};

	const c = ensure();
	if (c && c.state === 'running') {
		fn();
		return () => {};
	}

	readyWaiters.add(fn);
	return () => readyWaiters.delete(fn);
}

/**
 * Fetch and decode one voice's sample. Safe to call before any user gesture —
 * only *playback* is gated by the autoplay policy, not decoding, so this can
 * run while the context is still suspended.
 */
export function preloadGlitchSample(voice: GlitchVoice = 'face'): Promise<void> {
	const existing = pending.get(voice);
	if (existing) return existing;

	const c = ensure();
	if (!c) return Promise.resolve();

	// Low priority: the hero portrait is the LCP element and these are a few
	// hundred KB of audio nobody can hear for at least a second. Chrome honours
	// the hint; everyone else ignores it harmlessly.
	const task = fetch(SAMPLES[voice], { priority: 'low' } as RequestInit)
		.then((res) => {
			if (!res.ok) throw new Error(`glitch sample ${voice} ${res.status}`);
			return res.arrayBuffer();
		})
		.then((buf) => c.decodeAudioData(buf))
		.then((decoded) => {
			buffers.set(voice, decoded);
		})
		.catch(() => {
			// Leave the voice unbuffered; playGlitch falls back to the synth.
			buffers.delete(voice);
		});

	pending.set(voice, task);
	return task;
}

/**
 * Autoplay policy: an AudioContext created outside a user gesture starts
 * 'suspended' and stays silent. Hovering is NOT a gesture, so we resume on the
 * first pointerdown/keydown anywhere on the page. Bursts before that are
 * dropped rather than queued — a delayed stab is worse than no stab.
 *
 * Returns a teardown function.
 */
export function armGlitchAudio(): () => void {
	if (typeof window === 'undefined') return () => {};

	const resume = () => {
		const c = ensure();
		// Whatever the visitor touches first, make sure both voices are on the
		// way in — the next hover shouldn't be the thing that starts the fetch.
		void preloadGlitchSample('face');
		void preloadGlitchSample('nav');
		if (!c) return;
		if (c.state === 'suspended') void c.resume().then(flushReady);
		else flushReady();
	};

	const opts = { once: true, passive: true } as const;
	window.addEventListener('pointerdown', resume, opts);
	window.addEventListener('keydown', resume, opts);
	window.addEventListener('touchstart', resume, opts);

	return () => {
		window.removeEventListener('pointerdown', resume);
		window.removeEventListener('keydown', resume);
		window.removeEventListener('touchstart', resume);
	};
}

export function setGlitchMuted(next: boolean) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : MASTER_GAIN, ctx.currentTime, 0.02);
}

export function isGlitchMuted() {
	return muted;
}

/**
 * Fire one glitch burst. Silent (and cheap) if the context has not been
 * unlocked by a user gesture yet.
 *
 * @param intensity 0-1 scale on the burst; hover uses a softer value than the
 *                  page-load hit.
 * @param voice     which sample to use.
 */
export function playGlitch(intensity = 1, voice: GlitchVoice = 'face') {
	const c = ensure();
	if (!c || !master) return;
	if (c.state !== 'running') return;

	const last = lastPlayed.get(voice) ?? -Infinity;
	if (c.currentTime - last < MIN_GAP_S[voice]) return;
	lastPlayed.set(voice, c.currentTime);

	const k = Math.max(0, Math.min(1, intensity));
	const buffer = buffers.get(voice);
	if (buffer) playSample(c, master, k, buffer, BURST_S[voice]);
	else playSynth(c, master, k, BURST_S[voice]);
}

function playSample(c: AudioContext, out: GainNode, k: number, buffer: AudioBuffer, cap: number) {
	const t = c.currentTime;

	const src = c.createBufferSource();
	src.buffer = buffer;
	// Per-fire pitch drift so two hovers in a row don't sound identical.
	src.playbackRate.value = 0.9 + Math.random() * 0.28;

	// The samples run longer than the visual bursts, so cut them with an
	// envelope instead of letting a tail hang over something already settled.
	const env = c.createGain();
	env.gain.setValueAtTime(0.0001, t);
	env.gain.exponentialRampToValueAtTime(k, t + 0.006);
	env.gain.setValueAtTime(k, t + cap * 0.55);
	env.gain.exponentialRampToValueAtTime(0.0001, t + cap);

	src.connect(env).connect(out);
	src.start(t);
	src.stop(t + cap + 0.02);
	src.onended = () => {
		src.disconnect();
		env.disconnect();
	};
}

/* ---- synthesised fallback ------------------------------------------------ */

function ensureNoise(c: AudioContext): AudioBuffer {
	if (noise) return noise;
	const len = Math.floor(c.sampleRate * 0.5);
	noise = c.createBuffer(1, len, c.sampleRate);
	const data = noise.getChannelData(0);
	for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
	return noise;
}

/** One filtered-noise hit: the "shard" component of the synth burst. */
function stab(
	c: AudioContext,
	out: GainNode,
	at: number,
	dur: number,
	freq: number,
	q: number,
	level: number
) {
	const src = c.createBufferSource();
	src.buffer = ensureNoise(c);
	const offset = Math.random() * 0.4;

	const band = c.createBiquadFilter();
	band.type = 'bandpass';
	band.frequency.value = freq;
	band.Q.value = q;

	const env = c.createGain();
	env.gain.setValueAtTime(0.0001, at);
	env.gain.exponentialRampToValueAtTime(level, at + 0.004);
	env.gain.exponentialRampToValueAtTime(0.0001, at + dur);

	src.connect(band).connect(env).connect(out);
	src.start(at, offset, dur + 0.02);
	src.stop(at + dur + 0.02);
}

function playSynth(c: AudioContext, out: GainNode, k: number, cap: number) {
	const t = c.currentTime;
	const drift = 0.85 + Math.random() * 0.3;
	// Squeeze the cluster spacing into whatever window this voice allows.
	const s = cap / 0.9;

	const bus = c.createGain();
	bus.gain.value = k;
	bus.connect(out);

	// Cluster one: hard hit, then two clipped echoes chasing it.
	stab(c, bus, t, 0.075 * s, 2400 * drift, 1.2, 0.9);
	stab(c, bus, t + 0.085 * s, 0.045 * s, 900 * drift, 3.0, 0.55);
	stab(c, bus, t + 0.155 * s, 0.06 * s, 3600 * drift, 2.0, 0.45);
	// Cluster two: the aftershock, lined up with the second visual hit.
	stab(c, bus, t + 0.46 * s, 0.09 * s, 1500 * drift, 1.5, 0.6);

	// Downward square sweep — the "phasing out of the universe" tone.
	const osc = c.createOscillator();
	osc.type = 'square';
	osc.frequency.setValueAtTime(1250 * drift, t);
	osc.frequency.exponentialRampToValueAtTime(140, t + 0.18 * s);
	const oscEnv = c.createGain();
	oscEnv.gain.setValueAtTime(0.0001, t);
	oscEnv.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
	oscEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.2 * s);
	osc.connect(oscEnv).connect(bus);
	osc.start(t);
	osc.stop(t + 0.22 * s);

	// Low thunk under the first hit, so the burst has weight on real speakers.
	const sub = c.createOscillator();
	sub.type = 'sine';
	sub.frequency.setValueAtTime(78, t);
	sub.frequency.exponentialRampToValueAtTime(38, t + 0.13 * s);
	const subEnv = c.createGain();
	subEnv.gain.setValueAtTime(0.0001, t);
	subEnv.gain.exponentialRampToValueAtTime(0.34, t + 0.01);
	subEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.16 * s);
	sub.connect(subEnv).connect(bus);
	sub.start(t);
	sub.stop(t + 0.18 * s);

	window.setTimeout(() => bus.disconnect(), cap * 1000);
}
