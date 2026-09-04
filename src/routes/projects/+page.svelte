<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import ProjectsSection from '$lib/components/scroll/ProjectsSection.svelte';
</script>

<svelte:head>
	<title>Projects | Louigie Caminoy</title>
</svelte:head>

<Shell section="projects">
	<BackBar anchor="projects" title="PROJECTS" />
	<ProjectsSection />
</Shell>
