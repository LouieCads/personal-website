<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	const FONT: Record<string, number[][]> = {
		L: [
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 1, 1, 1, 1]
		],
		O: [
			[0, 1, 1, 1, 0],
			[1, 1, 0, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 0, 1, 1],
			[0, 1, 1, 1, 0]
		],
		U: [
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 0, 1, 1],
			[0, 1, 1, 1, 0]
		],
		I: [
			[1, 1, 1],
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 1]
		],
		G: [
			[0, 1, 1, 1, 0],
			[1, 1, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 1, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 0, 1, 1],
			[0, 1, 1, 1, 0]
		],
		E: [
			[1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 1, 1, 1, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 1, 1, 1, 1]
		],
		C: [
			[0, 1, 1, 1, 0],
			[1, 1, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 0],
			[1, 1, 0, 0, 0],
			[0, 1, 1, 1, 0]
		],
		A: [
			[0, 0, 1, 0, 0],
			[0, 1, 0, 1, 0],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 1, 1, 1, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1]
		],
		M: [
			[1, 0, 0, 0, 1],
			[1, 1, 0, 1, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1]
		],
		N: [
			[1, 0, 0, 0, 1],
			[1, 1, 0, 0, 1],
			[1, 1, 0, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 0, 0, 1, 1],
			[1, 0, 0, 1, 1],
			[1, 0, 0, 0, 1]
		],
		Y: [
			[1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1],
			[0, 1, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 1, 0, 0]
		]
	};

	const LINE1 = 'LOUIGIE';
	const LINE2 = 'CAMINOY';
	const LETTER_GAP = 2;
	const ROWS = 8;
	const LINE_GAP = 4;
	// Extra cols of left indent for the last name (responsive in draw)
	let LINE2_INDENT = 10;

	interface LetterPos {
		letter: string;
		startCol: number;
		width: number;
	}

	function computeLayout(name: string): { positions: LetterPos[]; totalCols: number } {
		const positions: LetterPos[] = [];
		let totalCols = 0;
		for (let i = 0; i < name.length; i++) {
			const ch = name[i];
			const w = FONT[ch][0].length;
			positions.push({ letter: ch, startCol: totalCols, width: w });
			totalCols += w;
			if (i < name.length - 1) totalCols += LETTER_GAP;
		}
		return { positions, totalCols };
	}

	const layout1 = computeLayout(LINE1);
	const layout2 = computeLayout(LINE2);

	const BIN_LEN = 4;

	function randomBin(): string {
		let s = '';
		for (let i = 0; i < BIN_LEN; i++) s += Math.random() > 0.5 ? '1' : '0';
		return s;
	}

	interface CellState {
		value: string;
		nextChange: number;
		interval: number;
	}

	const line1Cells = new SvelteMap<string, CellState>();
	const line2Cells = new SvelteMap<string, CellState>();

	function makeCell(): CellState {
		const interval = 800 + Math.random() * 1800;
		return { value: randomBin(), nextChange: Math.random() * interval, interval };
	}

	for (const lp of layout1.positions) {
		for (let localCol = 0; localCol < lp.width; localCol++) {
			const bitmap = FONT[lp.letter];
			for (let r = 0; r < ROWS; r++) {
				if (bitmap[r][localCol]) {
					line1Cells.set(`${lp.startCol + localCol}-${r}`, makeCell());
				}
			}
		}
	}

	for (const lp of layout2.positions) {
		for (let localCol = 0; localCol < lp.width; localCol++) {
			const bitmap = FONT[lp.letter];
			for (let r = 0; r < ROWS; r++) {
				if (bitmap[r][localCol]) {
					line2Cells.set(`${lp.startCol + localCol}-${r}`, makeCell());
				}
			}
		}
	}

	function tickCell(cell: CellState, time: number) {
		if (time >= cell.nextChange) {
			cell.value = randomBin();
			cell.nextChange = time + cell.interval;
		}
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		let animId: number;
		let w = 0;
		let h = 0;

		function resize() {
			w = container.clientWidth;
			h = container.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function draw(time: number) {
			ctx!.clearRect(0, 0, w, h);

			// Responsive indent: reduce on narrow screens
			LINE2_INDENT = w < 480 ? 0 : w < 768 ? 4 : 10;

			const isDark = document.documentElement.classList.contains('dark');
			const textRgb = isDark ? '255, 255, 255' : '0, 0, 0';
			// Light mode needs higher base opacity so black reads strongly on a light bg
			const line1Base = isDark ? 0.82 : 0.95;
			const line1Swing = isDark ? 0.12 : 0.05;
			const line2Base = isDark ? 0.72 : 0.78;
			const line2Swing = isDark ? 0.10 : 0.06;

			// Size cells to fill the full container width
			const widestLine = Math.max(layout1.totalCols, layout2.totalCols + LINE2_INDENT);
			const maxCellW = (w * 0.87) / widestLine;
			const cellW = Math.min(maxCellW, 48);
			const cellH = cellW * 0.75;
			const fontSize = Math.max(cellW * 0.32, 6);

			const startX = w < 640 ? w * 0.02 : w * 0.06;

			// Line 1: left-aligned at startX
			const line1OffX = startX;
			// Line 2: indented by LINE2_INDENT cells
			const line2OffX = startX + LINE2_INDENT * cellW;

			// Vertical: center the two-line block
			const totalBlockH = (2 * ROWS + LINE_GAP) * cellH;
			const blockStartY = (h - totalBlockH) * 0.48;
			const line1StartY = blockStartY;
			const line2StartY = blockStartY + (ROWS + LINE_GAP) * cellH;

			ctx!.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			// Draw line 1 (LOUIGIE)
			for (const lp of layout1.positions) {
				const bitmap = FONT[lp.letter];
				for (let localCol = 0; localCol < lp.width; localCol++) {
					const globalCol = lp.startCol + localCol;
					const x = line1OffX + globalCol * cellW + cellW / 2;
					for (let r = 0; r < ROWS; r++) {
						if (!bitmap[r][localCol]) continue;
						const y = line1StartY + r * cellH + cellH / 2;
						const cell = line1Cells.get(`${globalCol}-${r}`);
						if (!cell) continue;
						tickCell(cell, time);
						const pulse = line1Base + line1Swing * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = `rgba(${textRgb}, ${pulse})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			// Draw line 2 (CAMINOY) — indented
			for (const lp of layout2.positions) {
				const bitmap = FONT[lp.letter];
				for (let localCol = 0; localCol < lp.width; localCol++) {
					const globalCol = lp.startCol + localCol;
					const x = line2OffX + globalCol * cellW + cellW / 2;
					for (let r = 0; r < ROWS; r++) {
						if (!bitmap[r][localCol]) continue;
						const y = line2StartY + r * cellH + cellH / 2;
						const cell = line2Cells.get(`${globalCol}-${r}`);
						if (!cell) continue;
						tickCell(cell, time);
						const pulse = line2Base + line2Swing * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = `rgba(${textRgb}, ${pulse})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			animId = requestAnimationFrame(draw);
		}

		resize();
		document.fonts.ready.then(() => {
			animId = requestAnimationFrame(draw);
		});
		window.addEventListener('resize', resize);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<div bind:this={container} class="absolute inset-0" role="img" aria-label="LOUIGIE CAMINOY">
	<canvas bind:this={canvas}></canvas>
</div>
