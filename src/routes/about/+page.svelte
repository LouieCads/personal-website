<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import AboutSection from '$lib/components/scroll/AboutSection.svelte';
</script>

<svelte:head>
	<title>About | Louigie Caminoy</title>
</svelte:head>

<Shell section="about">
	<BackBar anchor="about" title="ABOUT" />
	<AboutSection />
</Shell>
