<script lang="ts">
	/**
	 * Per-route head tags. app.html carries the tags that never change
	 * (icons, fonts, JSON-LD, og:type/site_name); everything that must be
	 * unique per route — title, description, canonical, og:url — lives here
	 * so no two pages ever ship duplicate or identical head metadata.
	 */
	interface Props {
		title: string;
		description: string;
		/** path from site root, e.g. '/about'; omit for the home page */
		path?: string;
		/** true for pages with no unique indexable content (e.g. a nav utility page) */
		noindex?: boolean;
	}
	let { title, description, path = '', noindex = false }: Props = $props();

	const SITE_URL = 'https://louigiecaminoy.com';
	const ogImage = `${SITE_URL}/og-image.png`;
	const url = $derived(`${SITE_URL}${path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}

	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Louigie Caminoy" />

	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
