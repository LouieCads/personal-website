<script lang="ts">
	let scrolled = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}

	const links = [
		{ label: 'About', href: '#about' },
		{ label: 'Projects', href: '#projects' },
		{ label: 'Contact', href: '#contact' }
	];
</script>

<svelte:window onscroll={handleScroll} />

<nav
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-500 {scrolled
		? 'border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl'
		: ''}"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a
			href="#home"
			class="font-mono text-sm font-semibold tracking-wider text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
		>
			~/louigie
		</a>

		<div class="flex items-center gap-8">
			{#each links as link}
				<a
					href={link.href}
					class="font-mono text-xs tracking-wide text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
				>
					{link.label}
				</a>
			{/each}
			<a
				href="/resume.pdf"
				target="_blank"
				rel="noopener noreferrer"
				class="border border-[var(--color-border)] px-4 py-1.5 font-mono text-xs text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
			>
				Resume
			</a>
		</div>
	</div>
</nav>
