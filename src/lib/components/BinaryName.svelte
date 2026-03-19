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
	const LINE_GAP = 4; // extra rows of space between the two name lines

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
	const maxCols = Math.max(layout1.totalCols, layout2.totalCols);

	function colHasActive(col: number, positions: LetterPos[]): boolean {
		for (const lp of positions) {
			const localCol = col - lp.startCol;
			if (localCol >= 0 && localCol < lp.width) {
				return FONT[lp.letter].some((row) => row[localCol] === 1);
			}
		}
		return false;
	}

	// Stream heights above line 1
	const streamHeights: number[] = [];
	for (let c = 0; c < maxCols; c++) {
		const localC = c - Math.floor((maxCols - layout1.totalCols) / 2);
		if (localC >= 0 && localC < layout1.totalCols && colHasActive(localC, layout1.positions)) {
			streamHeights.push(Math.floor(Math.random() * 14) + 2);
		} else {
			streamHeights.push(Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0);
		}
	}

	// Chart bars on the right side
	const chartBars: { col: number; height: number }[] = [];
	const chartBarCount = 25;
	for (let i = 0; i < chartBarCount; i++) {
		chartBars.push({ col: i, height: Math.floor(Math.random() * 18) + 3 });
	}

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

	const streamCells = new Map<string, CellState>();
	const line1Cells = new Map<string, CellState>();
	const line2Cells = new Map<string, CellState>();
	const chartCells = new Map<string, CellState>();

	function makeCell(offset = 0): CellState {
		const interval = 800 + Math.random() * 1800;
		return { value: randomBin(), nextChange: offset + Math.random() * interval, interval };
	}

	// Init stream cells
	for (let c = 0; c < maxCols; c++) {
		const sH = streamHeights[c];
		for (let s = sH; s > 0; s--) {
			streamCells.set(`${c}-${s}`, makeCell());
		}
	}

	// Init line 1 letter cells
	for (const lp of layout1.positions) {
		for (let localCol = 0; localCol < lp.width; localCol++) {
			const bitmap = FONT[lp.letter];
			for (let r = 0; r < ROWS; r++) {
				if (bitmap[r][localCol]) {
					const globalCol = lp.startCol + localCol;
					line1Cells.set(`${globalCol}-${r}`, makeCell());
				}
			}
		}
	}

	// Init line 2 letter cells
	for (const lp of layout2.positions) {
		for (let localCol = 0; localCol < lp.width; localCol++) {
			const bitmap = FONT[lp.letter];
			for (let r = 0; r < ROWS; r++) {
				if (bitmap[r][localCol]) {
					const globalCol = lp.startCol + localCol;
					line2Cells.set(`${globalCol}-${r}`, makeCell());
				}
			}
		}
	}

	// Init chart cells
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

			const maxCellW = (w * 0.62) / maxCols;
			const cellW = Math.min(maxCellW, 28);
			const cellH = cellW * 0.75;
			const fontSize = Math.max(cellW * 0.32, 6);

			const startX = w * 0.05;

			// Horizontal offset to center each line within maxCols
			const line1OffX = startX + Math.floor((maxCols - layout1.totalCols) / 2) * cellW;
			const line2OffX = startX + Math.floor((maxCols - layout2.totalCols) / 2) * cellW;

			// Vertical: center the two-line block
			const totalBlockH = (2 * ROWS + LINE_GAP) * cellH;
			const blockStartY = h * 0.5 - totalBlockH * 0.52;
			const line1StartY = blockStartY;
			const line2StartY = blockStartY + (ROWS + LINE_GAP) * cellH;

			ctx!.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			// Draw streams above line 1
			for (let c = 0; c < maxCols; c++) {
				const x = startX + c * cellW + cellW / 2;
				const sH = streamHeights[c];
				for (let s = sH; s > 0; s--) {
					const y = line1StartY - s * cellH + cellH / 2;
					if (y < 0) continue;
					const cell = streamCells.get(`${c}-${s}`);
					if (!cell) continue;
					tickCell(cell, time);
					const distRatio = s / sH;
					const opacity = 0.05 + (1 - distRatio) * 0.10;
					ctx!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
					ctx!.fillText(cell.value, x, y);
				}
			}

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
						const pulse = 0.82 + 0.12 * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = `rgba(255, 255, 255, ${pulse})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			// Draw line 2 (CAMINOY)
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
						const pulse = 0.72 + 0.10 * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = `rgba(255, 255, 255, ${pulse})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			// Chart bars (right side)
			const chartStartX = w * 0.72;
			const chartCellW = cellW * 0.9;
			const chartBaseY = line2StartY + ROWS * cellH;

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

<div bind:this={container} class="absolute inset-0" role="img" aria-label="LOUIGIE CAMINOY">
	<canvas bind:this={canvas}></canvas>
</div>
