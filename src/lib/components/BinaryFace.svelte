<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	const SIZE = 80; // square grid

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		let animId: number;
		let w = 0;
		let h = 0;

		interface CellState {
			value: string;
			nextChange: number;
			interval: number;
		}

		const cells: CellState[] = [];
		for (let i = 0; i < SIZE * SIZE; i++) {
			const interval = 600 + Math.random() * 3000;
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

		let brightness: Float32Array | null = null;

		const offscreen = document.createElement('canvas');
		offscreen.width = SIZE;
		offscreen.height = SIZE;
		const offCtx = offscreen.getContext('2d')!;

		const img = new Image();
		img.src = '/profile.jpg';
		img.onload = () => {
			// Center-crop to square
			const side = Math.min(img.width, img.height);
			const sx = (img.width - side) / 2;
			const sy = (img.height - side) / 2;
			offCtx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);

			const data = offCtx.getImageData(0, 0, SIZE, SIZE);
			brightness = new Float32Array(SIZE * SIZE);
			for (let i = 0; i < SIZE * SIZE; i++) {
				const r = data.data[i * 4];
				const g = data.data[i * 4 + 1];
				const b = data.data[i * 4 + 2];
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

			// Square: fit inside container, centered
			const side = Math.min(w, h);
			const offsetX = (w - side) / 2;
			const offsetY = (h - side) / 2;

			// Fill square with hero background color
			ctx!.fillStyle = '#050505';
			ctx!.fillRect(offsetX, offsetY, side, side);

			const cellSize = side / SIZE;
			const fontSize = Math.max(cellSize * 0.78, 4);

			ctx!.font = `600 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			for (let r = 0; r < SIZE; r++) {
				for (let c = 0; c < SIZE; c++) {
					const idx = r * SIZE + c;
					const b = brightness[idx];

					if (b > 0.90) continue;

					const cell = cells[idx];
					tickCell(cell, time);

					const invB = 1 - b;
					const base = Math.pow(invB, 0.7) * 0.95;
					const pulse = 0.88 + 0.12 * Math.sin(time * 0.002 + c * 0.25 + r * 0.35);
					const opacity = Math.max(0, Math.min(1, base * pulse));
					if (opacity < 0.02) continue;

					const x = offsetX + c * cellSize + cellSize / 2;
					const y = offsetY + r * cellSize + cellSize / 2;

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
