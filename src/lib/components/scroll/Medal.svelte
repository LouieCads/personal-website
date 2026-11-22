<script lang="ts">
	/**
	 * A laurel medallion drawn in the site's line language: thin strokes in
	 * theme colours, no gold. The wreath turns accent when its card is hovered.
	 * The issuer's logo sits on a light disc so every brand keeps its colours.
	 */
	interface Props {
		logo?: string;
		issuer: string;
	}
	let { logo, issuer }: Props = $props();

	const C = 100;
	/** Leaf pointing along +x from its base: a pointed oval. */
	const LEAF = 'M0 0 Q7 -5.6 16 0 Q7 5.6 0 0 Z';
	const STEPS = 11;

	interface Leaf {
		x: number;
		y: number;
		rotate: number;
	}

	/**
	 * One branch climbs from the bottom gap toward the crown. `dir` is +1 for
	 * the left branch (angle grows from 104° through 180°) and -1 for the
	 * right, which mirrors it. Each step carries a leaf on the outside and one
	 * on the inside of the stem, tilted toward the direction of growth.
	 */
	function branch(dir: 1 | -1): Leaf[] {
		const leaves: Leaf[] = [];
		for (let i = 0; i < STEPS; i++) {
			const deg = 90 + dir * (14 + i * 14.5);
			const rad = (deg * Math.PI) / 180;
			const growth = deg + dir * 90;
			for (const side of [1, -1]) {
				const r = 85 + side * 1.5;
				leaves.push({
					x: C + r * Math.cos(rad),
					y: C + r * Math.sin(rad),
					rotate: growth - dir * side * 38
				});
			}
		}
		return leaves;
	}

	const leaves = [...branch(1), ...branch(-1)];

	/** Stem arcs, bottom gap to just short of the crown. */
	function stem(dir: 1 | -1): string {
		const point = (deg: number) => {
			const rad = (deg * Math.PI) / 180;
			return `${(C + 85 * Math.cos(rad)).toFixed(2)} ${(C + 85 * Math.sin(rad)).toFixed(2)}`;
		};
		const from = 90 + dir * 10;
		const to = 90 + dir * (14 + (STEPS - 1) * 14.5);
		return `M${point(from)} A85 85 0 0 ${dir === 1 ? 1 : 0} ${point(to)}`;
	}

	const initials = $derived(
		issuer
			.split(/\s+/)
			.map((word) => word[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);
</script>

<span class="medal">
	<svg viewBox="0 0 200 200" aria-hidden="true">
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
			<!-- the knot where both branches meet -->
			<path d="M92 186 L100 180 L108 186" />
		</g>
		<circle class="rim" cx="100" cy="100" r="73" />
		<circle class="rim-inner" cx="100" cy="100" r="66" />
	</svg>
	<span class="face">
		{#if logo}
			<img src={logo} alt={`${issuer} logo`} loading="lazy" />
		{:else}
			<span class="initials" aria-hidden="true">{initials}</span>
		{/if}
	</span>
</span>

<style>
	.medal {
		position: relative;
		display: block;
		width: 200px;
		aspect-ratio: 1;
		color: var(--color-text-muted);
		transition:
			color 0.3s,
			transform 0.3s;
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.wreath path {
		fill: none;
		stroke: currentColor;
		stroke-width: 1;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}
	.wreath .leaf {
		fill: currentColor;
		fill-opacity: 0.18;
	}
	.rim {
		fill: var(--color-surface-alt);
		stroke: var(--color-border);
		stroke-width: 1;
	}
	.rim-inner {
		fill: none;
		stroke: var(--color-accent);
		stroke-opacity: 0.55;
		stroke-width: 1;
		stroke-dasharray: 2 3;
	}
	/* 120 of 200 = the disc inside the dashed ring */
	.face {
		position: absolute;
		inset: 20%;
		display: grid;
		place-items: center;
		overflow: hidden;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--color-border);
	}
	.face img {
		display: block;
		width: 76%;
		height: 76%;
		object-fit: contain;
	}
	.initials {
		font: 22px var(--font-mono);
		color: #111;
	}
	:global(.medal-host:hover) .medal,
	:global(.medal-host:focus-within) .medal {
		color: var(--color-accent);
		transform: translateY(-3px);
	}
	@media (prefers-reduced-motion: reduce) {
		.medal {
			transition: none;
		}
	}
</style>
