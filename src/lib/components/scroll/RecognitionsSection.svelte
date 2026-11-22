<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import Recognition from './Recognition.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { recognitions, isWin, formatMonth } from '$lib/data/recognitions';

	interface Props {
		/** home page: one row of three, link out. detail page: everything. */
		preview?: boolean;
	}
	let { preview = false }: Props = $props();

	const visible = $derived(preview ? recognitions.slice(0, 3) : recognitions);
	const wins = recognitions.filter((r) => /champion/i.test(r.award)).length;
</script>

<PageSection
	id={preview ? 'recognitions' : undefined}
	number="06"
	label="RECOGNITIONS"
	href={preview ? resolve('/recognitions') : ''}
	cta="SEE ALL RECOGNITIONS"
	meta={`${recognitions.length} AWARDS · ${wins} WINS`}
	glitch={preview}
>
	{#if !preview}
		<p class="intro">Competitions, case challenges, and honors.</p>
	{/if}
	<ol class="rec-grid" use:reveal>
		{#each visible as item (item.id)}
			<li class="rec-card">
				<p class="award" class:win={isWin(item.award)}>{item.award}</p>
				<h3>
					{#if item.url}
						<a href={item.url} target="_blank" rel="noopener noreferrer"
							>{item.event} <span aria-hidden="true">↗</span></a
						>
					{:else}
						{item.event}
					{/if}
				</h3>
				<p class="where">
					{item.venue} <span aria-hidden="true">·</span>
					<time datetime={item.date}>{formatMonth(item.date)}</time>
				</p>
				<p class="desc">{item.description}</p>
				{#if item.project}
					<p class="project"><span>PROJECT</span> {item.project}</p>
				{/if}
			</li>
		{/each}
	</ol>
	{#if !preview}
		<Recognition />
	{/if}
</PageSection>

<style>
	.intro {
		margin: 0 0 1.5rem;
		color: var(--color-text-secondary);
		font-size: 14px;
	}
	.rec-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.rec-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		padding: 24px;
		border: 1px solid var(--color-border);
		background: var(--color-surface-card);
		overflow-wrap: anywhere;
		transition: border-color 0.2s;
	}
	.rec-card:hover,
	.rec-card:focus-within {
		border-color: var(--color-accent);
	}
	.award {
		align-self: flex-start;
		padding: 4px 8px;
		border: 1px solid var(--color-border);
		font: 10px/1.4 var(--font-mono);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}
	.award.win {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
	h3 {
		margin: 16px 0 6px;
		font-size: 18px;
		line-height: 1.4;
		font-weight: 600;
		letter-spacing: -0.025em;
		color: var(--color-text-primary);
	}
	h3 a {
		color: inherit;
		text-underline-offset: 4px;
	}
	h3 a:hover {
		text-decoration: underline;
	}
	h3 a:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
	}
	.where {
		font: 10px/1.6 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	.desc {
		margin-top: 12px;
		font-size: 13px;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}
	.project {
		margin-top: auto;
		padding-top: 20px;
		font: 11px var(--font-mono);
		color: var(--color-text-primary);
	}
	.project span {
		margin-right: 6px;
		font-size: 10px;
		letter-spacing: 0.12em;
		color: var(--color-text-muted);
	}
	@media (max-width: 1023px) {
		.rec-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 639px) {
		.rec-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rec-card {
			transition: none;
		}
	}
</style>
