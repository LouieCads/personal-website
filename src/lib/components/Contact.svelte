<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();
</script>

<div class="view-enter flex h-full flex-col px-18 py-8">
	<div class="mb-8 flex items-center gap-4">
		<button
			onclick={() => navigate('home')}
			class="cursor-pointer font-mono text-[11px] tracking-widest text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-2xl text-[var(--color-accent)]">03</span>
		<span class="font-mono text-sm tracking-wider text-[var(--color-text-primary)]">CONTACT</span>
		<span class="h-px flex-1 bg-[var(--color-border)]"></span>
	</div>

	<div class="grid flex-1 gap-12 lg:grid-cols-2">
		<div class="flex flex-col justify-center">
			<p class="mb-6 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
				Interested in working together or have something in mind?
				I'm always open to discussing new projects, ideas, or opportunities.
			</p>

			<div class="flex items-center gap-3">
				<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
				<span class="font-mono text-xs text-emerald-400/80">Available for new opportunities</span>
			</div>
		</div>

		<div class="flex flex-col justify-center space-y-3">
			<a
				href="mailto:louigiecads143@gmail.com"
				class="group flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 transition-all hover:border-[var(--color-border-hover)]"
			>
				<div>
					<span class="mb-1 block font-mono text-[10px] text-[var(--color-text-muted)]">EMAIL</span>
					<span class="text-sm text-[var(--color-text-primary)]">louigiecads143@gmail.com</span>
				</div>
				<span
					class="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
					>&rarr;</span
				>
			</a>

			<a
				href="https://www.linkedin.com/in/louie1221/"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 transition-all hover:border-[var(--color-border-hover)]"
			>
				<div>
					<span class="mb-1 block font-mono text-[10px] text-[var(--color-text-muted)]">LINKEDIN</span>
					<span class="text-sm text-[var(--color-text-primary)]">linkedin.com/in/louie1221</span>
				</div>
				<span
					class="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
					>&nearr;</span
				>
			</a>

			<a
				href="https://github.com/LouieCads"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 transition-all hover:border-[var(--color-border-hover)]"
			>
				<div>
					<span class="mb-1 block font-mono text-[10px] text-[var(--color-text-muted)]">GITHUB</span>
					<span class="text-sm text-[var(--color-text-primary)]">github.com/LouieCads</span>
				</div>
				<span
					class="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
					>&nearr;</span
				>
			</a>
		</div>
	</div>

	<footer class="mt-auto border-t border-[var(--color-border)] pt-4">
		<div class="flex items-center justify-between">
			<span class="font-mono text-[10px] text-[var(--color-text-muted)]"
				>&copy; {new Date().getFullYear()} Louigie</span
			>
			<span class="font-mono text-[10px] text-[var(--color-text-muted)]">Built with precision.</span>
		</div>
	</footer>
</div>
