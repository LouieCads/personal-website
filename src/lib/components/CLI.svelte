<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}

	let { navigate }: Props = $props();

	let input = $state('');
	let feedback = $state('');
	let feedbackType = $state<'error' | 'info'>('info');
	let showHelp = $state(false);
	let feedbackTimeout: ReturnType<typeof setTimeout>;
	let inputEl: HTMLInputElement;

	const allCommands = [
		'/home',
		'/about',
		'/projects',
		'/contact',
		'/commands',
		'/resume',
		'/github',
		'/linkedin',
		'/instagram',
		'/facebook',
		'/email',
		'/help',
		'/clear'
	];

	const navCommands: Record<string, string> = {
		'/home': 'home',
		'/about': 'about',
		'/projects': 'projects',
		'/contact': 'contact',
		'/commands': 'commands'
	};

	const externalCommands: Record<string, () => void> = {
		'/resume': () => window.open('/resume.pdf', '_blank'),
		'/github': () => window.open('https://github.com/LouieCads', '_blank'),
		'/linkedin': () => window.open('https://www.linkedin.com/in/louie1221/', '_blank'),
		'/instagram': () => window.open('https://www.instagram.com/louie.21_/', '_blank'),
		'/facebook': () => window.open('https://www.facebook.com/louielocktorius21', '_blank'),
		'/email': () => window.open('https://mail.google.com/mail/u/0/#all?compose=new', '_blank')
	};

	let showAllCommandsSuggestion = $derived.by(() => {
		const trimmed = input.trim().toLowerCase();
		return trimmed === '/';
	});

	let suggestion = $derived.by(() => {
		const trimmed = input.trim().toLowerCase();
		if (!trimmed) return '';
		if (trimmed === '/') return '';
		if (trimmed.length < 2) return '';
		const match = allCommands.find((cmd) => cmd.startsWith(trimmed) && cmd !== trimmed);
		return match ?? '';
	});

	function showFeedback(msg: string, type: 'error' | 'info' = 'error') {
		clearTimeout(feedbackTimeout);
		feedback = msg;
		feedbackType = type;
		showHelp = false;
		feedbackTimeout = setTimeout(() => (feedback = ''), 6000);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const cmd = input.trim().toLowerCase();
		if (!cmd) return;

		if (cmd === '/help') {
			clearTimeout(feedbackTimeout);
			showHelp = true;
			feedback = '';
			feedbackTimeout = setTimeout(() => (showHelp = false), 5500);
			input = '';
			return;
		}

		if (cmd === '/clear') {
			feedback = '';
			showHelp = false;
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

		showFeedback(`command not found: ${cmd}. type /help for available commands`);
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
	{#if showAllCommandsSuggestion}
		<div class="absolute bottom-full left-0 right-0 border-b border-t border-(--color-border) bg-(--color-surface) px-24 py-2">
			<span class="font-mono text-xs text-(--color-text-secondary)">
				<b>Navigation:</b> /home /about /projects /contact /commands
				<span class="mx-2"></span>
				<b>External:</b> /resume /github /linkedin /instagram /facebook /email
			</span>
		</div>
	{:else if suggestion}
		<div class="absolute bottom-full left-0 right-0 border-b border-t border-(--color-border) bg-(--color-surface) px-24 py-2">
			<span class="font-mono text-xs text-(--color-text-primary)">
				{suggestion}
				<span class="ml-2 text-[10px] opacity-60">TAB to complete</span>
			</span>
		</div>
	{:else if showHelp}
		<div class="absolute bottom-full left-0 right-0 border-b border-t border-(--color-border) bg-(--color-surface) px-24 py-2">
			<span class="font-mono text-xs text-(--color-text-secondary)">
				<b>Navigation:</b> /home /about /projects /contact /commands
				<span class="mx-2"></span>
				<b>External:</b> /resume /github /linkedin /instagram /facebook /email
			</span>
		</div>
	{:else if feedback}
		<div class="absolute bottom-full left-0 right-0 border-b border-t border-(--color-border) bg-(--color-surface) px-24 py-2">
			<span
				class="font-mono text-xs {feedbackType === 'error'
					? 'text-red-400/80'
					: 'text-(--color-text-secondary)'}"
			>
				{feedback}
			</span>
		</div>
	{/if}

	<div class="px-24">
		<form onsubmit={handleSubmit} class="flex items-center gap-2 py-4">
			<span class="font-mono text-sm text-(--color-text-secondary)">type-commands-to-know-me</span>
			<span class="font-mono text-sm text-(--color-text-secondary)">~</span>
			<span class="font-mono text-sm text-(--color-text-primary)">$</span>
			<input
				bind:this={inputEl}
				type="text"
				bind:value={input}
				onkeydown={handleKeydown}
				placeholder="type /help for commands"
				class="flex-1 border-none bg-transparent font-mono text-sm text-(--color-text-primary) caret-(--color-text-primary) placeholder-(--color-text-muted) outline-none focus:ring-0"
				spellcheck="false"
				autocomplete="off"
				aria-label="Command input"
			/>
			<button
				type="button"
				onclick={toggleTheme}
				class="ml-2 flex shrink-0 cursor-pointer items-center justify-center font-mono text-2xl text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
				aria-label="Toggle theme"
			>{$theme === 'dark' ? '☀' : '☽'}</button>
		</form>
	</div>
</div>