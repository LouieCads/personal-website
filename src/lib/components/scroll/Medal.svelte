<script lang="ts">
	/**
	 * An award medal: a bevelled disc with a laurel wreath on its face and two
	 * notched ribbon tails crossing below it. The metal is monochrome silver
	 * (graphite in dark mode) and the ribbons wear the accent, so the piece
	 * stays inside the site's palette. The issuer's logo sits on a light disc
	 * at the centre so every brand keeps its colours.
	 */
	interface Props {
		logo?: string;
		issuer: string;
	}
	let { logo, issuer }: Props = $props();

	/** Gradient and clip ids must be unique per medal on the page. */
	const uid = $props.id();

	const C = 100;
	/** Wreath radius on the face. */
	const W = 62;
	/** Leaf pointing along +x from its base: a pointed oval. */
	const LEAF = 'M0 0 Q5.4 -4.4 12.5 0 Q5.4 4.4 0 0 Z';
	const STEPS = 9;
	const FIRST = 104;
	const STEP = 14;

	interface Leaf {
		x: number;
		y: number;
		rotate: number;
	}

	/**
	 * One branch climbs from the bottom gap toward the crown. `dir` is +1 for
	 * the left branch (angle grows from 104° toward 216°) and -1 for the
	 * right, which mirrors it. Each step carries a leaf on the outside and one
	 * on the inside of the stem, tilted toward the direction of growth.
	 */
	function branch(dir: 1 | -1): Leaf[] {
		const leaves: Leaf[] = [];
		for (let i = 0; i < STEPS; i++) {
			const deg = 90 + dir * (FIRST - 90 + i * STEP);
			const rad = (deg * Math.PI) / 180;
			const growth = deg + dir * 90;
			for (const side of [1, -1]) {
				const r = W + side * 1.2;
				leaves.push({
					x: C + r * Math.cos(rad),
					y: C + r * Math.sin(rad),
					rotate: growth - dir * side * 36
				});
			}
		}
		return leaves;
	}

	const leaves = [...branch(1), ...branch(-1)];

	/** Stem arcs, bottom gap to the last leaf pair. */
	function stem(dir: 1 | -1): string {
		const point = (deg: number) => {
			const rad = (deg * Math.PI) / 180;
			return `${(C + W * Math.cos(rad)).toFixed(2)} ${(C + W * Math.sin(rad)).toFixed(2)}`;
		};
		const from = 90 + dir * 8;
		const to = 90 + dir * (FIRST - 90 + (STEPS - 1) * STEP);
		return `M${point(from)} A${W} ${W} 0 0 ${dir === 1 ? 1 : 0} ${point(to)}`;
	}

	/**
	 * A ribbon tail drawn upright from its top edge, 64 wide, with a V cut
	 * out of the end. It is rotated into place, so its gradient follows it.
	 */
	const TAIL_W = 32;
	const TAIL_L = 142;
	const NOTCH = 22;
	const TAIL = `M${-TAIL_W} 0 H${TAIL_W} V${TAIL_L} L0 ${TAIL_L - NOTCH} L${-TAIL_W} ${TAIL_L} Z`;
	/** Edge stripes stop where they meet the notch. */
	const STRIPE_X = 26;
	const STRIPE_END = TAIL_L - (NOTCH * (TAIL_W - STRIPE_X)) / TAIL_W;

	const initials = $derived(
		issuer
			.split(/\s+/)
			.map((word) => word[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);
</script>

{#snippet tail(x: number, angle: number)}
	<g class="tail" transform={`translate(${x} 146) rotate(${angle})`}>
		<path class="tail-body" d={TAIL} fill={`url(#${uid}-ribbon)`} />
		<path class="tail-stripe" d={`M${-STRIPE_X} 0 V${STRIPE_END}`} />
		<path class="tail-stripe" d={`M${STRIPE_X} 0 V${STRIPE_END}`} />
	</g>
{/snippet}

<span class="medal">
	<svg viewBox="0 0 200 296" aria-hidden="true">
		<defs>
			<linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" class="stop-hi" />
				<stop offset="0.45" class="stop-mid" />
				<stop offset="1" class="stop-lo" />
			</linearGradient>
			<linearGradient id={`${uid}-bevel`} x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" class="stop-lo" />
				<stop offset="1" class="stop-hi" />
			</linearGradient>
			<radialGradient id={`${uid}-face`} cx="0.38" cy="0.32" r="0.8">
				<stop offset="0" class="stop-hi" />
				<stop offset="0.6" class="stop-mid" />
				<stop offset="1" class="stop-mid" />
			</radialGradient>
			<linearGradient id={`${uid}-ribbon`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" class="stop-ribbon-deep" />
				<stop offset="0.45" class="stop-ribbon" />
				<stop offset="1" class="stop-ribbon" />
			</linearGradient>
			<linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" class="stop-sheen" stop-opacity="0" />
				<stop offset="0.5" class="stop-sheen" />
				<stop offset="1" class="stop-sheen" stop-opacity="0" />
			</linearGradient>
			<clipPath id={`${uid}-disc`}>
				<circle cx={C} cy={C} r="96" />
			</clipPath>
			<clipPath id={`${uid}-logo`}>
				<circle cx={C} cy={C} r="47" />
			</clipPath>
		</defs>

		<!-- ribbons hang behind the disc; the right-hand tail crosses in front -->
		{@render tail(88, 20)}
		{@render tail(112, -20)}

		<!-- outer rim, sunken bevel, then the face -->
		<circle class="rim" cx={C} cy={C} r="96" fill={`url(#${uid}-rim)`} />
		<circle class="rim-line" cx={C} cy={C} r="92.5" />
		<circle cx={C} cy={C} r="84" fill={`url(#${uid}-bevel)`} />
		<circle class="face" cx={C} cy={C} r="80" fill={`url(#${uid}-face)`} />

		<g class="wreath">
			<path d={stem(1)} />
			<path d={stem(-1)} />
			{#each leaves as leaf, i (i)}
				<path
					class="leaf"
					d={LEAF}
					transform={`translate(${leaf.x.toFixed(2)} ${leaf.y.toFixed(2)}) rotate(${leaf.rotate.toFixed(1)})`}
				/>
			{/each}
		</g>

		<circle class="plate" cx={C} cy={C} r="47" />
		{#if logo}
			<image
				href={logo}
				x={C - 36}
				y={C - 36}
				width="72"
				height="72"
				preserveAspectRatio="xMidYMid meet"
				clip-path={`url(#${uid}-logo)`}
			/>
		{:else}
			<text class="initials" x={C} y={C} text-anchor="middle" dominant-baseline="central"
				>{initials}</text
			>
		{/if}

		<!-- a light band that sweeps across the disc on hover -->
		<g clip-path={`url(#${uid}-disc)`}>
			<rect
				class="sheen"
				x="-70"
				y="-20"
				width="60"
				height="240"
				fill={`url(#${uid}-sheen)`}
				transform="rotate(20 100 100)"
			/>
		</g>
	</svg>
</span>

<style>
	.medal {
		/* silver in light mode */
		--metal-hi: #ffffff;
		--metal-mid: #e2e2e2;
		--metal-lo: #9c9c9c;
		--metal-line: var(--color-border-hover);
		--sheen: rgba(255, 255, 255, 0.85);
		--ribbon: var(--color-accent);
		--ribbon-deep: color-mix(in srgb, var(--color-accent) 50%, #000);
		position: relative;
		display: block;
		width: 200px;
		aspect-ratio: 200 / 296;
		color: var(--color-text-secondary);
		transition:
			color 0.3s,
			transform 0.3s;
	}
	/* graphite in dark mode */
	:global(.dark) .medal {
		--metal-hi: #3a3a3a;
		--metal-mid: #171717;
		--metal-lo: #070707;
		--metal-line: #2e2e2e;
		--sheen: rgba(255, 255, 255, 0.12);
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.stop-hi {
		stop-color: var(--metal-hi);
	}
	.stop-mid {
		stop-color: var(--metal-mid);
	}
	.stop-lo {
		stop-color: var(--metal-lo);
	}
	.stop-ribbon {
		stop-color: var(--ribbon);
	}
	.stop-ribbon-deep {
		stop-color: var(--ribbon-deep);
	}
	.stop-sheen {
		stop-color: var(--sheen);
	}
	.tail-body {
		stroke: var(--ribbon-deep);
		stroke-width: 1;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}
	.tail-stripe {
		fill: none;
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
	}
	.rim {
		stroke: var(--metal-line);
		stroke-width: 1;
	}
	.rim-line {
		fill: none;
		stroke: var(--metal-hi);
		stroke-opacity: 0.8;
		stroke-width: 1;
	}
	.face {
		stroke: var(--metal-line);
		stroke-width: 1;
	}
	.wreath path {
		fill: none;
		stroke: currentColor;
		stroke-width: 1;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		transition: stroke 0.3s;
	}
	.wreath .leaf {
		fill: currentColor;
		fill-opacity: 0.22;
	}
	.plate {
		fill: #fff;
		stroke: var(--metal-line);
		stroke-width: 1;
	}
	.initials {
		font: 20px var(--font-mono);
		fill: #111;
	}
	.sheen {
		translate: 0 0;
		transition: translate 0.9s ease;
	}
	:global(.medal-host:hover) .medal,
	:global(.medal-host:focus-within) .medal {
		color: var(--color-accent);
		transform: translateY(-3px);
	}
	:global(.medal-host:hover) .sheen,
	:global(.medal-host:focus-within) .sheen {
		translate: 300px 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.medal,
		.sheen {
			transition: none;
		}
		:global(.medal-host:hover) .sheen,
		:global(.medal-host:focus-within) .sheen {
			translate: 0 0;
		}
	}
</style>
