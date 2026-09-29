<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import CertificationsSection from '$lib/components/scroll/CertificationsSection.svelte';
	import { certifications } from '$lib/data/certifications';
</script>

<SEO
	title="Certifications | Louigie Caminoy"
	description="Certifications and completed training by Louigie Caminoy."
	path="/certifications"
	noindex={certifications.length === 0}
/>
<Shell section="certifications">
	<h1 class="sr-only">Certifications by Louigie Caminoy</h1>
	<BackBar anchor="certifications" title="CERTIFICATIONS" />
	<CertificationsSection />
</Shell>
