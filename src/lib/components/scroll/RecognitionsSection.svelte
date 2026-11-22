<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import RecognitionTrail from './RecognitionTrail.svelte';
	import { recognitions, formatMonthLong, fullAward } from '$lib/data/recognitions';

	interface Props {
		/** home page: the latest three stops, link out. detail page: the full roadmap. */
		preview?: boolean;
	}
	let { preview = false }: Props = $props();

	const visible = $derived(preview ? recognitions.slice(0, 3) : recognitions);
</script>

<PageSection
	id={preview ? 'recognitions' : undefined}
	number="06"
	label="RECOGNITIONS"
	href={preview ? resolve('/recognitions') : ''}
	cta="SEE ALL RECOGNITIONS"
	glitch={preview}
	flush={!preview}
>
	{#if !preview}
		<p class="intro">
			Competitions, case challenges, and honors. Select a destination for the full story.
		</p>
	{/if}
	<RecognitionTrail items={visible} />

	{#if !preview}
		<!--
		  The trail is a picture; its details only appear in a dialog after a
		  click. This is the same content as plain, server-rendered text, so
		  search engines, AI answer engines and screen readers get every fact
		  without running JavaScript or opening anything.
		-->
		<section class="sr-only" aria-labelledby="rec-index-title">
			<h3 id="rec-index-title">All recognitions of Louigie Caminoy, newest first</h3>
			<ol>
				{#each recognitions as r (r.id)}
					<li>
						<article>
							<h4>{fullAward(r)}, {r.event}</h4>
							<p>
								Organized by {r.organizer}. Held at {r.venue} in
								<time datetime={r.date}>{formatMonthLong(r.date)}</time>.
								{#if r.project}Project presented: {r.project}.{/if}
							</p>
							<p>{r.description}</p>
							{#if r.url}
								<p><a href={r.url} rel="noopener noreferrer">Source for {r.event}</a></p>
							{/if}
						</article>
					</li>
				{/each}
			</ol>
		</section>
	{/if}
</PageSection>

<style>
	.intro {
		margin: 0 0 1.5rem;
		color: var(--color-text-secondary);
		font-size: 14px;
	}
</style>
