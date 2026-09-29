<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import { certifications, type Certification } from '$lib/data/certifications';

	let { preview = false, items = certifications }: { preview?: boolean; items?: Certification[] } =
		$props();
	let selected = $state('All');
	const categories = $derived(['All', ...new Set(items.flatMap((item) => item.categories))]);
	const visible = $derived(
		preview
			? items.slice(0, 3)
			: items.filter((item) => selected === 'All' || item.categories.includes(selected))
	);
	function initials(issuer: string) {
		return issuer
			.split(/\s+/)
			.map((word) => word[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}
</script>

<PageSection
	id={preview ? 'certifications' : undefined}
	number="05"
	label="CERTIFICATIONS"
	href={preview ? resolve('/certifications') : ''}
	cta="SEE ALL CERTIFICATIONS"
	meta={items.length ? `${items.length} CREDENTIALS` : ''}
	glitch={preview}
>
	{#if !preview && items.length}
		<p class="intro">Certifications and completed training.</p>
		{#if categories.length > 2}
			<div class="filters" aria-label="Filter certifications">
				{#each categories as category (category)}
					<button
						type="button"
						aria-pressed={selected === category}
						onclick={() => (selected = category)}>{category}</button
					>
				{/each}
			</div>
		{/if}
	{/if}
	{#if items.length}
		<div class="cert-grid">
			{#each visible as item (item.id)}
				<article class="cert-card">
					{#if item.image}
						<a
							class="certificate-image"
							href={item.image}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Open ${item.title} certificate image (opens in a new tab)`}
						>
							<img
								src={item.image}
								alt={`${item.title} certificate issued to Louigie Caminoy`}
								loading="lazy"
							/>
						</a>
					{:else}
						<div class="badge-plate" aria-hidden="true">
							{#if item.badge}<img src={item.badge} alt="" loading="lazy" width="80" height="80" />
							{:else}<span class="badge-mark">{initials(item.issuer)}</span>{/if}
						</div>
					{/if}
					<div class="card-content">
						<p class="issuer">{item.issuer}</p>
						<h3>{item.title}</h3>
						<footer>
							{#if item.url}<a
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Verify ${item.title} credential (opens in a new tab)`}>Verify</a
								>{/if}
						</footer>
					</div>
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
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 24px;
	}
	.filters button {
		padding: 8px 12px;
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		font: 11px var(--font-mono);
		cursor: pointer;
	}
	.filters button[aria-pressed='true'],
	.filters button:hover {
		color: var(--color-accent);
		border-color: var(--color-accent);
	}
	.cert-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
	}
	.cert-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		border: 1px solid var(--color-border);
		background: var(--color-surface-card);
		transition: border-color 0.2s;
	}
	.cert-card:hover,
	.cert-card:focus-within {
		border-color: var(--color-accent);
	}
	.certificate-image {
		display: block;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		background: var(--color-surface-alt);
		border-bottom: 1px solid var(--color-border);
	}
	.certificate-image img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	.badge-plate {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 220px;
		background: var(--color-surface-alt);
		border-bottom: 1px solid var(--color-border);
	}
	.badge-mark {
		display: grid;
		place-items: center;
		width: 64px;
		height: 64px;
		border: 1px solid var(--color-accent);
		outline: 1px solid var(--color-border);
		outline-offset: 7px;
		font: 22px var(--font-mono);
		color: var(--color-accent);
	}
	.badge-plate img {
		object-fit: contain;
	}
	.card-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 24px;
		overflow-wrap: anywhere;
	}
	.issuer {
		font: 10px var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}
	h3 {
		margin: 12px 0 8px;
		font-size: 18px;
		line-height: 1.4;
		font-weight: 600;
		letter-spacing: -0.025em;
		color: var(--color-text-primary);
	}
	footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		margin-top: auto;
		padding-top: 24px;
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
	a:focus-visible,
	button:focus-visible {
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
		.badge-plate {
			height: 220px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cert-card {
			transition: none;
		}
	}
</style>
