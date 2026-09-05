<script lang="ts">
	import { resolve } from '$app/paths';
	import GlitchText from '$lib/components/GlitchText.svelte';
	import { glitchLink } from '$lib/actions/glitchLink';

	interface Props {
		/** which home section this page expands */
		anchor: string;
		title: string;
	}
	let { anchor, title }: Props = $props();

	const homeHref = resolve('/');
</script>

<div class="border-b border-(--color-rule) bg-(--color-surface-alt)/40">
	<div
		class="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-5 py-2.5 sm:px-8 md:px-14 lg:px-20 xl:px-24"
	>
		<a
			href="{homeHref}#{anchor}"
			use:glitchLink
			class="group inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
		>
			<!-- Only the label glitches; the arrow keeps its own slide. -->
			<span class="inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
			<GlitchText>{title}</GlitchText>
		</a>
	</div>
</div>
