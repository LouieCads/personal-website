<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import ProjectsSection from '$lib/components/scroll/ProjectsSection.svelte';
</script>

<SEO
	title="Projects | Louigie Caminoy"
	description="Selected projects spanning blockchain platforms, mobile apps, and web products — from iSkolar to Finsharc."
	path="/projects"
/>

<Shell section="projects">
	<h1 class="sr-only">Projects by Louigie Caminoy</h1>
	<BackBar anchor="projects" title="PROJECTS" />
	<ProjectsSection />
</Shell>
