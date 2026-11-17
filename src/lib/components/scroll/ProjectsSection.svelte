<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { hoverSound } from '$lib/actions/hoverSound';
	import { projects, type Project } from '$lib/data/portfolio';

	interface Props {
		preview?: boolean;
	}
	let { preview = false }: Props = $props();

	const previewHosts = new Set(['iskolar.io', 'academy.iskolar.io', 'configains.fundrstudio.com']);
	const shown = $derived(
		preview ? projects.filter((project) => previewHosts.has(project.host)) : projects
	);

	// A plain box with no fill: the page shows straight through. Hover is carried by the
	// border and the corner marks, never by a background colour.
	const box =
		'group relative flex flex-col gap-6 border border-(--color-border) p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-(--color-accent) lg:p-7';

	// L-shaped marks on each corner; they grow and turn accent on hover.
	const corners = [
		'-top-px -left-px border-t border-l',
		'-top-px -right-px border-t border-r',
		'-bottom-px -left-px border-b border-l',
		'-right-px -bottom-px border-b border-r'
	];
</script>

<!-- The logo is the hero of each card; projects without one share a generic placeholder. -->
{#snippet mark(logo: string | undefined, title: string, size: string)}
	<div class="{size} shrink-0 transition-transform duration-300 group-hover:scale-105">
		{#if logo}
			<img
				src={logo}
				alt="{title} logo"
				loading="lazy"
				decoding="async"
				class="h-full w-full object-contain"
			/>
		{:else}
			<!-- placeholder: a bare browser window, shown until a project ships a logo -->
			<svg
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-full w-full text-(--color-text-muted) transition-colors group-hover:text-(--color-accent)"
				role="img"
				aria-label="{title} logo placeholder"
			>
				<rect x="5" y="9" width="38" height="30" rx="2" />
				<path d="M5 17h38" />
				<circle cx="10" cy="13" r="0.8" fill="currentColor" />
				<circle cx="14" cy="13" r="0.8" fill="currentColor" />
				<circle cx="18" cy="13" r="0.8" fill="currentColor" />
				<path d="M13 31l6-6 4 4 5-7 7 9" />
			</svg>
		{/if}
	</div>
{/snippet}

{#snippet inside(p: Project)}
	{#each corners as pos (pos)}
		<span
			class="pointer-events-none absolute {pos} h-2.5 w-2.5 border-(--color-text-muted) transition-all duration-300 group-hover:h-5 group-hover:w-5 group-hover:border-(--color-accent)"
			aria-hidden="true"
		></span>
	{/each}

	<div class="flex items-start justify-between gap-4">
		{@render mark(p.logo, p.title, 'size-20')}
		<span
			class="font-mono text-base text-(--color-text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--color-accent)"
			aria-hidden="true">↗</span
		>
	</div>

	<div>
		<h3
			class="text-xl font-semibold tracking-tight text-(--color-text-primary) transition-colors group-hover:text-(--color-accent)"
		>
			{p.title}
		</h3>
		<p class="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-(--color-text-muted)">{p.host}</p>
		<p class="mt-3 text-[13px] leading-relaxed text-(--color-text-secondary)">{p.description}</p>
	</div>
{/snippet}

<PageSection
	id="projects"
	number="02"
	label="PROJECTS"
	meta="{projects.length} LIVE"
	href={preview ? resolve('/projects') : ''}
	cta="SEE ALL PROJECTS"
	flush={!preview}
	glitch={preview}
>
	<ul class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
		{#each shown as p (p.title)}
			<li class="contents">
				{#if preview}
					<a
						href={p.link}
						data-cursor="snap"
						target="_blank"
						rel="noopener noreferrer external"
						class={box}
						use:reveal
						use:hoverSound
					>
						{@render inside(p)}
					</a>
				{:else}
					<a
						href={p.link}
						data-cursor="snap"
						target="_blank"
						rel="noopener noreferrer external"
						class={box}
						use:reveal
					>
						{@render inside(p)}
					</a>
				{/if}
			</li>
		{/each}
	</ul>
</PageSection>
