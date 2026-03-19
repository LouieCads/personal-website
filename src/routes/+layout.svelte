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
	<link rel="icon" href="/profile.jpg" type="image/jpeg" />
</svelte:head>

{@render children()}
