<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import AboutSection from '$lib/components/scroll/AboutSection.svelte';
</script>

<SEO
	title="About | Louigie Caminoy"
	description="Louigie Caminoy is a multidisciplinary technopreneur and AI Engineer interested in AI and Blockchain. Co-Founder and CTO of iSkolar, AI Lead of AWS Learning Club - Heron, and a BS Computer Science student at the University of Makati."
	path="/about"
/>

<Shell section="about">
	<h1 class="sr-only">About Louigie Caminoy</h1>
	<BackBar anchor="about" title="ABOUT" />
	<AboutSection />
</Shell>
