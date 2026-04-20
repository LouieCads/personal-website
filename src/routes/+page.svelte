<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Project.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Commands from '$lib/components/Commands.svelte';
	import CLI from '$lib/components/CLI.svelte';

	let currentView = $state('home');

	function navigate(view: string) {
		currentView = view;
	}

	const sectionOrder = ['about', 'projects', 'contact'];

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && currentView !== 'home') {
			currentView = 'home';
			return;
		}

		const idx = sectionOrder.indexOf(currentView);
		if (idx === -1) return;

		if (event.key === 'ArrowLeft' && idx > 0) {
			currentView = sectionOrder[idx - 1];
		} else if (event.key === 'ArrowRight' && idx < sectionOrder.length - 1) {
			currentView = sectionOrder[idx + 1];
		}
	}
</script>

<svelte:head>
	<title>Louigie Caminoy — CTO, Blockchain Developer, Project Manager</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-dvh flex-col overflow-hidden bg-(--color-surface)">
	<main class="relative min-h-0 flex-1 overflow-hidden">
		{#key currentView}
			{#if currentView === 'home'}
				<div class="absolute inset-0">
					<Hero {navigate} />
				</div>
			{:else if currentView === 'about'}
				<div class="absolute inset-0">
					<About {navigate} />
				</div>
			{:else if currentView === 'projects'}
				<div class="absolute inset-0">
					<Projects {navigate} />
				</div>
			{:else if currentView === 'contact'}
				<div class="absolute inset-0">
					<Contact {navigate} />
				</div>
			{:else if currentView === 'commands'}
				<div class="absolute inset-0">
					<Commands {navigate} />
				</div>
			{/if}
		{/key}
	</main>

	<CLI {navigate} />
</div>
