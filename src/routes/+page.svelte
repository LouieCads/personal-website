<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/scroll/HeroSection.svelte';
	import AboutSection from '$lib/components/scroll/AboutSection.svelte';
	import ProjectsSection from '$lib/components/scroll/ProjectsSection.svelte';
	import ExperienceSection from '$lib/components/scroll/ExperienceSection.svelte';
	import BlogSection from '$lib/components/scroll/BlogSection.svelte';
	import GitHubSection from '$lib/components/scroll/GitHubSection.svelte';

	let { data } = $props();
</script>

<SEO
	title="Louigie Caminoy - Multidisciplinary Technopreneur"
	description="Developer and product builder focused on systems, architecture, and execution."
/>

<!--
  The home page is a preview surface: every section shows at most three items in
  a single row and hands off to its own page for the full record.
-->
<Shell home>
	<HeroSection githubContributions={data.github?.total} />
	<AboutSection preview />
	<ProjectsSection preview />
	<ExperienceSection preview />
	<BlogSection preview feedItems={data.feed} />
	<GitHubSection graph={data.github} />
</Shell>
