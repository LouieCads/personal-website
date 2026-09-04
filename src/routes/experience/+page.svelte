<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import ExperienceSection from '$lib/components/scroll/ExperienceSection.svelte';
</script>

<svelte:head>
	<title>Experience | Louigie Caminoy</title>
</svelte:head>

<Shell section="experience">
	<BackBar anchor="experience" title="EXPERIENCE" />
	<ExperienceSection />
</Shell>
