<script lang="ts">
	import { theme } from '$lib/stores/theme';

	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();

	const staticCommands = [
		{ cmd: '/home',     desc: 'navigate to home page' },
		{ cmd: '/about',    desc: 'navigate to about page' },
		{ cmd: '/projects', desc: 'navigate to projects page' },
		{ cmd: '/contact',  desc: 'navigate to contact page' },
		{ cmd: '/commands', desc: 'view all commands page' },
		{ cmd: '/help',     desc: 'list available commands' }
	];

	const actionCommands = [
		{ cmd: '/resume',    desc: 'open resume PDF',          action: () => window.open('/resume.pdf', '_blank') },
		{ cmd: '/github',    desc: 'open GitHub profile',      action: () => window.open('https://github.com/LouieCads', '_blank') },
		{ cmd: '/linkedin',  desc: 'open LinkedIn profile',    action: () => window.open('https://www.linkedin.com/in/louie1221/', '_blank') },
		{ cmd: '/instagram', desc: 'open Instagram profile',   action: () => window.open('https://www.instagram.com/louie.21_/', '_blank') },
		{ cmd: '/facebook',  desc: 'open Facebook profile',    action: () => window.open('https://www.facebook.com/louielocktorius21', '_blank') },
		{ cmd: '/email',     desc: 'open email client',        action: () => window.open('https://mail.google.com/mail/u/0/#all?compose=new', '_blank') },
	];

	const themeCommands = [
		{ cmd: '/light', desc: 'enable light mode', action: () => theme.set('light') },
		{ cmd: '/dark',  desc: 'enable dark mode',  action: () => theme.set('dark') },
	];
</script>

<div class="view-enter flex h-full flex-col px-4 py-4 gap-4 sm:px-8 sm:py-6 sm:gap-5 md:px-16 md:py-8 md:gap-6 lg:px-18">
	<div class="mb-2 flex items-center gap-3 sm:mb-4 sm:gap-4 md:mb-6">
		<button
			onclick={() => navigate('home')}
			class="cursor-pointer font-mono text-[11px] tracking-widest text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-2xl text-(--color-accent)">04</span>
		<span class="font-mono text-sm tracking-wider text-(--color-text-primary)">COMMANDS</span>
		<span class="h-px flex-1 bg-(--color-border)"></span>
	</div>

	<div class="flex flex-1 flex-col justify-center overflow-y-auto">
		<p class="mb-4 font-mono text-sm text-(--color-text-muted) sm:mb-6">
			Type any command in the terminal below, or click an actionable one directly.
		</p>

		<div class="grid gap-4 lg:grid-cols-3">
			<!-- Navigation / utility commands -->
			<div class="border border-(--color-border) bg-(--color-surface-card)">
				<div class="flex items-center gap-2 border-b border-(--color-border) px-4 py-3">
					<span class="font-mono text-[10px] tracking-widest text-(--color-text-muted)">NAVIGATION</span>
					<span class="h-px flex-1 bg-(--color-border)"></span>
					<span class="font-mono text-[10px] text-(--color-text-muted)">{staticCommands.length}</span>
				</div>
				<div class="divide-y divide-(--color-border)">
					{#each staticCommands as { cmd, desc } (cmd)}
						<div class="flex items-center gap-4 px-4 py-3">
							<code class="w-28 shrink-0 font-mono text-sm text-(--color-text-secondary)">{cmd}</code>
							<span class="flex-1 font-mono text-xs text-(--color-text-muted)">{desc}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- External / actionable commands -->
			<div class="border border-(--color-border) bg-(--color-surface-card)">
				<div class="flex items-center gap-2 border-b border-(--color-border) px-4 py-3">
					<span class="font-mono text-[10px] tracking-widest text-(--color-text-muted)">EXTERNAL</span>
					<span class="h-px flex-1 bg-(--color-border)"></span>
					<span class="font-mono text-[10px] text-(--color-text-muted)">{actionCommands.length}</span>
				</div>
				<div class="divide-y divide-(--color-border)">
					{#each actionCommands as { cmd, desc, action } (cmd)}
						<button
							onclick={action}
							class="group flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-(--color-surface)"
						>
							<code class="w-28 shrink-0 font-mono text-sm text-(--color-accent)">{cmd}</code>
							<span class="flex-1 font-mono text-xs text-(--color-text-muted) transition-colors group-hover:text-(--color-text-secondary)">{desc}</span>
							<span class="font-mono text-[10px] text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100">&nearr;</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Theme commands -->
			<div class="border border-(--color-border) bg-(--color-surface-card)">
				<div class="flex items-center gap-2 border-b border-(--color-border) px-4 py-3">
					<span class="font-mono text-[10px] tracking-widest text-(--color-text-muted)">THEME</span>
					<span class="h-px flex-1 bg-(--color-border)"></span>
					<span class="font-mono text-[10px] text-(--color-text-muted)">{themeCommands.length}</span>
				</div>
				<div class="divide-y divide-(--color-border)">
					{#each themeCommands as { cmd, desc, action } (cmd)}
						<button
							onclick={action}
							class="group flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-(--color-surface)"
						>
							<code class="w-28 shrink-0 font-mono text-sm text-(--color-accent)">{cmd}</code>
							<span class="flex-1 font-mono text-xs text-(--color-text-muted) transition-colors group-hover:text-(--color-text-secondary)">{desc}</span>
							<span class="font-mono text-[10px] text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100">&check;</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<footer class="mt-auto border-t border-(--color-border) pt-4">
		<div class="flex items-center justify-between">
			<span class="font-mono text-[10px] text-(--color-text-muted)">&copy; {new Date().getFullYear()} Louigie</span>
			<span class="font-mono text-[10px] text-(--color-text-muted)">Built with precision.</span>
		</div>
	</footer>
</div>
