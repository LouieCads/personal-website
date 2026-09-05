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
	const LINE2_INDENT = 0;

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
		/** this cell's steady-state flicker period; the intro scales it down */
		interval: number;
	}

	const line1Cells = new SvelteMap<string, CellState>();
	const line2Cells = new SvelteMap<string, CellState>();

	function makeCell(): CellState {
		const interval = 800 + Math.random() * 1800;
		// Start almost immediately. The per-cell interval desyncs them within a
		// frame or two, so there is no visible lock-step on the first tick.
		return { value: randomBin(), nextChange: Math.random() * 60, interval };
	}

	/*
	 * Intro: the steady-state flicker, run fast and eased back to normal speed.
	 *
	 * There is no separate reveal state — every cell is at its usual brightness
	 * from the first frame, and the *only* thing that changes is the tick rate.
	 * That's what makes it read as the same animation settling down rather than
	 * as a different effect handing over to it.
	 */
	const SETTLE_MS = 2200;
	/** Interval multiplier at t=0: turns an ~1.7s flicker into ~70ms. */
	const FAST_SCALE = 0.04;

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

	function tickCell(cell: CellState, time: number, scale: number) {
		if (time >= cell.nextChange) {
			cell.value = randomBin();
			cell.nextChange = time + cell.interval * scale;
		}
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let introStart = 0;
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

		/** One line of the name. `tickScale` shortens every cell's flicker period. */
		function drawLine(
			time: number,
			layout: { positions: LetterPos[]; totalCols: number },
			cells: SvelteMap<string, CellState>,
			offX: number,
			startY: number,
			cellW: number,
			cellH: number,
			base: number,
			swing: number,
			textRgb: string,
			tickScale: number
		) {
			for (const lp of layout.positions) {
				const bitmap = FONT[lp.letter];
				for (let localCol = 0; localCol < lp.width; localCol++) {
					const globalCol = lp.startCol + localCol;
					const x = offX + globalCol * cellW + cellW / 2;

					for (let r = 0; r < ROWS; r++) {
						if (!bitmap[r][localCol]) continue;
						const y = startY + r * cellH + cellH / 2;
						const cell = cells.get(`${globalCol}-${r}`);
						if (!cell) continue;

						tickCell(cell, time, tickScale);

						const pulse = base + swing * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = `rgba(${textRgb}, ${pulse})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}
		}

		function draw(time: number) {
			if (introStart === 0) introStart = time;

			ctx!.clearRect(0, 0, w, h);

			const isDark = document.documentElement.classList.contains('dark');
			const textRgb = isDark ? '255, 255, 255' : '0, 0, 0';
			// Light mode needs higher base opacity so black reads strongly on a light bg
			const line1Base = isDark ? 0.82 : 0.95;
			const line1Swing = isDark ? 0.12 : 0.05;
			const line2Base = isDark ? 0.72 : 0.78;
			const line2Swing = isDark ? 0.1 : 0.06;

			// Size cells to fit BOTH axes. Width alone used to win, so a short
			// container clipped the two-line block instead of scaling it down.
			const widestLine = Math.max(layout1.totalCols, layout2.totalCols + LINE2_INDENT);
			const totalRows = 2 * ROWS + LINE_GAP;
			const maxCellW = (w * 0.87) / widestLine;
			const maxCellH = (h * 0.92) / totalRows;
			const cellW = Math.min(maxCellW, maxCellH / 0.75, 48);
			const cellH = cellW * 0.75;
			const fontSize = Math.max(cellW * 0.32, 6);

			// Center the text block horizontally in the canvas
			const startX = (w - widestLine * cellW) / 2;

			const line1OffX = startX;
			const line2OffX = startX + LINE2_INDENT * cellW;

			// Vertical: center the two-line block
			const totalBlockH = totalRows * cellH;
			const blockStartY = Math.max(0, (h - totalBlockH) * 0.5);
			const line1StartY = blockStartY;
			const line2StartY = blockStartY + (ROWS + LINE_GAP) * cellH;

			ctx!.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			// Intro: the flicker starts ~25x its normal rate and eases back to 1.
			// Cubic, so it holds the fast scramble and then slows off sharply
			// rather than drifting down for the whole two seconds.
			const settle = reducedMotion ? 1 : Math.min((time - introStart) / SETTLE_MS, 1);
			const tickScale = FAST_SCALE + (1 - FAST_SCALE) * settle ** 3;

			drawLine(
				time,
				layout1,
				line1Cells,
				line1OffX,
				line1StartY,
				cellW,
				cellH,
				line1Base,
				line1Swing,
				textRgb,
				tickScale
			);
			drawLine(
				time,
				layout2,
				line2Cells,
				line2OffX,
				line2StartY,
				cellW,
				cellH,
				line2Base,
				line2Swing,
				textRgb,
				tickScale
			);

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
