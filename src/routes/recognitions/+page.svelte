<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import RecognitionsSection from '$lib/components/scroll/RecognitionsSection.svelte';
	import { recognitions, formatMonthLong, fullAward } from '$lib/data/recognitions';

	const SITE_URL = 'https://www.louigiecaminoy.com';
	const PAGE_URL = `${SITE_URL}/recognitions`;

	/**
	 * Structured data for search and answer engines: the page is a profile of
	 * one person, whose awards are listed both as plain statements (Person.award)
	 * and as an ordered list of the events behind them, newest first.
	 */
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': PAGE_URL,
		url: PAGE_URL,
		name: 'Recognitions | Louigie Caminoy',
		mainEntity: {
			'@type': 'Person',
			name: 'Louigie Caminoy',
			url: SITE_URL,
			award: recognitions.map(
				(r) => `${fullAward(r)}, ${r.event} (${r.organizer}, ${formatMonthLong(r.date)})`
			)
		},
		hasPart: {
			'@type': 'ItemList',
			name: 'Recognitions of Louigie Caminoy',
			itemListOrder: 'https://schema.org/ItemListOrderDescending',
			numberOfItems: recognitions.length,
			itemListElement: recognitions.map((r, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: `${fullAward(r)}, ${r.event}`,
				item: {
					'@type': 'Event',
					name: r.event,
					startDate: r.date,
					description: `${fullAward(r)}. ${r.description}`,
					location: {
						'@type': 'Place',
						name: r.venue,
						address: { '@type': 'PostalAddress', addressCountry: 'PH' }
					},
					organizer: { '@type': 'Organization', name: r.organizer },
					...(r.url ? { url: r.url } : {}),
					...(r.image ? { image: `${SITE_URL}${r.image.src}` } : {})
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
	title="Recognitions | Louigie Caminoy"
	description="Awards and honors of Louigie Caminoy: TikTok Shop Regional Case Challenge 2026 champion, Stellar PH100 2026 honoree, INFOTECHNOLYMPICS 2026 champion, PCCI Makati Asenso 360 MSME Day champion, and more."
	path="/recognitions"
/>
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, escaped JSON-LD -->
	{@html jsonLdScript}
</svelte:head>
<Shell section="recognitions">
	<h1 class="sr-only">Recognitions — Louigie Caminoy</h1>
	<BackBar anchor="recognitions" title="RECOGNITIONS" />
	<RecognitionsSection />
</Shell>
