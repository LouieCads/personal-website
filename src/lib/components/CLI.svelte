<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}

	let { navigate }: Props = $props();

	let input = $state('');
	let feedback = $state('');
	let feedbackType = $state<'error' | 'info'>('info');
	let feedbackTimeout: ReturnType<typeof setTimeout>;
	let inputEl: HTMLInputElement;

	const allCommands = [
		'/home',
		'/about',
		'/projects',
		'/contact',
		'/resume',
		'/github',
		'/linkedin',
		'/email',
		'/help',
		'/clear'
	];

	const navCommands: Record<string, string> = {
		'/home': 'home',
		'/about': 'about',
		'/projects': 'projects',
		'/contact': 'contact'
	};

	const externalCommands: Record<string, () => void> = {
		'/resume': () => window.open('/resume.pdf', '_blank'),
		'/github': () => window.open('https://github.com/LouieCads', '_blank'),
		'/linkedin': () => window.open('https://www.linkedin.com/in/louie1221/', '_blank'),
		'/email': () => (window.location.href = 'mailto:louigiecads143@gmail.com')
	};

	let suggestion = $derived.by(() => {
		const trimmed = input.trim().toLowerCase();
		if (!trimmed || trimmed.length < 2) return '';
		const match = allCommands.find((cmd) => cmd.startsWith(trimmed) && cmd !== trimmed);
		return match ?? '';
	});

	function showFeedback(msg: string, type: 'error' | 'info' = 'error') {
		clearTimeout(feedbackTimeout);
		feedback = msg;
		feedbackType = type;
		feedbackTimeout = setTimeout(() => (feedback = ''), 4000);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const cmd = input.trim().toLowerCase();
		if (!cmd) return;

		if (cmd === '/help') {
			showFeedback(
				'Navigation: /home /about /projects /contact  |  External: /resume /github /linkedin /email',
				'info'
			);
			input = '';
			return;
		}

		if (cmd === '/clear') {
			feedback = '';
			input = '';
			return;
		}

		if (cmd in navCommands) {
			feedback = '';
			navigate(navCommands[cmd]);
			input = '';
			return;
		}

		if (cmd in externalCommands) {
			feedback = '';
			externalCommands[cmd]();
			input = '';
			return;
		}

		showFeedback(`command not found: ${cmd} — type /help for available commands`);
		input = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Tab' && suggestion) {
			e.preventDefault();
			input = suggestion;
		}
		if (e.key === 'Escape') {
			input = '';
			feedback = '';
		}
	}

	function refocus() {
		inputEl?.focus();
	}

	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';

	function toggleTheme() {
		theme.update((t) => (t === 'light' ? 'dark' : 'light'));
	}

	onMount(() => {
		inputEl?.focus();
		document.addEventListener('click', refocus);
		return () => document.removeEventListener('click', refocus);
	});
</script>

<div class="relative z-40 border-t border-(--color-border) bg-(--color-surface)">
	{#if suggestion}
		<div class="absolute bottom-full left-0 right-0 border-b border-t border-(--color-border) bg-(--color-surface) px-18 py-2">
			<span class="font-mono text-xs text-(--color-text-primary)">
				{suggestion}
				<span class="ml-2 text-[10px] opacity-60">TAB to complete</span>
			</span>
		</div>
	{:else if feedback}
		<div class="absolute bottom-full left-0 right-0 border-b border-t border-(--color-border) bg-(--color-surface) px-18 py-2">
			<span
				class="font-mono text-xs {feedbackType === 'error'
					? 'text-red-400/80'
					: 'text-(--color-text-secondary)'}"
			>
				{feedback}
			</span>
		</div>
	{/if}

	<div class="px-18">
		<form onsubmit={handleSubmit} class="flex items-center gap-2 py-4">
			<span class="font-mono text-sm text-(--color-text-secondary)">type-commands-to-know-me</span>
			<span class="font-mono text-sm text-(--color-text-secondary)">~</span>
			<span class="font-mono text-sm text-(--color-text-primary)">$</span>
			<input
				bind:this={inputEl}
				type="text"
				bind:value={input}
				onkeydown={handleKeydown}
				placeholder="/help for commands"
				class="flex-1 border-none bg-transparent font-mono text-sm text-(--color-text-primary) caret-(--color-text-primary) placeholder-(--color-text-muted) outline-none focus:ring-0"
				spellcheck="false"
				autocomplete="off"
				aria-label="Command input"
			/>
			<button
				type="button"
				onclick={toggleTheme}
				class="ml-2 flex shrink-0 cursor-pointer items-center justify-center font-mono text-base text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
				aria-label="Toggle theme"
			>{$theme === 'dark' ? '☀' : '☽'}</button>
		</form>
	</div>
</div>
