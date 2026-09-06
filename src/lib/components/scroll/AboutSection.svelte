<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { specialties, aboutParagraphs, aboutSummary } from '$lib/data/portfolio';

	interface Props {
		/** home page: one row, three specialties, link out. detail page: everything. */
		preview?: boolean;
	}
	let { preview = false }: Props = $props();

	const shown = $derived(preview ? specialties.slice(0, 2) : specialties);
	const copy = $derived(preview ? aboutSummary : aboutParagraphs);
</script>

<PageSection
	id="about"
	number="01"
	label="ABOUT"
	meta=""
	href={preview ? resolve('/about') : ''}
	cta="READ THE FULL BIO"
	flush={!preview}
	glitch={preview}
>
	<div class="grid gap-8 md:grid-cols-3 md:gap-10" use:reveal>
		<!-- bio -->
		<div class="flex flex-col md:col-span-2">
			<h3 class="mb-4 text-lg leading-snug font-light tracking-tight text-(--color-text-primary)">
				Discipline over comfort.
				<span class="text-(--color-text-secondary)">Make it exist first, refine it later.</span>
			</h3>

			{#each copy as p, i (i)}
				<p class="mb-3 max-w-[72ch] text-sm leading-relaxed text-(--color-text-secondary)">{p}</p>
			{/each}
		</div>

		<!-- specialties -->
		<div class="flex flex-col">
			<div class="flex flex-col gap-2.5">
				{#each shown as s (s.index)}
					<div
						class="group border border-(--color-border) bg-(--color-surface-card) p-3 transition-colors hover:border-(--color-border-hover) hover:bg-(--color-surface-alt)"
					>
						<div class="flex items-center gap-3">
							<span class="font-mono text-xs text-(--color-accent)">{s.index}</span>
							<h4 class="font-mono text-xs font-semibold tracking-wide text-(--color-text-primary)">
								{s.label}
							</h4>
						</div>
						<p class="mt-1.5 pl-8 text-xs leading-relaxed text-(--color-text-muted)">{s.detail}</p>
					</div>
				{/each}
			</div>
			{#if preview && specialties.length > shown.length}
				<p class="mt-3 font-mono text-[10px] tracking-[0.16em] text-(--color-text-muted)">
					+ {specialties.length - shown.length} more
				</p>
			{/if}
		</div>
	</div>
</PageSection>
