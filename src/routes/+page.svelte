<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import HeroSection from '$lib/components/scroll/HeroSection.svelte';
	import AboutSection from '$lib/components/scroll/AboutSection.svelte';
	import ProjectsSection from '$lib/components/scroll/ProjectsSection.svelte';
	import ExperienceSection from '$lib/components/scroll/ExperienceSection.svelte';
	import BlogSection from '$lib/components/scroll/BlogSection.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Louigie Caminoy | Multidisciplinary Technopreneur</title>
	<meta
		name="description"
		content="CTO, blockchain developer and project manager building decentralized systems and scalable infrastructure."
	/>
</svelte:head>

<!--
  The home page is a preview surface: every section shows at most three items in
  a single row and hands off to its own page for the full record.
-->
<Shell home>
	<HeroSection />
	<AboutSection preview />
	<ProjectsSection preview />
	<ExperienceSection preview />
	<BlogSection preview feedItems={data.feed} />
</Shell>
