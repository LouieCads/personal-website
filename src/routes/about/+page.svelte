<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import AboutSection from '$lib/components/scroll/AboutSection.svelte';
</script>

<SEO
	title="About | Louigie Caminoy"
	description="A software engineering student and technopreneur in Metro Manila, building across development, design, and product with a focus on blockchain and AI."
	path="/about"
/>

<Shell section="about">
	<h1 class="sr-only">About Louigie Caminoy</h1>
	<BackBar anchor="about" title="ABOUT" />
	<AboutSection />
</Shell>
