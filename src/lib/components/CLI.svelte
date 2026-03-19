<script lang="ts">
	let input = $state('');
	let error = $state('');
	let errorTimeout: ReturnType<typeof setTimeout>;

	const commands: Record<string, () => void> = {
		'/home': () => scrollToSection('home'),
		'/about': () => scrollToSection('about'),
		'/projects': () => scrollToSection('projects'),
		'/contact': () => scrollToSection('contact'),
		'/resume': () => window.open('/resume.pdf', '_blank'),
		'/github': () => window.open('https://github.com/LouieCads', '_blank'),
		'/linkedin': () => window.open('https://www.linkedin.com/in/louie1221/', '_blank'),
		'/email': () => (window.location.href = 'mailto:louigiecads143@gmail.com'),
		'/clear': () => {
			error = '';
			input = '';
		},
		'/help': () => {
			error = 'Commands: /home /about /projects /contact /resume /github /linkedin /email';
		}
	};

	function scrollToSection(id: string) {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const cmd = input.trim().toLowerCase();

		if (!cmd) return;

		if (cmd in commands) {
			error = '';
			commands[cmd]();
		} else {
			clearTimeout(errorTimeout);
			error = `command not found: ${cmd}`;
			errorTimeout = setTimeout(() => (error = ''), 3000);
		}

		input = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			input = '';
			error = '';
		}
	}
</script>

<div class="fixed right-0 bottom-0 left-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
	<div class="mx-auto max-w-6xl px-6">
		{#if error}
			<div class="px-0 pt-2">
				<span class="font-mono text-xs text-red-400/80">{error}</span>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="flex items-center gap-3 py-3">
			<span class="font-mono text-xs text-[var(--color-accent)]">~$</span>
			<input
				type="text"
				bind:value={input}
				onkeydown={handleKeydown}
				placeholder="Try /about  /projects  /contact  /help"
				class="flex-1 border-none bg-transparent font-mono text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:ring-0"
				spellcheck="false"
				autocomplete="off"
			/>
			<button
				type="submit"
				class="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
			>
				Enter
			</button>
		</form>
	</div>
</div>
