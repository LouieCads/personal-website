<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		number: string;
		label: string;
		/** right-aligned meta on the header rule, when there is no link out */
		meta?: string;
		/** when set, the header rule ends in a "see full details" link */
		href?: string;
		cta?: string;
		/** tighter top padding, used as the first block on a detail page */
		flush?: boolean;
		children: Snippet;
	}

	let {
		id,
		number,
		label,
		meta = '',
		href = '',
		cta = 'SEE FULL DETAILS',
		flush = false,
		children
	}: Props = $props();
</script>

<!--
  One container, one rhythm. Every section on the site routes through this so
  gutters, header rule and vertical spacing cannot drift apart.
-->
<section {id} class="border-b border-(--color-rule) last:border-b-0">
	<div
		class="mx-auto w-full max-w-[1400px] px-5 sm:px-8 md:px-14 lg:px-20 xl:px-24 {flush
			? 'pt-8 pb-16 sm:pb-20'
			: 'py-16 sm:py-20 md:py-24'}"
	>
		<header class="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-10">
			<span class="font-mono text-xl leading-none text-(--color-accent) sm:text-2xl">{number}</span>
			<h2 class="shrink-0 font-mono text-sm tracking-[0.2em] text-(--color-text-primary)">
				{label}
			</h2>
			<span class="h-px min-w-6 flex-1 bg-(--color-rule)"></span>

			{#if href}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- resolved by the caller -->
				<a
					{href}
					class="group inline-flex shrink-0 items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-(--color-text-secondary) transition-colors hover:text-(--color-accent) sm:text-[11px] sm:tracking-[0.18em]"
				>
					{cta}
					<span class="transition-transform group-hover:translate-x-1">→</span>
				</a>
			{:else if meta}
				<span class="shrink-0 font-mono text-[10px] tracking-[0.16em] text-(--color-text-muted)">
					{meta}
				</span>
			{/if}
		</header>

		{@render children()}
	</div>
</section>
