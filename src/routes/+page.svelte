<script lang="ts">
	import ParticleBackground from '$lib/components/ParticleBackground.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import CLI from '$lib/components/CLI.svelte';
</script>

<svelte:head>
	<title>Louigie — CTO, Blockchain Developer, Project Manager</title>
</svelte:head>

<ParticleBackground />
<Nav />

<main class="pb-16">
	<Hero />
	<About />
	<Projects />
	<Contact />
</main>

<CLI />
