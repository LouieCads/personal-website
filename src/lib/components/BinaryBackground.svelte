<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	// Larger cells = fewer draws per frame
	const CELL = 26;
	// Target ~20fps — plenty for a slow decorative background
	const TARGET_FPS = 20;
	const FRAME_MS = 1000 / TARGET_FPS;

	// Pool sized to cover a 1440×900 screen at CELL=26 (~56×35 = ~1960 cells max)
	const MAX_COLS = 60;
	const MAX_ROWS = 38;

	interface CellState {
		value: string;
		nextChange: number;
		interval: number;
	}

	// Pre-allocate flat array instead of Map — faster index lookup
	const cells: CellState[] = new Array(MAX_COLS * MAX_ROWS);
	for (let i = 0; i < cells.length; i++) {
		const interval = 1800 + Math.random() * 4000;
		cells[i] = { value: Math.random() > 0.5 ? '1' : '0', nextChange: Math.random() * interval, interval };
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Cap DPR at 1 — decorative canvas doesn't need retina sharpness
		const dpr = Math.min(window.devicePixelRatio || 1, 1);
		let animId: number;
		let w = 0;
		let h = 0;
		let lastFrame = 0;
		let cols = 0;
		let rows = 0;
		let hidden = false;

		// Pause when tab is not visible
		function onVisibility() {
			hidden = document.hidden;
		}
		document.addEventListener('visibilitychange', onVisibility);

		function resize() {
			w = container.clientWidth;
			h = container.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			cols = Math.min(Math.ceil(w / CELL) + 1, MAX_COLS);
			rows = Math.min(Math.ceil(h / CELL) + 1, MAX_ROWS);
		}

		// Cache theme values — only read DOM when theme changes
		let isDark = document.documentElement.classList.contains('dark');
		let textRgb = isDark ? '255, 255, 255' : '0, 0, 0';
		let baseOpacity = isDark ? 0.035 : 0.045;

		const observer = new MutationObserver(() => {
			isDark = document.documentElement.classList.contains('dark');
			textRgb = isDark ? '255, 255, 255' : '0, 0, 0';
			baseOpacity = isDark ? 0.028 : 0.035;
		});
		observer.observe(document.documentElement, { attributeFilter: ['class'] });

		const fontSize = Math.max(CELL * 0.52, 6);

		function draw(time: number) {
			animId = requestAnimationFrame(draw);

			if (hidden || time - lastFrame < FRAME_MS) return;
			lastFrame = time;

			ctx!.clearRect(0, 0, w, h);
			ctx!.font = `400 ${fontSize}px 'JetBrains Mono', monospace`;
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const cell = cells[r * MAX_COLS + c];
					if (time >= cell.nextChange) {
						cell.value = Math.random() > 0.5 ? '1' : '0';
						cell.nextChange = time + cell.interval;
					}
					ctx!.fillStyle = `rgba(${textRgb}, ${baseOpacity})`;
					ctx!.fillText(cell.value, c * CELL + CELL / 2, r * CELL + CELL / 2);
				}
			}
		}

		resize();
		document.fonts.ready.then(() => {
			animId = requestAnimationFrame(draw);
		});

		let resizeTimer: ReturnType<typeof setTimeout>;
		function onResize() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(resize, 150);
		}
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', onVisibility);
			observer.disconnect();
		};
	});
</script>

<div bind:this={container} class="absolute inset-0" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>
