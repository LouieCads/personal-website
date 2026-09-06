<!--
	Overlay stack for the section-wide glitch burst.

	Markup only — the styles are global, in routes/layout.css, because the burst
	also transforms and clip-paths the *parent* section, which a component's
	scoped stylesheet cannot reach. Drop this inside any `position: relative`
	section and drive it by toggling `section-glitching` on that section.
-->
<span class="sg-halftone" aria-hidden="true"></span>
<span class="sg-scan" aria-hidden="true"></span>
<span class="sg-tear" aria-hidden="true"></span>
<span class="sg-shards" aria-hidden="true">
	<span class="sg-shard sg-shard-1"></span>
	<span class="sg-shard sg-shard-2"></span>
	<span class="sg-shard sg-shard-3"></span>
	<span class="sg-shard sg-shard-4"></span>
	<span class="sg-shard sg-shard-5"></span>
	<span class="sg-shard sg-shard-6"></span>
</span>
