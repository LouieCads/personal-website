<script lang="ts">
	import { onMount } from 'svelte';

	let visible = $state(false);

	onMount(() => {
		visible = true;
	});
</script>

<section id="home" class="relative flex min-h-screen items-center justify-center px-6">
	<div
		class="relative z-10 max-w-3xl transition-all duration-1000 {visible
			? 'translate-y-0 opacity-100'
			: 'translate-y-8 opacity-0'}"
	>
		<div class="mb-6 flex items-center gap-3">
			<span class="h-px w-8 bg-[var(--color-accent)]"></span>
			<span class="font-mono text-xs tracking-widest text-[var(--color-accent)]">LOUIGIE</span>
		</div>

		<h1 class="mb-4 text-4xl leading-tight font-light tracking-tight text-white sm:text-5xl md:text-6xl">
			CTO. Blockchain Developer.<br />
			<span class="text-[var(--color-text-secondary)]">Project Manager.</span>
		</h1>

		<p class="mb-2 max-w-xl font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
			&gt; comfort_kills_greatness
		</p>

		<p class="mb-10 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]">
			A neuroplastic, growth-driven software engineer passionate about tech,
			fitness, and constant evolution.
		</p>

		<div class="flex flex-wrap gap-4">
			<a
				href="#projects"
				class="group flex items-center gap-2 border border-[var(--color-accent)] bg-[var(--color-glow)] px-6 py-3 font-mono text-xs tracking-wide text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-black"
			>
				View Projects
				<span class="transition-transform group-hover:translate-x-1">&rarr;</span>
			</a>
			<a
				href="#contact"
				class="flex items-center gap-2 border border-[var(--color-border)] px-6 py-3 font-mono text-xs tracking-wide text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
			>
				Get in Touch
			</a>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-10 left-1/2 -translate-x-1/2">
		<div class="flex flex-col items-center gap-2">
			<span class="font-mono text-[10px] tracking-widest text-[var(--color-text-muted)]">SCROLL</span>
			<div class="h-8 w-px animate-pulse bg-gradient-to-b from-[var(--color-text-muted)] to-transparent"></div>
		</div>
	</div>
</section>
