<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import RecognitionTrail from './RecognitionTrail.svelte';
	import { recognitions } from '$lib/data/recognitions';

	interface Props {
		/** home page: the latest three stops, link out. detail page: the full roadmap. */
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
		<p class="intro">
			Competitions, case challenges, and honors. Select a destination for the full story.
		</p>
	{/if}
	<RecognitionTrail items={visible} />
</PageSection>

<style>
	.intro {
		margin: 0 0 1.5rem;
		color: var(--color-text-secondary);
		font-size: 14px;
	}
</style>
