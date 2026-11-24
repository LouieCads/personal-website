<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import ProjectsSection from '$lib/components/scroll/ProjectsSection.svelte';
	import { projects } from '$lib/data/portfolio';

	const SITE_URL = 'https://www.louigiecaminoy.com';
	const PAGE_URL = `${SITE_URL}/projects`;

	// Answer engines read the project list as an ordered set of named, linked works.
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': PAGE_URL,
		url: PAGE_URL,
		name: 'Projects | Louigie Caminoy',
		about: { '@id': `${SITE_URL}/#person` },
		mainEntity: {
			'@type': 'ItemList',
			name: 'Projects by Louigie Caminoy',
			numberOfItems: projects.length,
			itemListElement: projects.map((p, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type': 'WebSite',
					name: p.title,
					description: p.description,
					url: p.link,
					creator: { '@id': `${SITE_URL}/#person` }
				}
			}))
		}
	};
	// `<` is escaped so no string in the data can close the script tag early.
	const jsonLdScript =
		`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</` +
		'script>';
</script>

<SEO
	title="Projects | Louigie Caminoy"
	description="Projects by Louigie Caminoy: iSkolar scholarship platform, Academy, Vocation internships, Configains fitness coaching, Fundr Studio, and the USMO website."
	path="/projects"
/>
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, escaped JSON-LD -->
	{@html jsonLdScript}
</svelte:head>

<Shell section="projects">
	<h1 class="sr-only">Projects by Louigie Caminoy</h1>
	<BackBar anchor="projects" title="PROJECTS" />
	<ProjectsSection />
</Shell>
