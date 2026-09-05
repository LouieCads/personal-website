<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { scrollToId, scrollToTop } from '$lib/scroll';
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import Commands from '$lib/components/Commands.svelte';

	function navigate(view: string) {
		void goto(resolve('/')).then(() => {
			if (view === 'home') scrollToTop();
			else scrollToId(view);
		});
	}
</script>

<!-- A nav utility, not unique indexable content: kept out of the sitemap and noindexed. -->
<SEO
	title="Commands | Louigie Caminoy"
	description="Command palette for navigating Louigie Caminoy's portfolio."
	path="/commands"
	noindex
/>

<Shell section="">
	<h1 class="sr-only">Commands — Louigie Caminoy</h1>
	<BackBar anchor="hero" title="COMMANDS" />
	<div class="mx-auto w-full max-w-[1400px]">
		<Commands {navigate} />
	</div>
</Shell>
