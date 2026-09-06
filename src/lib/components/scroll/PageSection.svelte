<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import GlitchText from '$lib/components/GlitchText.svelte';
	import { glitchLink } from '$lib/actions/glitchLink';
	import { onGlitchPulse } from '$lib/glitchPulse';
	import GlitchLayers from './GlitchLayers.svelte';

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
		/**
		 * Join the page-entrance glitch. Only the home scroll page opts in — the
		 * detail pages reuse these same sections and stay still.
		 */
		glitch?: boolean;
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
		glitch = false,
		children
	}: Props = $props();

	/** Matches the sgKick keyframe duration in routes/layout.css. */
	const BURST_MS = 900;
	let glitching = $state(false);

	onMount(() => {
		if (!glitch) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let timer: ReturnType<typeof setTimeout> | undefined;
		// No sound here: the hero plays one stab for the whole pulse, so six
		// sections firing at once stay a single effect rather than a pile-up.
		const off = onGlitchPulse(() => {
			glitching = true;
			clearTimeout(timer);
			timer = setTimeout(() => (glitching = false), BURST_MS);
		});

		return () => {
			off();
			clearTimeout(timer);
		};
	});
</script>

<!--
  One container, one rhythm. Every section on the site routes through this so
  gutters, header rule and vertical spacing cannot drift apart.

  `relative` is load-bearing: GlitchLayers positions against this section and
  sectionGlitch transforms and clip-paths it. Deliberately no overflow-hidden —
  the cards inside lift on hover, and clipping those at the section edge is
  worse than letting a shard run over.
-->
<section
	{id}
	class="relative border-b border-(--color-rule) last:border-b-0 {glitching
		? 'section-glitching'
		: ''}"
>
	{#if glitch}
		<GlitchLayers />
	{/if}
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
					use:glitchLink
					class="group inline-flex shrink-0 items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-(--color-text-secondary) transition-colors hover:text-(--color-accent) sm:text-[11px] sm:tracking-[0.18em]"
				>
					<!-- Only the label glitches; the arrow keeps its own slide. -->
					<GlitchText>{cta}</GlitchText>
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
