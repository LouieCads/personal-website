<script lang="ts">
	import { base } from '$app/paths';

	const ph100Url = 'https://stellarph.io/programs/ph100/2026';

	let { preview = false }: { preview?: boolean } = $props();
</script>

<section id="recognition" aria-labelledby="recognition-title" class="recognition">
	<figure>
		<a
			class="artwork"
			href={ph100Url}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="View the PH100 honorees on StellarPH (opens in a new tab)"
		>
			<img
				src={`${base}/ph100-2026.png`}
				alt="StellarPH PH100 2026 honoree Louigie Caminoy, Co-founder and CTO of Iskolar"
				width="1731"
				height="909"
				loading="lazy"
				decoding="async"
			/>
		</a>
		<figcaption>
			<h3 id="recognition-title">
				<a href={ph100Url} target="_blank" rel="noopener noreferrer">PH100 Honoree</a>
			</h3>
			<p>
				Honored to be named to StellarPH’s PH100, recognizing 100 people under 30 making remarkable
				contributions to the Filipino startup ecosystem.
			</p>
			{#if !preview}
				<p class="context">
					The annual list celebrates talent from across the Philippines in design, engineering,
					marketing, academia, media, and more.
				</p>
			{/if}
			<a class="recognition-link" href={ph100Url} target="_blank" rel="noopener noreferrer"
				>View PH100 on StellarPH <span aria-hidden="true">↗</span></a
			>
		</figcaption>
	</figure>
</section>

<style>
	.recognition {
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-rule);
		scroll-margin-top: 6rem;
	}

	figure {
		display: grid;
		gap: 2rem;
	}

	.artwork {
		display: block;
		min-width: 0;
		/* The transparent header contains dark brand marks: keep them legible in both themes. */
		background: #e6e6e6;
		border: 1px solid var(--color-border);
	}

	img {
		display: block;
		width: 100%;
		height: auto;
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--color-text-primary);
	}

	figcaption p {
		margin-top: 0.5rem;
		max-width: 65ch;
		font-size: 0.875rem;
		line-height: 1.75;
		color: var(--color-text-secondary);
	}

	figcaption .context {
		margin-top: 0.75rem;
	}

	.recognition-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-text-primary);
		text-underline-offset: 4px;
	}

	a {
		color: inherit;
		text-underline-offset: 4px;
	}

	h3 a:hover,
	.recognition-link:hover {
		text-decoration: underline;
	}

	a:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 5px;
	}

	@media (min-width: 768px) {
		figure {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			align-items: start;
			gap: 2.5rem;
		}

		figcaption {
			grid-column: span 2;
			order: -1;
		}
	}
</style>
