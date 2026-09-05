<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { feed, episodes, articles, linkThumbnail, isVideoLink } from '$lib/data/portfolio';

	/** Only what the markup actually renders, so nothing unused ships. */
	interface Row {
		id: string;
		title: string;
		blurb: string;
		date: string;
		url: string;
		image?: string;
	}
	interface Card extends Row {
		kind: 'PODCAST' | 'ARTICLE';
	}

	interface Props {
		preview?: boolean;
		/** server-resolved copies; fall back to the static data */
		feedItems?: Card[];
		episodeItems?: Row[];
		articleItems?: Row[];
	}
	let {
		preview = false,
		feedItems = feed,
		episodeItems = episodes,
		articleItems = articles
	}: Props = $props();

	// top 3 by date, but an ARTICLE always sits in the middle slot when one made the cut
	const latest = $derived.by(() => {
		const top = feedItems.slice(0, 3);
		const articleIdx = top.findIndex((item) => item.kind === 'ARTICLE');
		if (articleIdx > -1 && articleIdx !== 1) {
			const [article] = top.splice(articleIdx, 1);
			top.splice(1, 0, article);
		}
		return top;
	});
</script>

<!--
  Cards are link-driven. Paste a video link into an entry's `url` and it
  resolves its own preview frame; until then a binary plate stands in.
-->
{#snippet cover(url: string, image: string | undefined, title: string, tall: boolean)}
	{@const src = image ?? linkThumbnail(url) ?? ''}
	<div
		class="relative overflow-hidden bg-(--color-surface-alt) {tall
			? 'aspect-[16/9] w-full'
			: 'h-11 w-16 shrink-0'}"
	>
		{#if src}
			<img {src} alt={title} loading="lazy" class="h-full w-full object-cover" />
		{:else}
			<span
				class="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] text-(--color-text-muted) select-none"
				aria-hidden="true"
			>
				{tall ? '01001100' : '01'}
			</span>
		{/if}

		{#if isVideoLink(url)}
			<span
				class="absolute inset-0 flex items-center justify-center bg-black/15 text-white transition-colors group-hover:bg-black/25 {tall
					? 'text-2xl'
					: 'text-xs'}"
				aria-hidden="true">▶</span
			>
		{/if}
	</div>
{/snippet}

<PageSection
	id="blog"
	number="04"
	label="BLOG"
	meta="{episodeItems.length + articleItems.length} ITEMS"
	href={preview ? resolve('/blog') : ''}
	cta="SEE ALL POSTS"
	flush={!preview}
>
	{#if preview}
		<!-- one row, three latest across both formats -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each latest as item (item.id)}
				<svelte:element
					this={item.url ? 'a' : 'div'}
					href={item.url || undefined}
					target={item.url ? '_blank' : undefined}
					rel={item.url ? 'noopener noreferrer' : undefined}
					class="group flex flex-col border border-(--color-border) bg-(--color-surface-card) transition-colors hover:border-(--color-border-hover) hover:bg-(--color-surface-alt)"
					use:reveal
				>
					<div class="relative border-b border-(--color-rule)">
						{@render cover(item.url, item.image, item.title, true)}
						<span
							class="absolute top-2 left-2 border border-(--color-border) bg-(--color-surface) px-1.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-(--color-text-secondary)"
						>
							{item.kind}
						</span>
					</div>

					<div class="flex flex-1 flex-col gap-2 p-4">
						<h3
							class="text-sm leading-snug font-medium text-balance text-(--color-text-primary) transition-colors group-hover:text-(--color-accent) sm:text-base"
						>
							{item.title}
						</h3>
						<p class="line-clamp-3 text-[13px] leading-relaxed text-(--color-text-secondary)">
							{item.blurb}
						</p>
						<span
							class="mt-auto pt-2 text-right font-mono text-[10px] tracking-[0.14em] text-(--color-text-muted)"
						>
							{item.date}
						</span>
					</div>
				</svelte:element>
			{/each}
		</div>
	{:else}
		<!-- full page: the two directory listings -->
		<div class="grid gap-10 md:grid-cols-2 md:gap-12">
			<div use:reveal>
				<div class="flex items-center gap-3 border-b border-(--color-rule) pb-2">
					<span class="font-mono text-xs tracking-[0.16em] text-(--color-text-primary)"
						>podcast/</span
					>
					<span class="ml-auto font-mono text-[10px] text-(--color-text-muted)"
						>{episodeItems.length}</span
					>
				</div>
				{#each episodeItems as ep (ep.id)}
					<svelte:element
						this={ep.url ? 'a' : 'div'}
						href={ep.url || undefined}
						target={ep.url ? '_blank' : undefined}
						rel={ep.url ? 'noopener noreferrer' : undefined}
						class="group flex items-center gap-3 border-b border-(--color-rule) py-3 transition-colors hover:bg-(--color-surface-alt)"
					>
						<div class="shrink-0 border border-(--color-border)">
							{@render cover(ep.url, ep.image, ep.title, false)}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-[13px] text-(--color-text-primary)">{ep.title}</p>
							<p class="mt-0.5 line-clamp-1 text-[11px] text-(--color-text-secondary)">
								{ep.blurb}
							</p>
						</div>
						<span class="shrink-0 font-mono text-[10px] text-(--color-text-muted)">{ep.date}</span>
						<span
							class="shrink-0 font-mono text-xs text-(--color-accent) transition-transform group-hover:translate-x-1"
							>▸</span
						>
					</svelte:element>
				{/each}
			</div>

			<div use:reveal>
				<div class="flex items-center gap-3 border-b border-(--color-rule) pb-2">
					<span class="font-mono text-xs tracking-[0.16em] text-(--color-text-primary)"
						>articles/</span
					>
					<span class="ml-auto font-mono text-[10px] text-(--color-text-muted)"
						>{articleItems.length}</span
					>
				</div>
				{#each articleItems as a (a.id)}
					<svelte:element
						this={a.url ? 'a' : 'div'}
						href={a.url || undefined}
						target={a.url ? '_blank' : undefined}
						rel={a.url ? 'noopener noreferrer' : undefined}
						class="group flex items-center gap-3 border-b border-(--color-rule) py-3 transition-colors hover:bg-(--color-surface-alt)"
					>
						<div class="shrink-0 border border-(--color-border)">
							{@render cover(a.url, a.image, a.title, false)}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-[13px] text-(--color-text-primary)">{a.title}</p>
							<p class="mt-0.5 line-clamp-1 text-[11px] text-(--color-text-secondary)">{a.blurb}</p>
						</div>
						<span class="shrink-0 font-mono text-[10px] text-(--color-text-muted)">{a.date}</span>
						<span
							class="shrink-0 font-mono text-xs text-(--color-accent) transition-transform group-hover:translate-x-1"
							>▸</span
						>
					</svelte:element>
				{/each}
			</div>
		</div>
	{/if}
</PageSection>
