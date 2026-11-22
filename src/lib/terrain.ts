/**
 * A tiny low-poly terrain renderer for the recognitions hiking route.
 *
 * No WebGL and no per-frame work: a height field is sampled on a small grid,
 * projected with a fixed oblique camera, and flat-shaded against one light.
 * The output is plain SVG path data plus a shade level per facet (0 = lit,
 * 6 = darkest), so colours stay in CSS and follow the theme. It is rebuilt
 * only when the container width changes, which keeps it cheap on low-end
 * phones.
 *
 * World space: x runs -1 (left) to 1 (right), z runs 0 (front) to 1 (back),
 * y is height with the summit at 1.
 */

export interface Point {
	x: number;
	y: number;
}

export interface Facet {
	d: string;
	tone: number;
}

export interface TerrainOptions {
	width: number;
	height: number;
	/** Screen y of the summit. */
	summitY: number;
	/** Screen y of the front edge of the slab. */
	baseY: number;
	/** How far the back edge rises above the front, in px. */
	depth: number;
	/** Thickness of the slab's front face, in px. */
	thickness: number;
	/** Grid density. `rows * SUMMIT.z` must be a whole number. */
	cols: number;
	rows: number;
	/** Half-width of the slab as a share of the width. */
	spread?: number;
	/** Centre of the slab on screen; defaults to the middle. */
	centerX?: number;
}

export interface Terrain {
	facets: Facet[];
	/** The slab's front face, and the hairline along its top edge. */
	skirt: string;
	rim: string;
	project: (x: number, z: number, y?: number) => Point;
	heightAt: (x: number, z: number) => number;
	/** World units to px along x, at depth z. */
	scaleX: (z: number) => number;
}

/** The main peak sits on a grid vertex so the summit pin lands on a real tip. */
export const SUMMIT = { x: 0, z: 0.6 };

interface Peak {
	x: number;
	z: number;
	h: number;
	r: number;
}

const PEAKS: Peak[] = [
	{ ...SUMMIT, h: 1, r: 0.85 },
	{ x: -0.6, z: 0.76, h: 0.52, r: 0.36 },
	{ x: 0.62, z: 0.74, h: 0.58, r: 0.38 },
	{ x: -0.86, z: 0.2, h: 0.12, r: 0.22 }
];

/** Depth is squashed so slopes facing the camera are steeper than the sides. */
const DEPTH_STRETCH = 1.6;

export function heightAt(x: number, z: number): number {
	let h = 0;
	for (const p of PEAKS) {
		const d = Math.hypot(x - p.x, (z - p.z) * DEPTH_STRETCH) / p.r;
		if (d < 1) h = Math.max(h, p.h * Math.pow(1 - d, 1.15));
	}
	return h;
}

/** Deterministic 0..1 noise, so every visitor sees the same mountain. */
function hash(i: number, j: number): number {
	const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
	return s - Math.floor(s);
}

/** Light from the upper left, slightly in front. */
const LIGHT = (() => {
	const v = [-0.5, 0.76, -0.4];
	const m = Math.hypot(...v);
	return v.map((n) => n / m);
})();
const TONES = 7;
/** World height relative to the x half-width, for shading only. */
const RELIEF = 0.9;

const f = (n: number) => n.toFixed(1);

