<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import { lockScroll } from '$lib/scroll';
	import { formatMonth, type Recognition } from '$lib/data/recognitions';
	import { buildTerrain, pine, tent, SUMMIT, CLOUD, type Point } from '$lib/terrain';

	/**
	 * Recognitions as a hiking route. The trail leaves camp at the foot of the
	 * mountain with the oldest award and switchbacks up to the summit, where the
	 * newest one sits, so the page still reads newest first from the top down.
	 * The mountain is a minimalist low-poly diorama (see $lib/terrain): static
	 * SVG facets shaded in the site's own greys, so it follows light and dark
	 * mode and costs nothing per frame. Only the trail takes the accent.
	 *
	 * A stop shows only the award and event; selecting one opens the full story in a dialog.
	 */
	interface Props {
		items: Recognition[];
	}
	let { items }: Props = $props();

	const uid = $props.id();

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

	function f(n: number) {
		return n.toFixed(1);
	}

	type Terrain = ReturnType<typeof buildTerrain>;

	/**
	 * Walk between world-space waypoints the way a switchback does: altitude
	 * rises steadily from one stop to the next, and for each step across the
	 * slope the depth is solved so the ground there is exactly that high. The
	 * trail hugs the front of the mountain like a contour line instead of
	 * riding up over the ridge between two flanks.
	 */
	function walk(terrain: Terrain, waypoints: { x: number; z: number }[]): string {
		const { heightAt } = terrain;
		const onSlope = (x: number, target: number, fallback: number) => {
			// On flat ground, skirt the foot of the slope rather than climb it.
			const flat = target < 0.02;
			target = Math.max(target, 0.01);
			// A height this column of the mountain never reaches: walk straight.
			if (heightAt(x, SUMMIT.z) < target) return fallback;
			let lo = 0;
			let hi = SUMMIT.z;
			for (let n = 0; n < 14; n++) {
				const mid = (lo + hi) / 2;
				if (heightAt(x, mid) > target) hi = mid;
				else lo = mid;
			}
			const z = (lo + hi) / 2;
			return flat ? Math.min(z, fallback) : z;
		};
		const pts: Point[] = [];
		const STEPS = 16;
		for (let w = 0; w < waypoints.length - 1; w++) {
			const a = waypoints[w];
			const b = waypoints[w + 1];
			const ha = heightAt(a.x, a.z);
			const hb = heightAt(b.x, b.z);
			for (let s = 0; s < STEPS; s++) {
				const t = s / STEPS;
				const x = a.x + (b.x - a.x) * t;
				const h = ha + (hb - ha) * t;
				const z = onSlope(x, h, a.z + (b.z - a.z) * t);
				pts.push(terrain.project(x, z, heightAt(x, z)));
			}
		}
		const last = waypoints[waypoints.length - 1];
		pts.push(terrain.project(last.x, last.z, heightAt(last.x, last.z)));
		return smooth(pts);
	}

	// ---- Wide layout: one low-poly mountain, trail from camp to summit ----

	/** Marker size: the pin's tip sits exactly on its stop. */
	const PIN_W = 56;
	const PIN_H = 72;
	const GAP = 12;
	const SUMMIT_Y = 112;

	/** Pines on the flat outer edges, clear of the labels. [x, z, height px] */
	const TREES = [
		[-0.95, 0.42, 30],
		[-0.9, 0.3, 38],
		[-0.97, 0.18, 34],
		[-0.91, 0.08, 42],
		[0.93, 0.46, 30],
		[0.96, 0.32, 36],
		[0.92, 0.2, 40],
		[0.97, 0.07, 34]
	];
	/** Front right, past the first stop, so the opening leg never doubles back. */
	const CAMP = { x: 0.84, z: 0.035 };

	/**
	 * Drifting clouds. `top` is a share of the scene height, `rest` is where a
	 * cloud waits (in container widths) when motion is reduced. Back clouds are
	 * small and slow and pass behind the mountain; front ones are larger and
	 * faster and pass in front of it, which is what sells the depth.
	 */
	interface Cloud {
		top: number;
		w: number;
		dur: number;
		delay: number;
		rest: number;
	}
	const BACK: Cloud[] = [
		{ top: 0.16, w: 96, dur: 90, delay: -20, rest: 14 },
		{ top: 0.3, w: 76, dur: 110, delay: -75, rest: 66 }
	];
	const FRONT: Cloud[] = [
		{ top: 0.4, w: 150, dur: 60, delay: -38, rest: 80 },
		{ top: 0.62, w: 124, dur: 72, delay: -8, rest: 6 }
	];
	const SKY: Cloud[] = [
		{ top: 0.04, w: 64, dur: 46, delay: -12, rest: 52 },
		{ top: 0.3, w: 84, dur: 38, delay: -30, rest: 4 }
	];

	/**
	 * Run the drift only while the section is on screen, so a page with the
	 * clouds scrolled away costs nothing.
	 */
	function inView(node: HTMLElement) {
		if (typeof IntersectionObserver === 'undefined') return;
		const io = new IntersectionObserver(([entry]) =>
			node.classList.toggle('in-view', !!entry?.isIntersecting)
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}

	/** SSR has no width to measure; this is close to the widest content box. */
	let width = $state(1200);

	const wide = $derived.by(() => {
		const W = width;
		const n = items.length;
		const H = Math.max(460, 170 + n * 92);
		const labelW = W < 1000 ? 150 : 190;
		const terrain = buildTerrain({
			width: W,
			height: H,
			summitY: SUMMIT_Y,
			baseY: H - 58,
			depth: H * 0.16,
			thickness: 34,
			cols: 16,
			rows: 10
		});

		// Stops: k counts up from camp, so k = 0 is the oldest award. Each sits
		// on the slope, alternating sides, narrowing toward the summit.
		const reach = W / 2 - (PIN_W / 2 + GAP + labelW + 8);
		const stops = items.map((item, i) => {
			const k = n - 1 - i;
			const t = n > 1 ? k / (n - 1) : 1;
			const z = 0.1 + t * (SUMMIT.z - 0.1);
			let wx = SUMMIT.x;
			let left = (n - 2) % 2 === 0;
			if (i > 0) {
				left = k % 2 === 1;
				const maxX = Math.min(0.62, reach / terrain.scaleX(z));
				wx = (left ? -1 : 1) * Math.max(0.1, maxX * Math.pow(1 - t, 0.9));
			}
			const { x, y } = terrain.project(wx, z, terrain.heightAt(wx, z));
			return { item, i, x, y, left, wx, z };
		});

		// Trail runs camp → summit so it draws in as a climb.
		const route = [CAMP, ...[...stops].reverse().map(({ wx, z }) => ({ x: wx, z }))];
		const trail = walk(terrain, route);

		const trees = TREES.map(([x, z, h]) => {
			const p = terrain.project(x, z, terrain.heightAt(x, z));
			return pine(p.x, p.y, h);
		});
		const campAt = terrain.project(CAMP.x, CAMP.z);
		const camp = tent(campAt.x, campAt.y + 2, 1);

		return { H, terrain, stops, trail, trees, camp, labelW };
	});

	// ---- Narrow layout: a small summit up top, the trail runs down the list ----

	const ROW = 120;
	const LANE = PIN_W / 2;
	const HEAD_W = 220;
	const HEAD_H = 120;
	const HEAD = HEAD_H + 8;
	const FOOT = 56;

	const tall = $derived.by(() => {
		const n = items.length;
		const H = HEAD + ROW * n + FOOT;
		const hw = Math.min(HEAD_W, width);
		const terrain = buildTerrain({
			width: hw,
			height: HEAD_H,
			summitY: 28,
			baseY: HEAD_H - 20,
			depth: 18,
			thickness: 10,
			cols: 10,
			rows: 5
		});
		const peak = terrain.project(SUMMIT.x, SUMMIT.z, 1);

		// Down the mountain from the summit to its front-left corner, which
		// sits over the lane, then straight down through every pin.
		const foot = { x: (LANE - hw / 2) / terrain.scaleX(0), z: 0.02 };
		const slope = walk(terrain, [{ ...SUMMIT }, { x: foot.x * 0.45, z: 0.32 }, foot]);
		const tip = (i: number) => HEAD + ROW * i + (ROW + PIN_H) / 2;
		const pts: Point[] = [{ x: LANE, y: HEAD_H + 2 }];
		for (let i = 0; i < n; i++) {
			pts.push({ x: LANE + (i % 2 ? 10 : -10), y: tip(i) - ROW / 2 });
			pts.push({ x: LANE, y: tip(i) });
		}
		pts.push({ x: LANE, y: H - 18 });
		const down = smooth(pts);

		return { H, terrain, peak, slope, down, camp: tent(LANE, H - 12, 0.8) };
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
	<span
		class="disc {size}"
		class:on-dark={item.logoOnDark}
		class:wide={item.logoWide}
		class:fill={item.logoFill}
	>
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

{#snippet summary(item: Recognition)}
	<span class="summary">
		<span class="award">{item.award}</span>
		<span class="event">{item.event}</span>
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

{#snippet clouds(list: Cloud[], height: number)}
	<div class="clouds" aria-hidden="true">
		{#each list as c, k (k)}
			<svg
				class="cloud"
				viewBox="0 0 120 56"
				style:top="{c.top * height}px"
				style:width="{c.w}px"
				style:--dur="{c.dur}s"
				style:--delay="{c.delay}s"
				style:--rest="{c.rest}cqw"
			>
				{#each CLOUD as facet, j (j)}
					<path class="puff c{facet.tone}" d={facet.d} />
				{/each}
			</svg>
		{/each}
	</div>
{/snippet}

{#snippet slab(terrain: Terrain)}
	<path class="slab" d={terrain.skirt} />
	{#each terrain.facets as facet, k (k)}
		<path class="facet t{facet.tone}" d={facet.d} />
	{/each}
	<path class="rim" d={terrain.rim} />
{/snippet}

<div class="hike" bind:clientWidth={width} use:reveal use:inView>
	<!-- Wide: one low-poly mountain, camp to summit -->
	<div class="scene" style:height="{wide.H}px" style:--label-w="{wide.labelW}px">
		{@render clouds(BACK, wide.H)}
		<svg class="land" width="100%" height={wide.H} aria-hidden="true">
			{@render slab(wide.terrain)}
			{#each wide.trees as tree, k (k)}
				<path class="tree-lit" d={tree.lit} />
				<path class="tree-dark" d={tree.dark} />
			{/each}
			<path class="tent-lit" d={wide.camp.lit} />
			<path class="tent-dark" d={wide.camp.dark} />
			<path class="tent-door" d={wide.camp.door} />
			{@render trailPath(wide.trail, `${uid}-wide`)}
		</svg>
		{@render clouds(FRONT, wide.H)}
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
						{@render summary(item)}
					</button>
				</li>
			{/each}
		</ol>
	</div>

	<!-- Narrow: a small summit, then the same trail straight down -->
	<div class="track" style:height="{tall.H}px">
		<div class="sky" style:height="{HEAD_H}px">{@render clouds(SKY, HEAD_H)}</div>
		<svg class="land" width="100%" height={tall.H} aria-hidden="true">
			{@render slab(tall.terrain)}
			<path class="flag-pole" d="M{f(tall.peak.x)} {f(tall.peak.y)} v-20" />
			<path class="flag" d="M{f(tall.peak.x)} {f(tall.peak.y - 20)} l13 4.5 l-13 4.5 Z" />
			<path class="tent-lit" d={tall.camp.lit} />
			<path class="tent-dark" d={tall.camp.dark} />
			<path class="tent-door" d={tall.camp.door} />
			{@render trailPath(tall.slope, `${uid}-slope`)}
			{@render trailPath(tall.down, `${uid}-down`)}
		</svg>
		<ol style:padding-top="{HEAD}px">
			{#each items as item, i (item.id)}
				<li class="row" style:height="{ROW}px" style:--order={i}>
					<button type="button" class="pin" aria-haspopup="dialog" onclick={(e) => show(i, e)}>
						{@render marker(item)}
						{@render summary(item)}
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
					<p class="awards">
						<span class="award">{open.award}</span>
						{#each open.alsoAwarded ?? [] as extra (extra)}
							<span class="award">{extra}</span>
						{/each}
					</p>
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

	/* ---- Landscape: low-poly facets in theme ink, lit (t0) to shaded (t6) ---- */
	.land {
		position: absolute;
		top: 0;
		left: 0;
		overflow: visible;
		pointer-events: none;
	}
	/* Each facet is stroked in its own fill so neighbours meet without seams. */
	.facet {
		fill: var(--tone);
		stroke: var(--tone);
		stroke-width: 0.75;
		stroke-linejoin: round;
	}
	.t0 {
		--tone: color-mix(in srgb, var(--color-text-primary) 4%, var(--color-surface));
	}
	.t1 {
		--tone: color-mix(in srgb, var(--color-text-primary) 7%, var(--color-surface));
	}
	.t2 {
		--tone: color-mix(in srgb, var(--color-text-primary) 10%, var(--color-surface));
	}
	.t3 {
		--tone: color-mix(in srgb, var(--color-text-primary) 14%, var(--color-surface));
	}
	.t4 {
		--tone: color-mix(in srgb, var(--color-text-primary) 18%, var(--color-surface));
	}
	.t5 {
		--tone: color-mix(in srgb, var(--color-text-primary) 23%, var(--color-surface));
	}
	.t6 {
		--tone: color-mix(in srgb, var(--color-text-primary) 29%, var(--color-surface));
	}
	/* the diorama's cut front face */
	.slab {
		fill: color-mix(in srgb, var(--color-text-primary) 30%, var(--color-surface));
	}
	.rim {
		fill: none;
		stroke: var(--color-border-hover);
		stroke-width: 1;
	}
	.tree-lit {
		fill: color-mix(in srgb, var(--color-text-primary) 24%, var(--color-surface));
	}
	.tree-dark {
		fill: color-mix(in srgb, var(--color-text-primary) 38%, var(--color-surface));
	}
	.tent-lit {
		fill: color-mix(in srgb, var(--color-text-primary) 16%, var(--color-surface));
	}
	.tent-dark {
		fill: color-mix(in srgb, var(--color-text-primary) 30%, var(--color-surface));
	}
	.tent-door {
		fill: color-mix(in srgb, var(--color-text-primary) 55%, var(--color-surface));
	}
	.flag-pole {
		fill: none;
		stroke: var(--color-text-secondary);
		stroke-width: 1.25;
		stroke-linecap: round;
	}
	.flag {
		fill: var(--color-accent);
	}

	/* ---- Clouds: faceted puffs drifting across, transform-only so they stay
	   on the compositor; paused whenever the section is off screen ---- */
	.clouds {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.sky {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}
	.cloud {
		position: absolute;
		left: 0;
		height: auto;
		overflow: visible;
		will-change: transform;
		animation: drift var(--dur) linear var(--delay) infinite;
		animation-play-state: paused;
	}
	:global(.hike.in-view) .cloud {
		animation-play-state: running;
	}
	/* On a near-black page, mixing in ink lifts a tone toward white, so the
	   lit side has to carry the most ink for the cloud to read the right way up. */
	:global(.dark) .c0 {
		--tone: color-mix(in srgb, var(--color-text-primary) 30%, var(--color-surface));
	}
	:global(.dark) .c1 {
		--tone: color-mix(in srgb, var(--color-text-primary) 25%, var(--color-surface));
	}
	:global(.dark) .c2 {
		--tone: color-mix(in srgb, var(--color-text-primary) 20%, var(--color-surface));
	}
	:global(.dark) .c3 {
		--tone: color-mix(in srgb, var(--color-text-primary) 15%, var(--color-surface));
	}
	:global(.dark) .c4 {
		--tone: color-mix(in srgb, var(--color-text-primary) 10%, var(--color-surface));
	}
	@keyframes drift {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100cqw);
		}
	}
	.puff {
		fill: var(--tone);
		stroke: var(--tone);
		stroke-width: 0.6;
		stroke-linejoin: round;
	}
	.c0 {
		--tone: color-mix(in srgb, var(--color-text-primary) 2%, var(--color-surface));
	}
	.c1 {
		--tone: color-mix(in srgb, var(--color-text-primary) 6%, var(--color-surface));
	}
	.c2 {
		--tone: color-mix(in srgb, var(--color-text-primary) 11%, var(--color-surface));
	}
	.c3 {
		--tone: color-mix(in srgb, var(--color-text-primary) 16%, var(--color-surface));
	}
	.c4 {
		--tone: color-mix(in srgb, var(--color-text-primary) 23%, var(--color-surface));
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
	/* a wordmark inside a circle: wide and short still clears the rim */
	.disc.wide img {
		width: 92%;
		height: 92%;
	}
	.disc.fill img {
		width: 100%;
		height: 100%;
		object-fit: cover;
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
	/* Every placement reads the same: no colour ranking, just firmer type. */
	.award {
		font: 600 11px/1.4 var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-primary);
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
		width: calc(56px + 12px + var(--label-w, 190px));
	}
	/* Pins on the left flank read outward: label first, marker on the trail. */
	.stop.left .pin {
		left: auto;
		right: -28px;
		flex-direction: row-reverse;
		text-align: right;
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

	@container (min-width: 760px) {
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
	.awards {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.sheet-head .award {
		display: inline-block;
		padding: 3px 8px;
		border: 1px solid var(--color-text-primary);
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
		.cloud {
			animation: none;
			transform: translateX(var(--rest));
		}
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
