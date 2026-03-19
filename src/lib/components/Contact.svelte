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
			class="cursor-pointer font-mono text-[11px] tracking-widest text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-2xl text-(--color-accent)">03</span>
		<span class="font-mono text-sm tracking-wider text-(--color-text-primary)">CONTACT</span>
		<span class="h-px flex-1 bg-(--color-border)"></span>
	</div>

	<div class="grid flex-1 gap-12 lg:grid-cols-2">
		<div class="flex flex-col justify-center">
			<p class="mb-6 max-w-md text-base leading-relaxed text-(--color-text-secondary)">
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
				href="https://mail.google.com/mail/u/0/#all?compose=new"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-4 border border-(--color-border) bg-(--color-surface-card) p-5 transition-all hover:border-(--color-border-hover)"
			>
				<svg class="h-5 w-5 shrink-0 text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<rect x="2" y="4" width="20" height="16" rx="2"/>
					<path d="M22 4L12 13 2 4"/>
				</svg>
				<div class="flex-1">
					<span class="mb-1 block font-mono text-[10px] text-(--color-text-muted)">EMAIL</span>
					<span class="text-sm text-(--color-text-primary)">louigiecads143@gmail.com</span>
				</div>
				<span class="text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">&rarr;</span>
			</a>

			<a
				href="https://www.linkedin.com/in/louie1221/"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-4 border border-(--color-border) bg-(--color-surface-card) p-5 transition-all hover:border-(--color-border-hover)"
			>
				<svg class="h-5 w-5 shrink-0 text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
				</svg>
				<div class="flex-1">
					<span class="mb-1 block font-mono text-[10px] text-(--color-text-muted)">LINKEDIN</span>
					<span class="text-sm text-(--color-text-primary)">linkedin.com/in/louie1221</span>
				</div>
				<span class="text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">&nearr;</span>
			</a>

			<a
				href="https://github.com/LouieCads"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-4 border border-(--color-border) bg-(--color-surface-card) p-5 transition-all hover:border-(--color-border-hover)"
			>
				<svg class="h-5 w-5 shrink-0 text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
				</svg>
				<div class="flex-1">
					<span class="mb-1 block font-mono text-[10px] text-(--color-text-muted)">GITHUB</span>
					<span class="text-sm text-(--color-text-primary)">github.com/LouieCads</span>
				</div>
				<span class="text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">&nearr;</span>
			</a>
		</div>
	</div>

	<footer class="mt-auto border-t border-(--color-border) pt-4">
		<div class="flex items-center justify-between">
			<span class="font-mono text-[10px] text-(--color-text-muted)">&copy; {new Date().getFullYear()} Louigie</span>
			<span class="font-mono text-[10px] text-(--color-text-muted)">Built with precision.</span>
		</div>
	</footer>
</div>