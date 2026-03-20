<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();

	const EMAIL = 'louigiecads143@gmail.com';
	let copied = $state(false);
	let copiedTimeout: ReturnType<typeof setTimeout>;

	async function copyEmail(e: MouseEvent) {
		e.preventDefault();
		await navigator.clipboard.writeText(EMAIL);
		clearTimeout(copiedTimeout);
		copied = true;
		copiedTimeout = setTimeout(() => (copied = false), 2500);
		setTimeout(() => window.open('https://mail.google.com/mail/u/0/#all?compose=new', '_blank'), 600);
	}
</script>

<div class="view-enter flex h-full flex-col px-4 py-4 sm:px-8 sm:py-6 md:px-16 md:py-8 lg:px-18">
	<div class="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4 md:mb-8">
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

	<div class="grid flex-1 gap-6 overflow-y-auto sm:gap-8 md:gap-12 lg:grid-cols-2">
		<div class="flex flex-col justify-center">
			<div class="mb-8">
				<p class="mb-3 font-mono text-md font-semibold text-(--color-text-primary)">LET'S TALK ABOUT:</p>
				<ul class="space-y-2 text-sm text-(--color-text-secondary)">
					<li>Emerging Technologies</li>
					<li>Fitness</li>
					<li>Collaborations</li>
					<li>Partnerships</li>
					<li>Academics</li>
					<li>Tech, Crypto, Networking Events</li>
					<li>Life</li>
				</ul>
			</div>

			<p class="mb-6 max-w-md text-base leading-relaxed text-(--color-text-secondary)">
				Interested in working together or have something in mind?
				I'm always open to discussing new opportunities, projects, or ideas.
			</p>

			<div class="flex items-center gap-3">
				<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-(--color-accent)"></span>
				<span class="font-mono text-xs text-(--color-accent)">Available for new opportunities and collaborations</span>
			</div>
		</div>

		<div class="flex flex-col justify-center space-y-3">
			<a
				href="https://mail.google.com/mail/u/0/#all?compose=new"
				onclick={copyEmail}
				class="group flex items-center gap-4 border border-(--color-border) bg-(--color-surface-card) p-5 transition-all hover:border-(--color-border-hover)"
			>
				<svg class="h-5 w-5 shrink-0 text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<rect x="2" y="4" width="20" height="16" rx="2"/>
					<path d="M22 4L12 13 2 4"/>
				</svg>
				<div class="flex-1">
					<span class="mb-1 block font-mono text-[10px] text-(--color-text-muted)">EMAIL</span>
					<span class="text-sm text-(--color-text-primary)">{EMAIL}</span>
				</div>
				{#if copied}
					<span class="font-mono text-[10px] text-(--color-accent)">copied!</span>
				{:else}
					<span class="text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">&rarr;</span>
				{/if}
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
				href="https://www.facebook.com/louielocktorius21"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-4 border border-(--color-border) bg-(--color-surface-card) p-5 transition-all hover:border-(--color-border-hover)"
			>
				<svg class="h-5 w-5 shrink-0 text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)" viewBox="0 0 24 24" fill="currentColor">
					<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
				</svg>
				<div class="flex-1">
					<span class="mb-1 block font-mono text-[10px] text-(--color-text-muted)">FACEBOOK</span>
					<span class="text-sm text-(--color-text-primary)">facebook.com/louielocktorius21</span>
				</div>
				<span class="text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">&nearr;</span>
			</a>

			<a
				href="https://www.instagram.com/louie.21_/"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-4 border border-(--color-border) bg-(--color-surface-card) p-5 transition-all hover:border-(--color-border-hover)"
			>
				<svg class="h-5 w-5 shrink-0 text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
				</svg>
				<div class="flex-1">
					<span class="mb-1 block font-mono text-[10px] text-(--color-text-muted)">INSTAGRAM</span>
					<span class="text-sm text-(--color-text-primary)">instagram.com/louie.21_</span>
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
