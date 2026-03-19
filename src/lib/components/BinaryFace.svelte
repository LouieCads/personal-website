<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	const COLS = 72;
	const ROWS = 90;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		let animId: number;
		let w = 0;
		let h = 0;

		// Per-cell animated binary state
		interface CellState {
			value: string;
			nextChange: number;
			interval: number;
		}

		const cells: CellState[] = [];
		for (let i = 0; i < COLS * ROWS; i++) {
			const interval = 500 + Math.random() * 2500;
			cells.push({
				value: Math.random() > 0.5 ? '1' : '0',
				nextChange: Math.random() * interval,
				interval
			});
		}

		function tickCell(cell: CellState, time: number) {
			if (time >= cell.nextChange) {
				cell.value = Math.random() > 0.5 ? '1' : '0';
				cell.nextChange = time + cell.interval;
			}
		}

		// Sample brightness from image
		let brightness: Float32Array | null = null;

		const offscreen = document.createElement('canvas');
		offscreen.width = COLS;
		offscreen.height = ROWS;
		const offCtx = offscreen.getContext('2d')!;

		const img = new Image();
		img.src = '/profile.jpg';
		img.onload = () => {
			offCtx.drawImage(img, 0, 0, COLS, ROWS);
			const data = offCtx.getImageData(0, 0, COLS, ROWS);
			brightness = new Float32Array(COLS * ROWS);
			for (let i = 0; i < COLS * ROWS; i++) {
				const r = data.data[i * 4];
				const g = data.data[i * 4 + 1];
				const b = data.data[i * 4 + 2];
				// Perceived luminance
				brightness[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
			}
		};

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

			if (!brightness) {
				animId = requestAnimationFrame(draw);
				return;
			}

			const cellW = w / COLS;
			const cellH = h / ROWS;
			const fontSize = Math.max(cellW * 0.72, 5);

			ctx!.font = `600 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			for (let r = 0; r < ROWS; r++) {
				for (let c = 0; c < COLS; c++) {
					const idx = r * COLS + c;
					const b = brightness[idx];

					// Skip very bright pixels (white background)
					if (b > 0.88) continue;

					const cell = cells[idx];
					tickCell(cell, time);

					// Darker pixel = more opaque/visible character
					// Add subtle sine pulse for vitality
					const base = (1 - b) * 0.92;
					const pulse = base * (0.85 + 0.15 * Math.sin(time * 0.003 + c * 0.3 + r * 0.5));
					const opacity = Math.max(0, Math.min(1, pulse));

					const x = c * cellW + cellW / 2;
					const y = r * cellH + cellH / 2;

					ctx!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
					ctx!.fillText(cell.value, x, y);
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

<div bind:this={container} class="h-full w-full" role="img" aria-label="Binary portrait of Louigie Caminoy">
	<canvas bind:this={canvas}></canvas>
</div>
