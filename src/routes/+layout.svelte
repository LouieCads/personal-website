<script lang="ts">
	import './layout.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// Apply stored theme immediately to avoid flash
		const stored = localStorage.getItem('theme') ?? 'light';
		if (stored === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		theme.set(stored as 'light' | 'dark');
	});
</script>

<svelte:head>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
</svelte:head>

{@render children()}
