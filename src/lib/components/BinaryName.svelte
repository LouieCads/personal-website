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
		interval: number;
		/** decode-lock-in intro: false while this cell still scrambles every frame */
		revealed: boolean;
	}

	const line1Cells = new SvelteMap<string, CellState>();
	const line2Cells = new SvelteMap<string, CellState>();

	function makeCell(): CellState {
		const interval = 800 + Math.random() * 1800;
		return { value: randomBin(), nextChange: Math.random() * interval, interval, revealed: false };
	}

	// Decode lock-in intro: columns sweep left-to-right, each snapping from a
	// fast scramble into the normal slow flicker once the sweep passes it.
	// Slow + high-contrast so it actually reads instead of blending into the
	// steady-state flicker: unresolved columns sit dim, locked columns pop to
	// full brightness, and a bright scan bar marks the sweep's leading edge.
	const SWEEP_MS = 2200;
	const UNRESOLVED_OPACITY = 0.16;

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

		function draw(time: number) {
			if (introStart === 0) introStart = time;

			ctx!.clearRect(0, 0, w, h);

			const isDark = document.documentElement.classList.contains('dark');
			const textRgb = isDark ? '255, 255, 255' : '0, 0, 0';
			const accentRgb = isDark ? '59, 130, 246' : '37, 99, 235';
			// Light mode needs higher base opacity so black reads strongly on a light bg
			const line1Base = isDark ? 0.82 : 0.95;
			const line1Swing = isDark ? 0.12 : 0.05;
			const line2Base = isDark ? 0.72 : 0.78;
			const line2Swing = isDark ? 0.1 : 0.06;

			// How far the decode sweep has travelled, 0-1, shared by both lines'
			// bar so it reads as one continuous pass across the whole name.
			const sweepFrac = reducedMotion ? 1 : Math.min((time - introStart) / SWEEP_MS, 1);

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
						const revealAt = introStart + (globalCol / layout1.totalCols) * SWEEP_MS;
						const locked = reducedMotion || time >= revealAt;
						if (!locked) {
							cell.value = randomBin();
						} else {
							if (!cell.revealed) {
								cell.revealed = true;
								cell.nextChange = time + cell.interval;
							}
							tickCell(cell, time);
						}
						const pulse =
							line1Base + line1Swing * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = locked
							? `rgba(${textRgb}, ${pulse})`
							: `rgba(${textRgb}, ${UNRESOLVED_OPACITY})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			// Sweep bar for line 1 — a bright band riding the reveal frontier
			if (sweepFrac < 1) {
				const barX = line1OffX + sweepFrac * layout1.totalCols * cellW;
				ctx!.fillStyle = `rgba(${accentRgb}, 0.55)`;
				ctx!.fillRect(barX - cellW * 0.4, line1StartY, cellW * 0.8, ROWS * cellH);
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
						const revealAt = introStart + (globalCol / layout2.totalCols) * SWEEP_MS;
						const locked = reducedMotion || time >= revealAt;
						if (!locked) {
							cell.value = randomBin();
						} else {
							if (!cell.revealed) {
								cell.revealed = true;
								cell.nextChange = time + cell.interval;
							}
							tickCell(cell, time);
						}
						const pulse =
							line2Base + line2Swing * Math.sin(time * 0.004 + globalCol * 0.4 + r * 0.7);
						ctx!.fillStyle = locked
							? `rgba(${textRgb}, ${pulse})`
							: `rgba(${textRgb}, ${UNRESOLVED_OPACITY})`;
						ctx!.fillText(cell.value, x, y);
					}
				}
			}

			// Sweep bar for line 2
			if (sweepFrac < 1) {
				const barX = line2OffX + sweepFrac * layout2.totalCols * cellW;
				ctx!.fillStyle = `rgba(${accentRgb}, 0.55)`;
				ctx!.fillRect(barX - cellW * 0.4, line2StartY, cellW * 0.8, ROWS * cellH);
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
