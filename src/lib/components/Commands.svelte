<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();

	const commands = [
		{ cmd: '/home',     desc: 'navigate to home',        action: null },
		{ cmd: '/about',    desc: 'navigate to about',       action: null },
		{ cmd: '/projects', desc: 'navigate to projects',    action: null },
		{ cmd: '/contact',  desc: 'navigate to contact',     action: null },
		{ cmd: '/commands', desc: 'view all commands',       action: null },
		{ cmd: '/resume',   desc: 'open resume PDF',         action: () => window.open('/resume.pdf', '_blank') },
		{ cmd: '/github',   desc: 'open GitHub profile',     action: () => window.open('https://github.com/LouieCads', '_blank') },
		{ cmd: '/linkedin', desc: 'open LinkedIn profile',   action: () => window.open('https://www.linkedin.com/in/louie1221/', '_blank') },
		{ cmd: '/email',    desc: 'open email client',       action: () => window.open('https://mail.google.com/mail/u/0/#all?compose=new', '_blank') },
		{ cmd: '/help',     desc: 'list available commands', action: null },
	];
</script>

<div class="view-enter flex h-full flex-col px-18 py-8">
	<div class="mb-8 flex items-center gap-4">
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

	<div class="flex flex-1 flex-col justify-center">
		<p class="mb-6 font-mono text-xs text-(--color-text-muted)">
			Type any command in the terminal below, or click an actionable one directly.
		</p>

		<div class="border border-(--color-border) bg-(--color-surface-card)">
			<div class="flex items-center gap-2 border-b border-(--color-border) px-4 py-3">
				<span class="font-mono text-[10px] tracking-widest text-(--color-text-muted)">ALL COMMANDS</span>
				<span class="h-px flex-1 bg-(--color-border)"></span>
				<span class="font-mono text-[10px] text-(--color-text-muted)">{commands.length} total</span>
			</div>

			<div class="divide-y divide-(--color-border)">
				{#each commands as { cmd, desc, action } (cmd)}
					{#if action}
						<button
							onclick={action}
							class="group flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-(--color-surface)"
						>
							<code class="w-28 shrink-0 font-mono text-xs text-(--color-accent)">{cmd}</code>
							<span class="flex-1 font-mono text-[11px] text-(--color-text-muted) transition-colors group-hover:text-(--color-text-secondary)">{desc}</span>
							<span class="font-mono text-[10px] text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100">&nearr;</span>
						</button>
					{:else}
						<div class="flex items-center gap-4 px-4 py-3">
							<code class="w-28 shrink-0 font-mono text-xs text-(--color-text-secondary)">{cmd}</code>
							<span class="flex-1 font-mono text-[11px] text-(--color-text-muted)">{desc}</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
