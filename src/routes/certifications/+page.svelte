<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import CertificationsSection from '$lib/components/scroll/CertificationsSection.svelte';
	import { certifications } from '$lib/data/certifications';

	const SITE_URL = 'https://www.louigiecaminoy.com';
	const PAGE_URL = `${SITE_URL}/certifications`;

	// Each credential is named with its issuer, dates, and public verification link.
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': PAGE_URL,
		url: PAGE_URL,
		name: 'Certifications | Louigie Caminoy',
		about: { '@id': `${SITE_URL}/#person` },
		mainEntity: {
			'@type': 'ItemList',
			name: 'Certifications of Louigie Caminoy',
			itemListOrder: 'https://schema.org/ItemListOrderDescending',
			numberOfItems: certifications.length,
			itemListElement: certifications.map((c, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type': 'EducationalOccupationalCredential',
					name: c.title,
					credentialCategory: 'certification',
					recognizedBy: { '@type': 'Organization', name: c.issuer },
					...(c.description ? { description: c.description } : {}),
					...(c.categories.length ? { about: c.categories.join(', ') } : {}),
					...(c.issued ? { dateCreated: c.issued } : {}),
					...(c.expires ? { expires: c.expires } : {}),
					...(c.credentialId ? { identifier: c.credentialId } : {}),
					...(c.url ? { url: c.url } : {})
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
	title="Certifications | Louigie Caminoy"
	description="Certifications of Louigie Caminoy: DataCamp AI Engineer for Developers Associate, Certiport IT Specialist - Databases, Bitget Blockchain4Youth, and the Quantum Computing and Blockchain Lecture Series 2025."
	path="/certifications"
	noindex={certifications.length === 0}
/>
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, escaped JSON-LD -->
	{@html jsonLdScript}
</svelte:head>
<Shell section="certifications">
	<h1 class="sr-only">Certifications by Louigie Caminoy</h1>
	<BackBar anchor="certifications" title="CERTIFICATIONS" />
	<CertificationsSection />
</Shell>
