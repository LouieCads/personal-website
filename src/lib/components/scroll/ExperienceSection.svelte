<script lang="ts">
	import { resolve } from '$app/paths';
	import PageSection from './PageSection.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { experience, formatYears, startYear } from '$lib/data/portfolio';

	interface Props {
		preview?: boolean;
	}
	let { preview = false }: Props = $props();

	const shown = $derived(preview ? experience.slice(0, 3) : experience);
</script>

<PageSection
	id="experience"
	number="03"
	label="EXPERIENCE"
	meta="{experience.length} ROLES"
	href={preview ? resolve('/experience') : ''}
	cta="SEE FULL HISTORY"
	flush={!preview}
	glitch={preview}
>
	{#if preview}
		<!-- one line per role: what, where, when -->
		<div class="flex flex-col border-t border-(--color-rule)">
			{#each shown as role (role.id)}
				<div
					class="grid items-baseline gap-x-4 gap-y-1 border-b border-(--color-rule) py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_3.5rem] sm:py-5"
					use:reveal
				>
					<h3
						class="font-mono text-[13px] font-medium text-balance text-(--color-text-primary) sm:text-sm md:text-base"
					>
						{role.role}
					</h3>
					<p class="font-mono text-[11px] text-balance text-(--color-accent) sm:text-xs md:text-sm">
						{role.company}
					</p>
					<p
						class="font-mono text-[10px] tracking-[0.16em] text-(--color-text-muted) sm:text-right sm:text-[11px]"
					>
						{startYear(role.start)}
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<!-- full page: commit-log rail, held in a centred column -->
		<div class="mx-auto flex w-full max-w-3xl flex-col">
			{#each shown as role, i (role.id)}
				<div class="grid grid-cols-[14px_1fr] gap-4 pb-9 last:pb-0" use:reveal>
					<div class="relative">
						<span
							class="absolute top-1.5 left-[2px] block h-[7px] w-[7px] rounded-full border border-(--color-accent) {role.end ===
							null
								? 'bg-(--color-accent)'
								: 'bg-(--color-surface)'}"
						></span>
						{#if i < shown.length - 1}
							<span class="absolute top-4 bottom-[-2.25rem] left-[5px] w-px bg-(--color-border)"
							></span>
						{/if}
					</div>

					<div class="min-w-0">
						<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<span class="font-mono text-[10px] tracking-[0.16em] text-(--color-text-muted)">
								{formatYears(role.start, role.end)}
							</span>
						</div>

						<h3 class="mt-1.5 font-mono text-base font-medium text-(--color-text-primary)">
							{role.role}
						</h3>
						<p class="font-mono text-xs text-(--color-accent)">{role.company}</p>

						<p class="mt-3 max-w-[72ch] text-sm leading-relaxed text-(--color-text-secondary)">
							{role.summary}
						</p>

						<ul class="mt-3 flex flex-col gap-1.5">
							{#each role.achievements as a (a)}
								<li
									class="relative pl-4 text-[13px] leading-relaxed text-(--color-text-secondary) before:absolute before:left-0 before:font-mono before:text-[11px] before:text-(--color-text-muted) before:content-['>']"
								>
									{a}
								</li>
							{/each}
						</ul>

						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each role.tags as t (t)}
								<span
									class="border border-(--color-border) px-2 py-0.5 font-mono text-[9px] text-(--color-text-secondary)"
									>{t}</span
								>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</PageSection>
