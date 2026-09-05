<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import BlogSection from '$lib/components/scroll/BlogSection.svelte';

	let { data } = $props();
</script>

<SEO
	title="Blog | Louigie Caminoy"
	description="Comfort Kills Greatness podcast episodes and articles on blockchain, engineering, and building with discipline."
	path="/blog"
/>

<Shell section="blog">
	<h1 class="sr-only">Blog — Louigie Caminoy</h1>
	<BackBar anchor="blog" title="BLOG" />
	<BlogSection episodeItems={data.episodes} articleItems={data.articles} />
</Shell>
