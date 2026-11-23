<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import Medal from './Medal.svelte';
	import { certifications, type Certification } from '$lib/data/certifications';

	let { preview = false, items = certifications }: { preview?: boolean; items?: Certification[] } =
		$props();
	const visible = $derived(preview ? items.slice(0, 3) : items);
</script>

<PageSection
	id={preview ? 'certifications' : undefined}
	number="05"
	label="CERTIFICATIONS"
	href={preview ? resolve('/certifications') : ''}
	cta="SEE ALL CERTIFICATIONS"
	meta={items.length ? `${items.length} CREDENTIALS` : ''}
	glitch={preview}
	flush={!preview}
>
	{#if !preview && items.length}
		<p class="intro">Certifications and completed training.</p>
	{/if}
	{#if items.length}
		<div class="cert-grid">
			{#each visible as item (item.id)}
				<article class="cert-card medal-host">
					{#if item.image}
						<a
							class="medal-link"
							href={item.image}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Open ${item.title} certificate image (opens in a new tab)`}
						>
							<Medal logo={item.logo} issuer={item.issuer} />
						</a>
					{:else}
						<div class="medal-link"><Medal logo={item.logo} issuer={item.issuer} /></div>
					{/if}
					<p class="issuer">{item.issuer}</p>
					<h3>{item.title}</h3>
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<span class="empty-mark" aria-hidden="true">[ 05 ]</span>
			<p>No certifications listed yet.</p>
		</div>
	{/if}
</PageSection>

<style>
	.intro {
		margin: 0 0 1.5rem;
		color: var(--color-text-secondary);
		font-size: 14px;
	}
	.cert-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 56px 20px;
	}
	/* No box: each credential is an award medal with its ribbons, then its name. */
	.cert-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		padding: 0 16px;
		text-align: center;
		overflow-wrap: anywhere;
	}
	.medal-link {
		display: block;
		margin: 0 0 20px;
		border-radius: 12px;
	}
	.issuer {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}
	h3 {
		max-width: 26ch;
		margin: 10px 0 8px;
		font-size: 18px;
		line-height: 1.4;
		font-weight: 600;
		letter-spacing: -0.025em;
		color: var(--color-text-primary);
	}
	a {
		color: var(--color-accent);
		font: 10px/1.6 var(--font-mono);
		letter-spacing: 0.06em;
	}
	a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	a:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
	}
	.empty-state {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
		padding: 32px;
		border: 1px solid var(--color-border);
		background: var(--color-surface-alt);
	}
	.empty-mark {
		color: var(--color-accent);
		font: 20px var(--font-mono);
	}
	.empty-state p {
		color: var(--color-text-secondary);
		font-size: 13px;
	}
	@media (max-width: 1023px) {
		.cert-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 639px) {
		.cert-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
