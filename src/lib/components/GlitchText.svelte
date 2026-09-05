<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<!--
	Renders its content four extra times as stacked, aria-hidden copies: two
	full-height colour echoes and two clipped bands. Real DOM copies rather than
	`content: attr(data-text)` pseudo-elements, so responsive children (the nav
	label is `hidden sm:inline`) reflow identically in every layer.

	Styling and the hover keyframes live in routes/layout.css under
	`.glitch-link`, so the effect is driven by the *parent* link's :hover and
	:focus-visible rather than by the text box alone — hovering the link's
	padding counts too.
-->
<span class="glitch-text">
	<span class="gt-layer gt-a" aria-hidden="true">{@render children()}</span>
	<span class="gt-layer gt-b" aria-hidden="true">{@render children()}</span>
	<span class="gt-layer gt-slice gt-s1" aria-hidden="true">{@render children()}</span>
	<span class="gt-layer gt-slice gt-s2" aria-hidden="true">{@render children()}</span>
	<span class="gt-core">{@render children()}</span>
</span>
