<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import RecognitionsSection from '$lib/components/scroll/RecognitionsSection.svelte';
</script>

<SEO
	title="Recognitions | Louigie Caminoy"
	description="Awards and honors: TikTok Shop SEA Case Challenge champion, Stellar PH100 2026 honoree, INFOTECHNOLYMPICS 2026 champion, and more."
	path="/recognitions"
/>
<Shell section="recognitions">
	<h1 class="sr-only">Recognitions — Louigie Caminoy</h1>
	<BackBar anchor="recognitions" title="RECOGNITIONS" />
	<RecognitionsSection />
</Shell>
