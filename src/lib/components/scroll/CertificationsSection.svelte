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
					<!-- crossed ribbon: the medal hangs from the rail above it -->
					<svg class="ribbon" viewBox="0 0 80 64" aria-hidden="true">
						<path d="M10 0 H24 L46 64 H34 Z" />
						<path d="M70 0 H56 L34 64 H46 Z" />
					</svg>
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
	/*
	 * No box: each credential hangs from a hairline rail with end ticks, like
	 * a medal on a display bar. Hover sweeps the rail and ribbon to accent.
	 */
	.cert-card {
		--line: var(--color-border);
		position: relative;
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		padding: 0 16px;
		text-align: center;
		overflow-wrap: anywhere;
		background:
			linear-gradient(var(--line), var(--line)) top / 100% 1px no-repeat,
			linear-gradient(var(--line), var(--line)) left top / 1px 7px no-repeat,
			linear-gradient(var(--line), var(--line)) right top / 1px 7px no-repeat;
	}
	.cert-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background: var(--color-accent);
		transform: scaleX(0);
		transition: transform 0.4s ease;
	}
	.cert-card:hover::after,
	.cert-card:focus-within::after {
		transform: scaleX(1);
	}
	.ribbon {
		display: block;
		width: 80px;
		height: 64px;
		color: var(--color-text-muted);
		transition: color 0.3s;
	}
	.ribbon path {
		fill: currentColor;
		fill-opacity: 0.08;
		stroke: currentColor;
		stroke-width: 1;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}
	.cert-card:hover .ribbon,
	.cert-card:focus-within .ribbon {
		color: var(--color-accent);
	}
	/* pull the medal up so the ribbon tucks behind its rim */
	.medal-link {
		position: relative;
		display: block;
		margin: -30px 0 24px;
		border-radius: 50%;
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
	@media (prefers-reduced-motion: reduce) {
		.cert-card::after,
		.ribbon {
			transition: none;
		}
	}
</style>
