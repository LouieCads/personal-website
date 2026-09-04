<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import BlogSection from '$lib/components/scroll/BlogSection.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog | Louigie Caminoy</title>
</svelte:head>

<Shell section="blog">
	<BackBar anchor="blog" title="BLOG" />
	<BlogSection episodeItems={data.episodes} articleItems={data.articles} />
</Shell>
