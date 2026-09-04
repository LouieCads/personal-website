<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { projects } from '$lib/data/portfolio';

	interface Props {
		preview?: boolean;
	}
	let { preview = false }: Props = $props();

	const shown = $derived(preview ? projects.slice(0, 3) : projects);
</script>

<!-- Not every link ships a screenshot; a binary plate stands in until one does. -->
{#snippet viewport(image: string | undefined, title: string, host: string)}
	{#if image}
		<img
			src={image}
			alt={title}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-cover object-top opacity-90 transition-opacity duration-500 group-hover:opacity-100"
		/>
	{:else}
		<div
			class="flex h-full w-full items-center justify-center bg-(--color-surface-alt) select-none"
			aria-hidden="true"
		>
			<span class="font-mono text-[10px] tracking-[0.3em] text-(--color-text-muted)">{host}</span>
		</div>
	{/if}
{/snippet}

<PageSection
	id="projects"
	number="02"
	label="PROJECTS"
	meta="{projects.length} LIVE"
	href={preview ? resolve('/projects') : ''}
	cta="SEE ALL PROJECTS"
	flush={!preview}
>
	{#if preview}
		<!-- a hand of cards, each showing the product as a desktop window -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
			{#each shown as p (p.index)}
				<a
					href={p.link}
					target="_blank"
					rel="noopener noreferrer external"
					class="group flex flex-col border border-(--color-border) bg-(--color-surface-card) transition-all duration-300 hover:-translate-y-1.5 hover:border-(--color-accent)"
					use:reveal
				>
					<!-- window chrome -->
					<div
						class="flex items-center gap-2 border-b border-(--color-rule) bg-(--color-surface-alt) px-3 py-2"
					>
						<span class="flex gap-1.5" aria-hidden="true">
							<span class="h-2 w-2 rounded-full border border-(--color-border-hover)"></span>
							<span class="h-2 w-2 rounded-full border border-(--color-border-hover)"></span>
							<span class="h-2 w-2 rounded-full border border-(--color-border-hover)"></span>
						</span>
						<span
							class="truncate px-2 font-mono text-[9px] tracking-[0.08em] text-(--color-text-muted)"
						>
							{p.host}
						</span>
						<span
							class="ml-auto font-mono text-[10px] text-(--color-text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--color-accent)"
							>↗</span
						>
					</div>

					<!-- viewport -->
					<div class="aspect-[16/11] w-full overflow-hidden">
						{@render viewport(p.image, p.title, p.host)}
					</div>

					<!-- caption -->
					<div class="flex flex-1 flex-col border-t border-(--color-rule) p-4">
						<h3
							class="text-lg font-light tracking-tight text-(--color-text-primary) transition-colors group-hover:text-(--color-accent)"
						>
							{p.title}
						</h3>
						<p class="mt-1.5 text-[13px] leading-relaxed text-(--color-text-secondary)">
							{p.tagline}
						</p>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<!-- full page: the wide row treatment, full copy, full stack -->
		<div class="flex flex-col gap-5">
			{#each shown as p (p.index)}
				<a
					href={p.link}
					target="_blank"
					rel="noopener noreferrer external"
					class="group flex flex-col border border-(--color-border) bg-(--color-surface-card) transition-colors hover:border-(--color-border-hover) hover:bg-(--color-surface-alt) sm:flex-row"
					use:reveal
				>
					<div
						class="h-44 shrink-0 overflow-hidden border-b border-(--color-border) sm:h-auto sm:w-64 sm:border-r sm:border-b-0 md:w-80 lg:w-96"
					>
						{@render viewport(p.image, p.title, p.host)}
					</div>

					<div class="flex flex-1 flex-col p-5 lg:p-7">
						<div class="mb-3 flex items-start justify-between gap-4">
							<div>
								<span class="font-mono text-[10px] tracking-[0.16em] text-(--color-text-muted)">
									{[p.index, p.year, p.role].filter(Boolean).join(' - ')}
								</span>
								<h3
									class="mt-1 text-xl font-medium text-(--color-text-primary) transition-colors group-hover:text-(--color-accent)"
								>
									{p.title}
								</h3>
								<p class="mt-1 font-mono text-[11px] text-(--color-accent)">{p.tagline}</p>
							</div>
							<span
								class="font-mono text-sm text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)"
								>↗</span
							>
						</div>

						<p class="mb-5 max-w-[70ch] text-sm leading-relaxed text-(--color-text-secondary)">
							{p.description}
						</p>

						<div class="mt-auto flex flex-wrap gap-1.5">
							{#each p.tech as t (t)}
								<span
									class="border border-(--color-border) px-2.5 py-1 font-mono text-[10px] text-(--color-text-secondary)"
									>{t}</span
								>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</PageSection>
