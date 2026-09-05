<script lang="ts">
	import PageSection from './PageSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import type { ContributionGraph } from '$lib/data/github';

	interface Props {
		username?: string;
		graph: ContributionGraph | null;
	}

	let { username = 'LouieCads', graph }: Props = $props();

	const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
</script>

<PageSection
	id="github"
	number="05"
	label="GITHUB"
	href="https://github.com/{username}"
	cta={username}
>
	{#if graph && graph.weeks.length}
		<div class="w-full" use:reveal>
			<p class="mb-4 font-mono text-[13px] text-(--color-text-primary)">
				{graph.total.toLocaleString()} contributions in the last year
			</p>

			<!-- One grid for labels + calendar, so week columns are true 1fr tracks
			     that stretch to fill the section width, and day-label / month-header
			     rows and columns stay pixel-locked to the day cells instead of
			     drifting apart the way three separately-sized grids would. -->
			<div
				class="grid gap-1"
				style="grid-template-columns: max-content repeat({graph.weeks.length}, minmax(0, 1fr)); grid-template-rows: auto repeat(7, minmax(0, 1fr));"
				role="img"
				aria-label="{graph.total} GitHub contributions in the last year"
			>
				<span style="grid-row: 1; grid-column: 1"></span>

				<!-- month labels, row 1, auto-placed across the week columns. min-w-0 +
				     overflow-hidden: a grid item's text otherwise imposes its own
				     min-content width on the fr tracks it spans, which is what forced
				     the whole calendar wider than its container on narrow screens. -->
				{#each graph.months as month, i (i)}
					<span
						class="min-w-0 overflow-hidden font-mono text-[10px] text-(--color-text-muted)"
						style="grid-row: 1; grid-column: span {month.span}">{month.label}</span
					>
				{/each}

				<!-- weekday labels, column 1 -->
				{#each DAY_LABELS as label, r (r)}
					<span
						class="flex items-center font-mono text-[9px] text-(--color-text-muted)"
						style="grid-row: {r + 2}; grid-column: 1">{label}</span
					>
				{/each}

				<!-- contribution cells, oldest week first -->
				{#each graph.weeks as week, wi (wi)}
					{#each week.days as day, di (di)}
						{#if day}
							<span
								class="aspect-square w-full min-w-0 rounded-[2px] border border-(--color-border) contrib-level-{day.level}"
								style="grid-row: {di + 2}; grid-column: {wi + 2}"
								title="{day.count} contribution{day.count === 1 ? '' : 's'} on {day.date}"
							></span>
						{:else}
							<span style="grid-row: {di + 2}; grid-column: {wi + 2}"></span>
						{/if}
					{/each}
				{/each}
			</div>

			<!-- legend -->
			<div class="mt-3 flex items-center justify-end gap-1.5 pr-0.5">
				<span class="font-mono text-[10px] text-(--color-text-muted)">Less</span>
				{#each [0, 1, 2, 3, 4] as level (level)}
					<span class="h-3 w-3 shrink-0 rounded-[2px] border border-(--color-border) contrib-level-{level}"
					></span>
				{/each}
				<span class="font-mono text-[10px] text-(--color-text-muted)">More</span>
			</div>
		</div>
	{:else}
		<p class="font-mono text-[13px] text-(--color-text-secondary)" use:reveal>
			Contribution graph unavailable right now — see the full history on
			<a
				href="https://github.com/{username}"
				target="_blank"
				rel="noopener noreferrer"
				class="text-(--color-accent) hover:underline">github.com/{username}</a
			>.
		</p>
	{/if}
</PageSection>

<style>
	/* Same accent used across the site, stepped up in strength per level
	   instead of switching to GitHub's green — level 0 matches an empty
	   surface, level 4 is the full solid accent. */
	.contrib-level-0 {
		background: var(--color-surface-card);
	}
	.contrib-level-1 {
		background: color-mix(in srgb, var(--color-accent) 25%, var(--color-surface-card));
	}
	.contrib-level-2 {
		background: color-mix(in srgb, var(--color-accent) 50%, var(--color-surface-card));
	}
	.contrib-level-3 {
		background: color-mix(in srgb, var(--color-accent) 75%, var(--color-surface-card));
	}
	.contrib-level-4 {
		background: var(--color-accent);
	}
</style>
