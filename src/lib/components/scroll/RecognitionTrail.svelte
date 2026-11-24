<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import { lockScroll } from '$lib/scroll';
	import { formatMonthLong, type Recognition } from '$lib/data/recognitions';
	import {
		buildTerrain,
		pine,
		tent,
		ridge,
		contours,
		SUMMIT,
		SHEET_PEAK_H,
		CLOUD,
		type Point
	} from '$lib/terrain';

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

	/** Marker width: the pin (72px tall) sits with its tip exactly on its stop. */
	const PIN_W = 56;
	const GAP = 12;
	const SUMMIT_Y = 100;

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
	/** Narrow layout: tops are in px (rendered with a height of 1). */
	const SKY_BACK: Cloud[] = [
		{ top: 36, w: 72, dur: 52, delay: -12, rest: 62 },
		{ top: 320, w: 60, dur: 66, delay: -44, rest: 72 }
	];
	const SKY_FRONT: Cloud[] = [
		{ top: 170, w: 100, dur: 40, delay: -24, rest: 64 },
		{ top: 560, w: 88, dur: 48, delay: -6, rest: 76 }
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

	// ---- Narrow layout: a tall mountain; the trail zigzags up its face ----

	/** Vertical distance between stops: a pin plus up to three lines of label. */
	const STEP = 132;
	/** The summit stop's y, leaving room for its pin above. */
	const TOP = 100;
	/** Below the oldest stop: camp, trees and the slab's edge. */
	const BASE = 104;
	/** The narrowest a label is allowed to get. */
	const MIN_LABEL = 150;

	const tall = $derived.by(() => {
		const W = width;
		const n = items.length;
		const H = TOP + Math.max(0, n - 1) * STEP + BASE;

		// The trail swings between a left and a right lane. Every label reads to
		// the right of its pin, so the right lane ends where a label still fits.
		const xL = 34;
		const xR = Math.max(xL + 64, Math.min(W * 0.45, W - (PIN_W / 2 + GAP + MIN_LABEL)));
		const peakX = (xL + xR) / 2;
		const terrain = buildTerrain({
			width: W,
			height: H,
			summitY: TOP,
			baseY: H - 36,
			depth: 44,
			thickness: 16,
			cols: 12,
			rows: 10,
			centerX: peakX,
			spread: (W - peakX) / (0.8 * W)
		});

		// Newest at the summit; each older stop a step lower, alternating lanes,
		// the swing widening as the mountain does.
		const half = (xR - xL) / 2;
		const stops = items.map((item, i) => {
			const t = n > 1 ? i / (n - 1) : 0;
			const side = i === 0 ? 0 : i % 2 ? -1 : 1;
			const x = peakX + side * half * (0.45 + 0.55 * t);
			const y = TOP + i * STEP;
			return { item, i, x, y, pinW: W - x + PIN_W / 2 };
		});

		// Camp sits just past the oldest stop; the trail climbs from there.
		const campAt = { x: Math.min(W - 36, xR + 56), y: H - 34 };
		const trail = smooth([campAt, ...[...stops].reverse().map(({ x, y }) => ({ x, y }))]);
		const trees = [
			[16, H - 40, 30],
			[38, H - 34, 24],
			[W - 18, H - 44, 32],
			[W - 64, H - 38, 22]
		].map(([x, y, h]) => pine(x, y, h));

		return { H, terrain, stops, trail, trees, camp: tent(campAt.x, campAt.y, 0.85) };
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

	/**
	 * A click that lands on the dialog itself, or on the open sky above the
	 * ridge (marked data-backdrop), is the backdrop.
	 */
	function onDialogClick(event: MouseEvent) {
		const target = event.target as Element | null;
		if (target === dialog || target?.hasAttribute?.('data-backdrop')) dialog?.close();
	}

	// ---- Sheet: a summit-shaped card ----

	/** Header height: sky for the flag, the ridge, and its foot. */
	let viewportH = $state(900);
	/** Short screens (a laptop with browser chrome) get a lower ridge and tighter spacing. */
	const compact = $derived(viewportH < 760);
	const PEAK_H = $derived(compact ? 116 : SHEET_PEAK_H);
	/** Contour map drawing box; it is scaled to cover whatever the frame is. */
	const TOPO_W = 640;
	const TOPO_H = 400;

	let sheetW = $state(640);
	const peak = $derived(ridge(Math.max(280, sheetW), PEAK_H));
	/** Flag pole height: what the sky above the summit allows. */
	const FLAG = $derived(Math.min(26, peak.summit.y - 3));

	const topo = $derived(current === null ? null : contours(TOPO_W, TOPO_H, current + 1));

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

	<!-- Narrow: a tall mountain, the trail zigzags up its face -->
	<div class="track" style:height="{tall.H}px">
		{@render clouds(SKY_BACK, 1)}
		<svg class="land" width="100%" height={tall.H} aria-hidden="true">
			{@render slab(tall.terrain)}
			{#each tall.trees as tree, k (k)}
				<path class="tree-lit" d={tree.lit} />
				<path class="tree-dark" d={tree.dark} />
			{/each}
			<path class="tent-lit" d={tall.camp.lit} />
			<path class="tent-dark" d={tall.camp.dark} />
			<path class="tent-door" d={tall.camp.door} />
			{@render trailPath(tall.trail, `${uid}-tall`)}
		</svg>
		{@render clouds(SKY_FRONT, 1)}
		<ol>
			{#each tall.stops as { item, i, x, y, pinW } (item.id)}
				<li
					class="stop"
					style:left="{x}px"
					style:top="{y}px"
					style:--order={items.length - 1 - i}
					style:--pin-w="{pinW}px"
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
</div>

<svelte:window bind:innerHeight={viewportH} />

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
		<!--
		  Every stop fills the same skeleton, top to bottom: summit header,
		  plaque, a three-waypoint trail log, story, a fixed photo frame, and a
		  footer. Missing fields keep their slot (a dash, a contour map, an empty
		  link cell) so the sheet never reflows between stops.
		-->
		<div class="sheet-inner" class:compact bind:clientWidth={sheetW} style:--peak-h="{PEAK_H}px">
			<header class="peak" data-backdrop>
				<svg
					class="ridge"
					width="100%"
					height={PEAK_H}
					viewBox="0 0 {Math.max(280, sheetW)} {PEAK_H}"
					aria-hidden="true"
					data-backdrop
				>
					<defs>
						<linearGradient id="{uid}-foot" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" class="foot-stop" stop-opacity="0" />
							<stop offset="1" class="foot-stop" stop-opacity="1" />
						</linearGradient>
					</defs>
					{#each peak.facets as facet, k (k)}
						<path class="facet t{facet.tone}" d={facet.d} />
					{/each}
					<!-- the foot melts into the body, so there is no seam -->
					<rect x="0" y={PEAK_H - 44} width="100%" height="44" fill="url(#{uid}-foot)" />
					<path class="ridge-line" d={peak.outline} />
					<path class="flag-pole" d="M{peak.summit.x} {peak.summit.y}V{peak.summit.y - FLAG}" />
					<path class="flag" d="M{peak.summit.x} {peak.summit.y - FLAG}l15 5.5l-15 5.5z" />
				</svg>
				<div class="sheet-bar">
					<span class="count">{pad(current + 1)} / {pad(items.length)}</span>
					<button type="button" class="close" onclick={() => dialog?.close()}>
						<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
						<span class="sr-only">Close</span>
					</button>
				</div>
				<div class="summit-disc">{@render disc(open, 'lg')}</div>
			</header>

			<div class="sheet-body">
				<div class="plaque">
					<p class="awards">
						<span class="award">{open.award}</span>
						{#each open.alsoAwarded ?? [] as extra (extra)}
							<span class="award">{extra}</span>
						{/each}
					</p>
					<h3 id="rec-sheet-title">{open.event}</h3>
					<p class="by">{open.organizer}</p>
				</div>

				<div class="story">
					<div class="notes">
						<dl class="log">
							<div class="date">
								<dt>Date</dt>
								<dd><time datetime={open.date}>{formatMonthLong(open.date)}</time></dd>
							</div>
							<div class="venue">
								<dt>Venue</dt>
								<dd>{open.venue}</dd>
							</div>
							<div class="project">
								<dt>Project</dt>
								<dd class:none={!open.project}>
									{#if open.project}{open.project}{:else}<span aria-hidden="true">—</span><span
											class="sr-only">None</span
										>{/if}
								</dd>
							</div>
						</dl>

						<p class="desc">{open.description}</p>
					</div>

					<figure
						class="art"
						class:natural={open.image?.keepRatio}
						style:--ratio={open.image ? open.image.width / open.image.height : null}
					>
						{#if open.image}
							<img
								class="art-shot"
								style:--focus={open.image.focus}
								src={asset(open.image.src)}
								alt={open.image.alt}
								width={open.image.width}
								height={open.image.height}
								loading="lazy"
								decoding="async"
							/>
						{:else if topo}
							<svg
								class="topo"
								viewBox="0 0 {TOPO_W} {TOPO_H}"
								preserveAspectRatio="xMidYMid slice"
								aria-hidden="true"
							>
								{#each topo.rings as d, k (k)}
									<path class="ring" class:index={k % 4 === 3} {d} />
								{/each}
								<path class="topo-peak" d="M{topo.peak.x} {topo.peak.y - 7}l7 12h-14z" />
							</svg>
							<figcaption>NO PHOTO FROM THIS STOP</figcaption>
						{/if}
					</figure>
				</div>
			</div>

			<footer class="sheet-nav">
				<button type="button" disabled={current === 0} onclick={() => step(-1)}>
					<span aria-hidden="true">←</span> PREVIOUS
				</button>
				{#if open.url}
					<a class="out" href={open.url} target="_blank" rel="noopener noreferrer"
						><span class="long">VIEW ON {host(open.url).toUpperCase()}</span><span class="short"
							>SOURCE</span
						> <span aria-hidden="true">↗</span></a
					>
				{:else}
					<!-- empty middle cell keeps next on the right -->
					<span aria-hidden="true"></span>
				{/if}
				<button type="button" disabled={current === items.length - 1} onclick={() => step(1)}>
					NEXT <span aria-hidden="true">→</span>
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
	/* Every label reads to the right; it gets whatever width is left. */
	.track .pin {
		position: absolute;
		top: -72px;
		left: -28px;
		width: var(--pin-w);
	}
	.track .event {
		-webkit-line-clamp: 3;
		line-clamp: 3;
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
	.stop {
		opacity: 0;
		transform: translateY(-8px);
		transition:
			opacity 0.45s ease calc(0.3s + var(--order) * 0.22s),
			transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) calc(0.3s + var(--order) * 0.22s);
	}
	:global(.hike.is-visible) .stop {
		opacity: 1;
		transform: none;
	}

	/* ---- Dialog: a summit-shaped sheet ----
	   The dialog box itself is invisible; the ridge header draws the top of the
	   shape and the body continues its outline down to a diorama-style slab.
	   The sheet has a fixed height that fits the viewport, so every stop reads
	   without scrolling: the photo frame takes whatever height is left. */
	.sheet {
		width: min(720px, calc(100vw - 32px));
		height: min(880px, calc(100dvh - 32px));
		max-height: none;
		margin: auto;
		padding: 0;
		/* only a last resort on very short screens */
		overflow-y: auto;
		overscroll-behavior: contain;
		/* a gutter would cut into the ridge; wheel, touch and keys still scroll */
		scrollbar-width: none;
		border: 0;
		background: transparent;
		color: var(--color-text-primary);
	}
	/* The browser rings the focused dialog box, which would draw the very
	   rectangle the ridge replaces; focus moves on to the controls inside. */
	.sheet:focus,
	.sheet:focus-visible {
		outline: none;
	}
	.sheet::-webkit-scrollbar {
		display: none;
	}
	.sheet::backdrop {
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(3px);
	}
	.sheet[open] {
		animation: sheet-in 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}
	.sheet-inner {
		--pad: 18px;
		--side: 1px solid var(--color-border-hover);
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		container-type: inline-size;
	}

	/* Header: sky, ridge, flag; the organizer's disc sits under the summit. */
	.peak {
		position: relative;
		flex: none;
		height: var(--peak-h);
	}
	.ridge {
		display: block;
		overflow: visible;
	}
	.foot-stop {
		stop-color: var(--color-surface);
	}
	.ridge-line {
		fill: none;
		stroke: var(--color-border-hover);
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.flag {
		transform-box: fill-box;
		transform-origin: left center;
		animation: flag-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
	}
	@keyframes flag-in {
		from {
			transform: scaleX(0);
		}
	}
	.sheet-bar {
		position: absolute;
		right: 0;
		bottom: 10px;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 14px 0 18px;
	}
	.count {
		font: 11px var(--font-mono);
		letter-spacing: 0.12em;
		color: var(--color-accent);
	}
	/* a bare X; the 34px box is only the tap target */
	.close {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color 0.2s;
	}
	.close svg {
		width: 15px;
		height: 15px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
	}
	.close:hover {
		color: var(--color-accent);
	}
	.summit-disc {
		position: absolute;
		/* centred below the summit; the lower edge breaks into the body */
		top: 64px;
		left: 50%;
		transform: translateX(-50%);
	}
	.disc.lg {
		width: 84px;
		height: 84px;
		box-shadow:
			0 0 0 1px var(--color-border-hover),
			0 0 0 5px var(--color-surface),
			0 0 0 6px var(--color-border-hover);
	}

	/* Body: the mountain's interior, edged in the same line as the ridge. */
	.sheet-body,
	.sheet-nav {
		border-right: var(--side);
		border-left: var(--side);
		background: var(--color-surface);
	}
	.sheet-body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		min-height: 0;
		padding: 22px var(--pad) 16px;
	}
	.plaque {
		flex: none;
		text-align: center;
	}
	.awards {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.plaque .award {
		display: inline-block;
		padding: 3px 8px;
		border: 1px solid var(--color-text-primary);
	}
	.plaque h3 {
		margin: 10px auto 4px;
		max-width: 32ch;
		font-size: 19px;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	.by {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	/* Story: two rows of text (the trail log, then the description) with the
	   photo filling the space below them, at every width. */
	.story {
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		gap: 16px;
		min-height: 0;
		margin-top: 18px;
	}
	.notes {
		display: contents;
	}

	/* Trail log: always three waypoints on one dashed route. */
	.log {
		position: relative;
		display: grid;
		flex: none;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin: 0;
		text-align: center;
	}
	.log::before {
		content: '';
		position: absolute;
		top: 15px;
		right: calc(100% / 6);
		left: calc(100% / 6);
		border-top: 2px dashed color-mix(in srgb, var(--color-accent) 70%, transparent);
	}
	.log div {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 6px;
	}
	/* Waypoint: a ringed marker on the route (::before) with an icon for what
	   it records (::after): a calendar, a map pin, a light bulb. The icons are
	   masks, so they take the accent colour in either theme. */
	.log div::before {
		content: '';
		box-sizing: border-box;
		width: 32px;
		height: 32px;
		margin-bottom: 8px;
		border: 1.5px solid var(--color-accent);
		border-radius: 50%;
		background: var(--color-surface);
	}
	.log div::after {
		content: '';
		position: absolute;
		top: 8px;
		left: 50%;
		width: 16px;
		height: 16px;
		background: var(--color-accent);
		transform: translateX(-50%);
		mask: var(--icon) center / contain no-repeat;
	}
	.log .date {
		--icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='5' width='18' height='16' rx='2'/%3E%3Cpath d='M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 17.5h2'/%3E%3C/svg%3E");
	}
	.log .venue {
		--icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 21.5s-7-6.1-7-11.8a7 7 0 0 1 14 0c0 5.7-7 11.8-7 11.8z'/%3E%3Ccircle cx='12' cy='9.7' r='2.6'/%3E%3C/svg%3E");
	}
	.log .project {
		--icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9.5 18h5M10.5 21.5h3M12 2.5a6.5 6.5 0 0 0-3.9 11.7c.8.6 1.3 1.5 1.4 2.3h5c.1-.8.6-1.7 1.4-2.3A6.5 6.5 0 0 0 12 2.5z'/%3E%3C/svg%3E");
	}
	.log dt {
		font: 9px var(--font-mono);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	/* two lines reserved, so a long venue never shifts what follows */
	.log dd {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		min-height: calc(2 * 1.35em);
		margin: 3px 0 0;
		font-size: 13px;
		line-height: 1.35;
		color: var(--color-text-primary);
	}
	.log dd.none {
		color: var(--color-text-muted);
	}
	.desc {
		flex: none;
		margin: 0;
		font-size: 13.5px;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	/* Photo frame: fills the space left, the same for every stop. A photo of
	   any other proportion is cropped to cover it, centred on its focus point;
	   without a photo, a contour map holds the space. */
	.art {
		position: relative;
		flex: 1 1 0;
		min-height: 90px;
		overflow: hidden;
		margin: 0;
		border: 1px solid var(--color-border);
		background: var(--color-surface-alt);
	}
	.art-shot {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--focus, 50% 50%);
		/* some artwork has a transparent header with dark marks: keep them legible */
		background: #e6e6e6;
	}
	.topo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.ring {
		fill: none;
		stroke: var(--color-border-hover);
		stroke-width: 1;
	}
	.ring.index {
		stroke: color-mix(in srgb, var(--color-text-primary) 30%, var(--color-surface));
		stroke-width: 1.5;
	}
	.topo-peak {
		fill: var(--color-accent);
	}
	.art figcaption {
		position: absolute;
		bottom: 10px;
		left: 12px;
		font: 9px var(--font-mono);
		letter-spacing: 0.16em;
		color: var(--color-text-muted);
	}

	/* Footer: previous, the source link (or its absence), next. The thick
	   base is the cut face of the slab, as on the trail's diorama. */
	.sheet-nav {
		display: grid;
		flex: none;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 12px;
		padding: 12px var(--pad) 14px;
		border-bottom: 10px solid
			color-mix(in srgb, var(--color-text-primary) 30%, var(--color-surface));
	}
	.sheet-nav button {
		justify-self: start;
		padding: 6px 0;
		border: 0;
		background: none;
		font: 11px var(--font-mono);
		letter-spacing: 0.14em;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color 0.2s;
	}
	.sheet-nav button:last-child {
		justify-self: end;
	}
	.sheet-nav button:hover:not(:disabled) {
		color: var(--color-accent);
	}
	.close:focus-visible,
	.sheet-nav button:focus-visible,
	.out:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
	}
	.out {
		font: 11px var(--font-mono);
		letter-spacing: 0.08em;
		color: var(--color-accent);
		text-align: center;
		text-underline-offset: 4px;
	}
	a.out:hover {
		text-decoration: underline;
	}
	/* phones get the short label so the footer stays on one line */
	.out .long {
		display: none;
	}
	.sheet-nav button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	/* Short screens: a lower ridge, a smaller disc and tighter spacing, so
	   the photo keeps a useful height without the sheet scrolling. */
	.compact .summit-disc {
		top: 50px;
	}
	.compact .disc.lg {
		width: 66px;
		height: 66px;
	}
	.compact .sheet-body {
		padding-top: 18px;
		padding-bottom: 12px;
	}
	.compact .plaque h3 {
		margin-top: 8px;
	}
	.compact .story {
		gap: 12px;
		margin-top: 14px;
	}
	.compact .log dd {
		-webkit-line-clamp: 1;
		line-clamp: 1;
		min-height: 1.35em;
	}
	.compact .art {
		min-height: 90px;
	}
	.compact .sheet-nav {
		padding-top: 8px;
		padding-bottom: 10px;
	}

	@container (min-width: 600px) {
		.sheet-inner {
			--pad: 28px;
		}
		.plaque h3 {
			font-size: 22px;
		}
		.story {
			gap: 18px;
			margin-top: 22px;
		}
		.desc {
			font-size: 14px;
			line-height: 1.7;
		}
		.out .long {
			display: inline;
		}
		.out .short {
			display: none;
		}
	}

	/* Web: the photo gets a full-width 16:10 frame instead of the leftover
	   space, so it always shows at a proper size. The sheet grows to fit and
	   scrolls a little on shorter screens. */
	@media (min-width: 700px) {
		.sheet {
			height: auto;
			max-height: calc(100dvh - 32px);
		}
		.sheet-inner {
			height: auto;
		}
		.story {
			flex: none;
		}
		.art,
		.compact .art {
			flex: none;
			min-height: 0;
			aspect-ratio: 16 / 10;
		}
	}

	/* Artwork that must not be cropped. On the web the frame takes its own
	   proportions; on phones the frame keeps flexing to fit the screen and the
	   artwork is fitted whole inside it. */
	@media (max-width: 699px) {
		.art.natural .art-shot {
			object-fit: contain;
		}
	}
	@media (min-width: 700px) {
		.art.natural {
			flex: none;
			min-height: 0;
			aspect-ratio: var(--ratio);
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
		.marker,
		.marker path {
			transition: none;
		}
		.stop {
			opacity: 1;
			transform: none;
		}
		.sheet[open],
		.flag {
			animation: none;
		}
	}
</style>
