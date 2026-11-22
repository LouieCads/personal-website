<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import { lockScroll } from '$lib/scroll';
	import { isWin, formatMonth, type Recognition } from '$lib/data/recognitions';

	/**
	 * Recognitions as a hiking route. The trail leaves camp at the foot of the
	 * mountain with the oldest award and switchbacks up to the summit, where the
	 * newest one sits, so the page still reads newest first from the top down.
	 * The mountain is drawn in the site's own greys (theme text mixed into the
	 * surface) so it follows light and dark mode; only the trail takes the accent.
	 *
	 * A stop shows the essentials; selecting one opens the full story in a dialog.
	 */
	interface Props {
		items: Recognition[];
	}
	let { items }: Props = $props();

	const uid = $props.id();

	interface Point {
		x: number;
		y: number;
	}

	/** Smooth curve through every point (Catmull-Rom, as cubic Béziers). */
	function smooth(pts: Point[]): string {
		if (pts.length < 2) return '';
		let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const p0 = pts[i - 1] ?? pts[i];
			const p1 = pts[i];
			const p2 = pts[i + 1];
			const p3 = pts[i + 2] ?? p2;
			const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
			const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
			d += ` C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p2.x)} ${f(p2.y)}`;
		}
		return d;
	}

	/** Straight-edged outline, closed along the bottom: faceted, low-poly ridges. */
	function ridge(pts: Point[], floor: number): string {
		const line = pts.map((p, i) => `${i ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`).join(' ');
		const last = pts[pts.length - 1];
		return `${line} L${f(last.x)} ${f(floor)} L${f(pts[0].x)} ${f(floor)} Z`;
	}

	function f(n: number) {
		return n.toFixed(1);
	}

	/** A pine: three stacked tiers and a stub of trunk, standing on (x, y). */
	function pine(x: number, y: number, h: number): string {
		let d = `M${f(x - 1.5)} ${f(y)} h3 v${f(-h * 0.18)} h-3 Z`;
		for (let j = 0; j < 3; j++) {
			const top = y - h + j * h * 0.24;
			const bottom = top + h * 0.46;
			const w = h * (0.2 + j * 0.08);
			d += ` M${f(x)} ${f(top)} L${f(x + w)} ${f(bottom)} L${f(x - w)} ${f(bottom)} Z`;
		}
		return d;
	}

	/** A ridge tent, pegged at (x, y). Drawn as lines, like the rest of the site. */
	function tent(x: number, y: number): string {
		return (
			`M${f(x - 20)} ${f(y)} L${f(x)} ${f(y - 22)} L${f(x + 20)} ${f(y)} Z ` +
			`M${f(x)} ${f(y - 22)} L${f(x - 5)} ${f(y)} M${f(x)} ${f(y - 22)} L${f(x + 5)} ${f(y)} ` +
			`M${f(x - 26)} ${f(y)} H${f(x + 26)}`
		);
	}

	// ---- Wide layout: one mountain, trail from camp to summit ----

	/** Marker size: the pin's tip sits exactly on its stop. */
	const PIN_W = 56;
	const PIN_H = 72;
	const GAP = 12;
	const LABEL_W = 190;
	const PEAK_Y = 104;

	/** SSR has no width to measure; this is close to the widest content box. */
	let width = $state(1200);

	const wide = $derived.by(() => {
		const W = width;
		const n = items.length;
		const H = Math.max(460, 170 + n * 92);
		const px = W / 2;
		const baseL = H * 0.82;
		const baseR = H * 0.74;
		const span = H - PEAK_Y;
		const at = (u: number, v: number) => ({ x: u * W, y: PEAK_Y + v * span });

		// Far range, mid hills and the main peak, back to front.
		const far = ridge(
			[
				at(0, 0.3),
				at(0.07, 0.18),
				at(0.15, 0.26),
				at(0.24, 0.1),
				at(0.33, 0.22),
				at(0.42, 0.15),
				at(0.5, 0.3),
				at(0.6, 0.2),
				at(0.7, 0.07),
				at(0.79, 0.2),
				at(0.88, 0.11),
				at(1, 0.24)
			],
			H
		);
		const mid = ridge(
			[
				at(0, 0.6),
				at(0.08, 0.5),
				at(0.18, 0.58),
				at(0.27, 0.66),
				at(0.36, 0.72),
				at(0.64, 0.74),
				at(0.74, 0.6),
				at(0.84, 0.52),
				at(0.93, 0.6),
				at(1, 0.55)
			],
			H
		);

		const peak = { x: px, y: PEAK_Y };
		// [distance down the ridge, sideways nudge, vertical nudge] — the nudges
		// break the straight flanks into facets and give the right side a shoulder.
		const leftRidge = [
			[0.14, 0.012, 0],
			[0.3, -0.008, 0.02],
			[0.46, 0.014, -0.02],
			[0.62, -0.006, 0.01],
			[0.8, 0.01, -0.01],
			[1, 0, 0]
		].map(([s, dx, dy]) => ({
			x: px * (1 - s) + dx * W,
			y: PEAK_Y + s * (baseL - PEAK_Y) + dy * span
		}));
		const rightRidge = [
			[0.1, 0, 0],
			[0.2, 0.02, -0.05],
			[0.32, 0, 0.02],
			[0.5, 0.012, -0.03],
			[0.7, -0.01, 0.02],
			[1, 0, 0]
		].map(([s, dx, dy]) => ({
			x: px + s * (W - px) + dx * W,
			y: PEAK_Y + s * (baseR - PEAK_Y) + dy * span
		}));
		const main = ridge([...[...leftRidge].reverse(), peak, ...rightRidge], H);
		// The shaded face: the whole right flank, split from the lit side by a
		// crease that runs from the summit down to the foot.
		const shade = `M${f(px)} ${f(PEAK_Y)} ${rightRidge
			.map((p) => `L${f(p.x)} ${f(p.y)}`)
			.join(
				' '
			)} L${f(W)} ${f(H)} L${f(px + W * 0.06)} ${f(H)} L${f(px + W * 0.04)} ${f(H * 0.6)} Z`;

		const groundY = H * 0.93;
		const ground = smooth([
			{ x: 0, y: H * 0.9 },
			{ x: W * 0.25, y: H * 0.925 },
			{ x: W * 0.5, y: H * 0.9 },
			{ x: W * 0.75, y: H * 0.935 },
			{ x: W, y: H * 0.91 }
		]);
		const groundFill = `${ground} L${W} ${H} L0 ${H} Z`;

		const trees = [
			[0.015, 46],
			[0.04, 60],
			[0.07, 40],
			[0.1, 54],
			[0.14, 36],
			[0.8, 38],
			[0.835, 56],
			[0.865, 44],
			[0.9, 62],
			[0.935, 42],
			[0.97, 52]
		]
			.map(([u, h]) => pine(u * W, groundY, h))
			.join(' ');

		// Stops: k counts up from camp, so k = 0 is the oldest award.
		const bottom = H - 72;
		const reach = W / 2 - (PIN_W / 2 + GAP + LABEL_W + 8);
		const stops = items.map((item, i) => {
			const k = n - 1 - i;
			const t = n > 1 ? k / (n - 1) : 1;
			const y = bottom - t * (bottom - PEAK_Y);
			if (i === 0) return { item, i, x: px, y, left: (n - 2) % 2 === 0 };
			const left = k % 2 === 1;
			const flank = (px * (y - PEAK_Y)) / (baseL - PEAK_Y);
			const amp = Math.max(80, Math.min(reach, flank * 0.78));
			return { item, i, x: px + (left ? -amp : amp), y, left };
		});

		// Trail runs camp → summit so it draws in as a climb.
		const camp = { x: px, y: H - 30 };
		const climb = [...stops].reverse().map(({ x, y }) => ({ x, y }));
		const trail = smooth([camp, ...climb]);

		return { H, far, mid, main, shade, groundFill, ground, trees, stops, trail, camp };
	});

	// ---- Narrow layout: the trail runs straight down from the summit ----

	const ROW = 120;
	const LANE = PIN_W / 2;
	const HEAD = 84;
	const FOOT = 56;

	const tall = $derived.by(() => {
		const H = HEAD + ROW * items.length + FOOT;
		const tip = (i: number) => HEAD + ROW * i + (ROW + PIN_H) / 2;
		const pts: Point[] = [{ x: LANE, y: H - 18 }];
		for (let i = items.length - 1; i >= 0; i--) {
			pts.push({ x: LANE, y: tip(i) });
			pts.push({ x: LANE + (i % 2 ? 10 : -10), y: tip(i) - ROW / 2 });
		}
		pts.push({ x: LANE, y: 26 });
		return { H, trail: smooth(pts), tent: tent(LANE, H - 14) };
	});

	// ---- Detail dialog ----

	let dialog: HTMLDialogElement | undefined = $state();
	let current = $state<number | null>(null);
	const open = $derived(current === null ? null : items[current]);
	/** The pin that opened the dialog, refocused when it closes. */
	let opener: HTMLElement | null = null;

	function show(i: number, event: MouseEvent) {
		opener = event.currentTarget as HTMLElement;
		current = i;
		if (!dialog?.open) {
			dialog?.showModal();
			lockScroll(true);
		}
	}

	function step(by: number) {
		if (current === null) return;
		current = Math.min(items.length - 1, Math.max(0, current + by));
	}

	function onClose() {
		lockScroll(false);
		current = null;
		opener?.focus({ preventScroll: true });
	}

	/** A click that lands on the dialog itself, not its sheet, is the backdrop. */
	function onDialogClick(event: MouseEvent) {
		if (event.target === dialog) dialog?.close();
	}

	function onDialogKey(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') step(1);
		else if (event.key === 'ArrowLeft') step(-1);
	}

	const pad = (n: number) => String(n).padStart(2, '0');
	const asset = (src: string) => (src.startsWith('/') ? `${base}${src}` : src);
	const initials = (name: string) =>
		name
			.split(/\s+/)
			.map((w) => w[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');
</script>

{#snippet disc(item: Recognition, size: 'sm' | 'lg' = 'sm')}
	<span class="disc {size}" class:on-dark={item.logoOnDark}>
		{#if item.logo}
			<img src={asset(item.logo)} alt={size === 'lg' ? `${item.organizer} logo` : ''} />
		{:else}
			<span class="initials" aria-hidden="true">{initials(item.organizer)}</span>
		{/if}
	</span>
{/snippet}

{#snippet marker(item: Recognition)}
	<span class="marker">
		<svg viewBox="0 0 56 72" aria-hidden="true">
			<path d="M28 71 C21 59 2 47 2 28 A26 26 0 1 1 54 28 C54 47 35 59 28 71 Z" />
		</svg>
		{@render disc(item)}
	</span>
{/snippet}

{#snippet summary(item: Recognition, i: number)}
	<span class="summary">
		<span class="tag">
			<span class="num">{pad(i + 1)}</span>
			<span class="award" class:win={isWin(item.award)}>{item.award}</span>
		</span>
		<span class="event">{item.event}</span>
		<time class="when" datetime={item.date}>{formatMonth(item.date)}</time>
	</span>
{/snippet}

{#snippet trailPath(d: string, id: string)}
	<defs>
		<mask {id} maskUnits="userSpaceOnUse">
			<path class="trail-reveal" {d} pathLength="1" />
		</mask>
	</defs>
	<path class="trail" {d} mask="url(#{id})" />
{/snippet}

<div class="hike" bind:clientWidth={width} use:reveal>
	<!-- Wide: one mountain, camp to summit -->
	<div class="scene" style:height="{wide.H}px">
		<svg class="land" width="100%" height={wide.H} aria-hidden="true">
			<path class="far" d={wide.far} />
			<path class="mid" d={wide.mid} />
			<path class="main" d={wide.main} />
			<path class="shade" d={wide.shade} />
			<path class="trees" d={wide.trees} />
			<path class="ground" d={wide.groundFill} />
			<path class="ground-line" d={wide.ground} />
			<path class="camp" d={tent(wide.camp.x, wide.camp.y)} />
			{@render trailPath(wide.trail, `${uid}-wide`)}
		</svg>
		<ol>
			{#each wide.stops as { item, i, x, y, left } (item.id)}
				<li
					class="stop"
					class:left
					style:left="{x}px"
					style:top="{y}px"
					style:--order={items.length - 1 - i}
				>
					<span class="dot" aria-hidden="true"></span>
					<button type="button" class="pin" aria-haspopup="dialog" onclick={(e) => show(i, e)}>
						{@render marker(item)}
						{@render summary(item, i)}
					</button>
				</li>
			{/each}
		</ol>
	</div>

	<!-- Narrow: the same trail, summit at the top -->
	<div class="track" style:height="{tall.H}px">
		<svg class="land" width="100%" height={tall.H} aria-hidden="true">
			<path class="far" d="M0 84 L18 52 L34 64 L58 30 L84 58 L108 44 L140 84 Z" />
			<path class="main" d="M-8 84 L{LANE} 22 L46 40 L60 34 L92 84 Z" />
			<path class="shade" d="M{LANE} 22 L46 40 L38 84 Z" />
			<path class="flag-pole" d="M{LANE} 22 V4" />
			<path class="flag" d="M{LANE} 4 L{LANE + 14} 8.5 L{LANE} 13 Z" />
			<path class="camp" d={tall.tent} />
			{@render trailPath(tall.trail, `${uid}-tall`)}
		</svg>
		<ol style:padding-top="{HEAD}px">
			{#each items as item, i (item.id)}
				<li class="row" style:height="{ROW}px" style:--order={items.length - 1 - i}>
					<button type="button" class="pin" aria-haspopup="dialog" onclick={(e) => show(i, e)}>
						{@render marker(item)}
						{@render summary(item, i)}
					</button>
				</li>
			{/each}
		</ol>
	</div>
</div>

<dialog
	bind:this={dialog}
	class="sheet"
	aria-labelledby="rec-sheet-title"
	data-lenis-prevent
	onclose={onClose}
	onclick={onDialogClick}
	onkeydown={onDialogKey}
>
	{#if open && current !== null}
		<div class="sheet-inner">
			<header class="sheet-bar">
				<span class="count">{pad(current + 1)} / {pad(items.length)}</span>
				<span class="rule" aria-hidden="true"></span>
				<button type="button" class="close" onclick={() => dialog?.close()}>
					<span aria-hidden="true">[ ESC ]</span>
					<span class="sr-only">Close</span>
				</button>
			</header>

			<div class="sheet-head">
				{@render disc(open, 'lg')}
				<div>
					<p class="award" class:win={isWin(open.award)}>{open.award}</p>
					<h3 id="rec-sheet-title">{open.event}</h3>
					<p class="by">{open.organizer}</p>
				</div>
			</div>

			<dl class="facts">
				<div>
					<dt>Date</dt>
					<dd><time datetime={open.date}>{formatMonth(open.date)}</time></dd>
				</div>
				<div>
					<dt>Venue</dt>
					<dd>{open.venue}</dd>
				</div>
				{#if open.project}
					<div>
						<dt>Project</dt>
						<dd>{open.project}</dd>
					</div>
				{/if}
			</dl>

			<p class="desc">{open.description}</p>

			{#if open.image}
				<figure class="art">
					<img
						src={asset(open.image.src)}
						alt={open.image.alt}
						width={open.image.width}
						height={open.image.height}
						loading="lazy"
						decoding="async"
					/>
				</figure>
			{/if}

			{#if open.url}
				<a class="out" href={open.url} target="_blank" rel="noopener noreferrer"
					>VIEW ON {host(open.url).toUpperCase()} <span aria-hidden="true">↗</span></a
				>
			{/if}

			<footer class="sheet-nav">
				<button type="button" disabled={current === 0} onclick={() => step(-1)}>
					<span aria-hidden="true">←</span> NEWER
				</button>
				<button type="button" disabled={current === items.length - 1} onclick={() => step(1)}>
					OLDER <span aria-hidden="true">→</span>
				</button>
			</footer>
		</div>
	{/if}
</dialog>

<style>
	.hike {
		position: relative;
		container-type: inline-size;
	}

	/* ---- Landscape: theme ink mixed into the surface, back layers lightest ---- */
	.land {
		position: absolute;
		top: 0;
		left: 0;
		overflow: visible;
		pointer-events: none;
	}
	.land path {
		stroke-linejoin: round;
	}
	.far {
		fill: color-mix(in srgb, var(--color-text-primary) 5%, var(--color-surface));
		stroke: var(--color-border);
		stroke-width: 1;
	}
	.mid {
		fill: color-mix(in srgb, var(--color-text-primary) 9%, var(--color-surface));
		stroke: var(--color-border);
		stroke-width: 1;
	}
	.main {
		fill: color-mix(in srgb, var(--color-text-primary) 13%, var(--color-surface));
		stroke: var(--color-border-hover);
		stroke-width: 1;
	}
	.shade {
		fill: color-mix(in srgb, var(--color-text-primary) 18%, var(--color-surface));
	}
	.trees {
		fill: color-mix(in srgb, var(--color-text-primary) 28%, var(--color-surface));
	}
	.ground {
		fill: color-mix(in srgb, var(--color-text-primary) 15%, var(--color-surface));
	}
	.ground-line {
		fill: none;
		stroke: var(--color-border-hover);
		stroke-width: 1;
	}
	.camp,
	.flag-pole {
		fill: none;
		stroke: var(--color-text-secondary);
		stroke-width: 1.25;
		stroke-linecap: round;
	}
	.flag {
		fill: var(--color-accent);
	}
	.trail {
		fill: none;
		stroke: var(--color-accent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: 6 7;
	}
	/* The mask path is solid; sweeping its dash offset "walks" the trail in. */
	.trail-reveal {
		fill: none;
		stroke: #fff;
		stroke-width: 8;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 2.2s cubic-bezier(0.65, 0, 0.35, 1);
	}
	:global(.hike.is-visible) .trail-reveal {
		stroke-dashoffset: 0;
	}

	/* ---- Pins: shared ---- */
	ol {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.pin {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.pin:focus-visible {
		outline: none;
	}
	.marker {
		position: relative;
		display: block;
		flex: none;
		width: 56px;
		height: 72px;
		transition: transform 0.25s;
	}
	.marker svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.marker path {
		fill: var(--color-surface);
		stroke: var(--color-border-hover);
		stroke-width: 1.5;
		transition:
			fill 0.25s,
			stroke 0.25s;
	}
	.pin:hover .marker,
	.pin:focus-visible .marker {
		transform: translateY(-4px);
	}
	.pin:hover .marker path,
	.pin:focus-visible .marker path {
		fill: var(--color-accent);
		stroke: var(--color-accent);
	}
	.disc {
		display: grid;
		flex: none;
		place-items: center;
		overflow: hidden;
		border-radius: 50%;
		/* white so every organizer keeps its brand colours in both themes */
		background: #fff;
		box-shadow: 0 0 0 1px var(--color-border);
	}
	.disc.on-dark {
		background: #111;
	}
	.disc.sm {
		position: absolute;
		top: 8px;
		left: 8px;
		width: 40px;
		height: 40px;
	}
	.disc img {
		display: block;
		width: 74%;
		height: 74%;
		object-fit: contain;
	}
	.initials {
		font: 14px var(--font-mono);
		color: #111;
	}
	.summary {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 4px;
		padding-top: 6px;
	}
	.tag {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.num {
		font: 11px var(--font-mono);
		color: var(--color-accent);
	}
	.award {
		font: 10px/1.4 var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}
	.award.win {
		color: var(--color-accent);
	}
	.event {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
	}
	.pin:hover .event,
	.pin:focus-visible .event {
		text-decoration: underline;
		text-decoration-color: var(--color-accent);
		text-underline-offset: 3px;
	}
	.when {
		font: 10px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
	}

	/* ---- Wide layout ---- */
	.scene {
		position: relative;
		display: none;
	}
	/* Each stop is a zero-size anchor on the trail; the pin's tip sits on it. */
	.stop {
		position: absolute;
		width: 0;
		height: 0;
	}
	.dot {
		position: absolute;
		top: -4px;
		left: -4px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-accent);
		box-shadow: 0 0 0 3px var(--color-surface);
	}
	.scene .pin {
		position: absolute;
		top: -72px;
		left: -28px;
		width: calc(56px + 12px + 190px);
	}
	/* Pins on the left flank read outward: label first, marker on the trail. */
	.stop.left .pin {
		left: auto;
		right: -28px;
		flex-direction: row-reverse;
		text-align: right;
	}
	.stop.left .tag {
		flex-direction: row-reverse;
	}

	/* ---- Narrow layout ---- */
	.track {
		position: relative;
	}
	.row {
		display: flex;
		align-items: center;
	}
	.track .pin {
		width: 100%;
		gap: 18px;
	}

	@container (min-width: 860px) {
		.scene {
			display: block;
		}
		.track {
			display: none;
		}
	}

	/* ---- Entrance: the trail walks in, pins drop in hiking order ---- */
	.stop,
	.row {
		opacity: 0;
		transform: translateY(-8px);
		transition:
			opacity 0.45s ease calc(0.3s + var(--order) * 0.22s),
			transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) calc(0.3s + var(--order) * 0.22s);
	}
	:global(.hike.is-visible) .stop,
	:global(.hike.is-visible) .row {
		opacity: 1;
		transform: none;
	}

	/* ---- Dialog ---- */
	.sheet {
		width: min(640px, calc(100vw - 32px));
		max-height: calc(100dvh - 48px);
		margin: auto;
		padding: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		border: 1px solid var(--color-border);
		border-top: 2px solid var(--color-accent);
		background: var(--color-surface);
		color: var(--color-text-primary);
	}
	.sheet::backdrop {
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(3px);
	}
	.sheet[open] {
		animation: sheet-in 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}
	.sheet-inner {
		padding: 20px 28px 24px;
	}
	.sheet-bar {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 24px;
	}
	.count {
		font: 11px var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--color-accent);
	}
	.rule {
		flex: 1;
		height: 1px;
		background: var(--color-rule);
	}
	.close,
	.sheet-nav button {
		padding: 6px 0;
		border: 0;
		background: none;
		font: 11px var(--font-mono);
		letter-spacing: 0.14em;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color 0.2s;
	}
	.close:hover,
	.sheet-nav button:hover:not(:disabled) {
		color: var(--color-accent);
	}
	.close:focus-visible,
	.sheet-nav button:focus-visible,
	.out:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
	}
	.sheet-head {
		display: flex;
		align-items: center;
		gap: 22px;
	}
	.disc.lg {
		width: 88px;
		height: 88px;
		box-shadow:
			0 0 0 1px var(--color-border),
			0 0 0 5px var(--color-surface),
			0 0 0 6px var(--color-border);
	}
	.sheet-head .award {
		display: inline-block;
		padding: 3px 8px;
		border: 1px solid var(--color-border);
	}
	.sheet-head .award.win {
		border-color: var(--color-accent);
	}
	.sheet-head h3 {
		margin: 10px 0 4px;
		font-size: 22px;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.025em;
	}
	.by {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1px;
		margin: 24px 0 20px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.facts div {
		padding: 12px 14px;
		background: var(--color-surface-alt);
	}
	.facts dt {
		font: 9px var(--font-mono);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	.facts dd {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--color-text-primary);
	}
	.desc {
		font-size: 14px;
		line-height: 1.75;
		color: var(--color-text-secondary);
	}
	.art {
		margin: 20px 0 0;
		/* the artwork's transparent header has dark marks: keep them legible */
		background: #e6e6e6;
		border: 1px solid var(--color-border);
	}
	.art img {
		display: block;
		width: 100%;
		height: auto;
	}
	.out {
		display: inline-block;
		margin-top: 18px;
		font: 11px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--color-accent);
		text-underline-offset: 4px;
	}
	.out:hover {
		text-decoration: underline;
	}
	.sheet-nav {
		display: flex;
		justify-content: space-between;
		margin-top: 24px;
		padding-top: 14px;
		border-top: 1px solid var(--color-rule);
	}
	.sheet-nav button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	@media (max-width: 479px) {
		.sheet-inner {
			padding: 16px 18px 20px;
		}
		.sheet-head {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}
		.disc.lg {
			width: 68px;
			height: 68px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.trail-reveal {
			stroke-dashoffset: 0;
			transition: none;
		}
		.stop,
		.row,
		.marker,
		.marker path {
			transition: none;
		}
		.stop,
		.row {
			opacity: 1;
			transform: none;
		}
		.sheet[open] {
			animation: none;
		}
	}
</style>