export function buildTerrain(o: TerrainOptions): Terrain {
	const spread = o.spread ?? 0.47;
	const cx = o.centerX ?? o.width / 2;
	const SX = o.width * spread;
	const HY = o.baseY - SUMMIT.z * o.depth - o.summitY;
	const scaleX = (z: number) => SX * (1 - 0.18 * z);
	const project = (x: number, z: number, y = 0): Point => ({
		x: cx + x * scaleX(z),
		y: o.baseY - z * o.depth - y * HY
	});

	// Vertices, jittered inside the grid for an irregular low-poly surface.
	// Borders stay straight so the slab keeps clean edges, and the summit
	// vertex stays put so the peak is exact.
	const { cols, rows } = o;
	const peakI = cols / 2;
	const peakJ = Math.round(SUMMIT.z * rows);
	const verts: { x: number; z: number; y: number }[][] = [];
	for (let j = 0; j <= rows; j++) {
		const row = [];
		for (let i = 0; i <= cols; i++) {
			let x = -1 + (2 * i) / cols;
			let z = j / rows;
			const inner = i > 0 && i < cols && j > 0 && j < rows;
			if (inner && !(i === peakI && j === peakJ)) {
				x += (hash(i, j) - 0.5) * (1 / cols);
				z += (hash(j + 7, i) - 0.5) * (0.5 / rows);
			}
			const base = heightAt(x, z);
			const isPeak = i === peakI && j === peakJ;
			const y = isPeak ? base : base * (1 + (hash(i + 3, j + 5) - 0.5) * 0.06);
			row.push({ x, z, y });
		}
		verts.push(row);
	}

	const shade = (a: (typeof verts)[0][0], b: typeof a, c: typeof a) => {
		const u = [b.x - a.x, (b.y - a.y) * RELIEF, b.z - a.z];
		const v = [c.x - a.x, (c.y - a.y) * RELIEF, c.z - a.z];
		let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
		if (n[1] < 0) n = n.map((k) => -k);
		const m = Math.hypot(...n) || 1;
		const lambert = (n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]) / m;
		return Math.max(0, Math.min(TONES - 1, Math.round((1 - lambert) * TONES)));
	};

	const tri = (a: (typeof verts)[0][0], b: typeof a, c: typeof a): Facet => {
		const [p, q, r] = [a, b, c].map((v) => project(v.x, v.z, v.y));
		return {
			d: `M${f(p.x)} ${f(p.y)}L${f(q.x)} ${f(q.y)}L${f(r.x)} ${f(r.y)}Z`,
			tone: shade(a, b, c)
		};
	};

	// Painter's order: back rows first, so nearer slopes cover what they hide.
	const facets: Facet[] = [];
	for (let j = rows - 1; j >= 0; j--) {
		for (let i = 0; i < cols; i++) {
			const a = verts[j][i];
			const b = verts[j][i + 1];
			const c = verts[j + 1][i];
			const d = verts[j + 1][i + 1];
			if ((i + j) % 2) facets.push(tri(c, d, b), tri(c, b, a));
			else facets.push(tri(c, d, a), tri(a, d, b));
		}
	}

	const front = verts[0].map((v) => project(v.x, v.z, v.y));
	const rim = front.map((p, i) => `${i ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`).join('');
	const skirt =
		rim +
		[...front]
			.reverse()
			.map((p) => `L${f(p.x)} ${f(p.y + o.thickness)}`)
			.join('') +
		'Z';

	return { facets, skirt, rim, project, heightAt, scaleX };
}

/**
 * A low-poly cloud in a 120 x 56 box: three faceted domes on a flat, shaded
 * underside. Each dome is a fan of triangles shaded by which way it faces
 * (light from the upper left), so it reads as a solid puff, not a sticker.
 * Built once at import; every cloud on the page reuses it.
 */
export const CLOUD: Facet[] = (() => {
	const facets: Facet[] = [{ d: 'M18 38L104 38L108 47L13 47Z', tone: 4 }];
	const domes = [
		[62, 36, 28],
		[34, 40, 19],
		[90, 41, 17]
	];
	const light = (3 * Math.PI) / 4;
	for (const [cx, cy, r] of domes) {
		const SEG = 6;
		const rim = Array.from({ length: SEG + 1 }, (_, k) => {
			const a = Math.PI - (k * Math.PI) / SEG;
			return { a, x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
		});
		for (let k = 0; k < SEG; k++) {
			const p = rim[k];
			const q = rim[k + 1];
			const facing = Math.cos((p.a + q.a) / 2 - light);
			facets.push({
				d: `M${f(cx)} ${f(cy + 3)}L${f(p.x)} ${f(p.y)}L${f(q.x)} ${f(q.y)}Z`,
				tone: Math.max(0, Math.min(3, Math.round((1 - facing) * 1.5)))
			});
		}
	}
	return facets;
})();

/** Two-tone cone: lit left half, shaded right half, two tiers. */
export function pine(x: number, y: number, h: number): { lit: string; dark: string } {
	let lit = '';
	let dark = '';
	for (let t = 0; t < 2; t++) {
		const top = y - h + t * h * 0.34;
		const bottom = top + h * 0.62;
		const w = h * (0.24 + t * 0.08);
		lit += `M${f(x)} ${f(top)}L${f(x - w)} ${f(bottom)}L${f(x)} ${f(bottom + w * 0.18)}Z`;
		dark += `M${f(x)} ${f(top)}L${f(x + w)} ${f(bottom)}L${f(x)} ${f(bottom + w * 0.18)}Z`;
	}
	return { lit, dark };
}

/** A ridge tent as a prism: lit left pitch, shaded right pitch, dark door. */
export function tent(x: number, y: number, s = 1): { lit: string; dark: string; door: string } {
	const w = 18 * s;
	const h = 20 * s;
	const back = 7 * s;
	return {
		lit: `M${f(x - w)} ${f(y)}L${f(x)} ${f(y - h)}L${f(x + back)} ${f(y - h - back * 0.5)}L${f(x - w + back)} ${f(y - back * 0.5)}Z`,
		dark: `M${f(x)} ${f(y - h)}L${f(x + w)} ${f(y)}L${f(x - w)} ${f(y)}Z`,
		door: `M${f(x)} ${f(y - h * 0.62)}L${f(x + w * 0.3)} ${f(y)}L${f(x - w * 0.3)} ${f(y)}Z`
	};
}
