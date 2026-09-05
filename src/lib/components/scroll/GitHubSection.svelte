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
		<div class="overflow-x-auto" use:reveal>
			<div class="inline-block">
				<p class="mb-4 font-mono text-[13px] text-(--color-text-primary)">
					{graph.total.toLocaleString()} contributions in the last year
				</p>

				<div class="flex gap-2">
					<!-- weekday labels, offset down to clear the month header row -->
					<div
						class="mt-[18px] grid shrink-0 grid-rows-7 gap-1 font-mono text-[9px] text-(--color-text-muted)"
					>
						{#each DAY_LABELS as label, i (i)}
							<span class="flex h-3 items-center">{label}</span>
						{/each}
					</div>

					<div>
						<!-- month labels, sharing the day grid's own column template below
						     so a label can never drift off from the columns it names -->
						<div
							class="mb-1 grid gap-1 font-mono text-[10px] text-(--color-text-muted)"
							style="grid-template-columns: repeat({graph.weeks.length}, 12px);"
						>
							{#each graph.months as month, i (i)}
								<span style="grid-column: span {month.span}">{month.label}</span>
							{/each}
						</div>

						<!-- contribution grid, oldest week first -->
						<div
							class="grid grid-rows-7 gap-1"
							style="grid-template-columns: repeat({graph.weeks.length}, 12px); grid-auto-flow: column;"
							role="img"
							aria-label="{graph.total} GitHub contributions in the last year"
						>
							{#each graph.weeks as week, wi (wi)}
								{#each week.days as day, di (di)}
									{#if day}
										<span
											class="h-3 w-3 rounded-[2px] border border-(--color-border) contrib-level-{day.level}"
											title="{day.count} contribution{day.count === 1 ? '' : 's'} on {day.date}"
										></span>
									{:else}
										<span class="h-3 w-3"></span>
									{/if}
								{/each}
							{/each}
						</div>
					</div>
				</div>

				<!-- legend -->
				<div class="mt-3 flex items-center justify-end gap-1.5 pr-0.5">
					<span class="font-mono text-[10px] text-(--color-text-muted)">Less</span>
					{#each [0, 1, 2, 3, 4] as level (level)}
						<span class="h-3 w-3 rounded-[2px] border border-(--color-border) contrib-level-{level}"
						></span>
					{/each}
					<span class="font-mono text-[10px] text-(--color-text-muted)">More</span>
				</div>
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
