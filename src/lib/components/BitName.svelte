<script lang="ts">
	import { onMount } from 'svelte';

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
		]
	};

	const NAME = 'LOUIGIE';
	const LETTER_GAP = 2;
	const ROWS = 8;

	// Compute column layout
	interface LetterPos {
		letter: string;
		startCol: number;
		width: number;
	}
	const letterPositions: LetterPos[] = [];
	let totalCols = 0;
	for (let i = 0; i < NAME.length; i++) {
		const ch = NAME[i];
		const w = FONT[ch][0].length;
		letterPositions.push({ letter: ch, startCol: totalCols, width: w });
		totalCols += w;
		if (i < NAME.length - 1) totalCols += LETTER_GAP;
	}

	// Check if a column has active pixels
	function colHasActive(globalCol: number): boolean {
		for (const lp of letterPositions) {
			const localCol = globalCol - lp.startCol;
			if (localCol >= 0 && localCol < lp.width) {
				return FONT[lp.letter].some((row) => row[localCol] === 1);
			}
		}
		return false;
	}

	// Precompute stream heights (chart bar extensions above letters)
	const streamHeights: number[] = [];
	for (let c = 0; c < totalCols; c++) {
		if (colHasActive(c)) {
			streamHeights.push(Math.floor(Math.random() * 14) + 2);
		} else {
			streamHeights.push(Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0);
		}
	}

	// Chart bars on the right side
	const chartBars: { col: number; height: number }[] = [];
	const chartBarCount = 25;
	for (let i = 0; i < chartBarCount; i++) {
		chartBars.push({
			col: i,
			height: Math.floor(Math.random() * 18) + 3
		});
	}

	const BIN_LEN = 4; // Fixed length keeps letter shapes clean and uniform

	function randomBin(): string {
		let s = '';
		for (let i = 0; i < BIN_LEN; i++) s += Math.random() > 0.5 ? '1' : '0';
		return s;
	}

	// Per-cell state: each cell changes on its own slow, staggered schedule
	interface CellState {
		value: string;
		nextChange: number; // timestamp when value should flip
		interval: number;   // ms between flips (slow, varied per cell)
	}

	// Build state maps keyed the same way as the draw loop
	const letterCells = new Map<string, CellState>();
	const streamCells = new Map<string, CellState>();
	const chartCells  = new Map<string, CellState>();

	function makeCell(offset = 0): CellState {
		const interval = 800 + Math.random() * 1800;
		return {
			value: randomBin(),
			nextChange: offset + Math.random() * interval,
			interval
		};
	}

	// Initialise all cell states with random phase offsets so they don't sync up
	for (let c = 0; c < totalCols; c++) {
		const sH = streamHeights[c];
		for (let s = sH; s > 0; s--) {
			streamCells.set(`${c}-${s}`, makeCell());
		}
		for (const lp of letterPositions) {
			const localCol = c - lp.startCol;
			if (localCol < 0 || localCol >= lp.width) continue;
			const bitmap = FONT[lp.letter];
			for (let r = 0; r < ROWS; r++) {
				if (bitmap[r][localCol]) letterCells.set(`${c}-${r}`, makeCell());
			}
		}
	}
	for (const bar of chartBars) {
		for (let r = 0; r < bar.height; r++) {
			chartCells.set(`${bar.col}-${r}`, makeCell());
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

			const maxCellW = (w * 0.62) / totalCols;
			const cellW = Math.min(maxCellW, 28);
			const cellH = cellW * 0.75;
			const fontSize = Math.max(cellW * 0.32, 6);

			const startX = w * 0.05;
			const startY = h * 0.48;

			ctx!.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			for (let c = 0; c < totalCols; c++) {
				const x = startX + c * cellW + cellW / 2;

				// Stream extensions above letters
				const sH = streamHeights[c];
				for (let s = sH; s > 0; s--) {
					const y = startY - s * cellH + cellH / 2;
					if (y < 0) continue;
					const cell = streamCells.get(`${c}-${s}`);
					if (!cell) continue;
					tickCell(cell, time);
					// Opacity fades with distance from letter — always consistent
					const distRatio = s / sH;
					const opacity = 0.05 + (1 - distRatio) * 0.10;
					ctx!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
					ctx!.fillText(cell.value, x, y);
				}

				// Letter pixels — fixed high opacity so shape reads clearly
				for (const lp of letterPositions) {
					const localCol = c - lp.startCol;
					if (localCol < 0 || localCol >= lp.width) continue;
					const bitmap = FONT[lp.letter];
					for (let r = 0; r < ROWS; r++) {
						if (!bitmap[r][localCol]) continue;
						const y = startY + r * cellH + cellH / 2;
						const cell = letterCells.get(`${c}-${r}`);
						if (!cell) continue;
						tickCell(cell, time);
						// Gentle per-cell sine pulse for life without breaking shape
						const pulse = 0.82 + 0.12 * Math.sin(time * 0.004 + c * 0.4 + r * 0.7);
						ctx!.fillStyle = `rgba(255, 255, 255, ${pulse})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			const chartStartX = w * 0.72;
			const chartCellW  = cellW * 0.9;
			const chartBaseY  = startY + ROWS * cellH;

			for (const bar of chartBars) {
				const bx = chartStartX + bar.col * chartCellW + chartCellW / 2;
				if (bx > w - 20) continue;
				for (let r = 0; r < bar.height; r++) {
					const by = chartBaseY - r * cellH - cellH / 2;
					if (by < 0) continue;
					const cell = chartCells.get(`${bar.col}-${r}`);
					if (!cell) continue;
					tickCell(cell, time);
					const opacity = 0.03 + (r / bar.height) * 0.07;
					ctx!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
					ctx!.fillText(cell.value, bx, by);
				}
			}

			// Horizontal scanlines (very subtle)
			ctx!.strokeStyle = 'rgba(255, 255, 255, 0.008)';
			ctx!.lineWidth = 0.5;
			for (let y = 0; y < h; y += 3) {
				ctx!.beginPath();
				ctx!.moveTo(0, y);
				ctx!.lineTo(w, y);
				ctx!.stroke();
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

<div bind:this={container} class="absolute inset-0" role="img" aria-label="LOUIGIE">
	<canvas bind:this={canvas}></canvas>
</div>
