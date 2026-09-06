<script lang="ts">
	import { resolve } from '$app/paths';
	import { scrollToTop } from '$lib/scroll';
	import type { SectionId } from '$lib/data/portfolio';
	import GlitchText from '$lib/components/GlitchText.svelte';
	import { glitchLink } from '$lib/actions/glitchLink';

	interface Props {
		active: SectionId | '';
		home: boolean;
	}
	let { active, home }: Props = $props();

	/** Nav goes straight to the full page for each area. */
	const items = [
		{ id: 'about' as const, number: '01', label: 'ABOUT', href: resolve('/about') },
		{ id: 'projects' as const, number: '02', label: 'PROJECTS', href: resolve('/projects') },
		{ id: 'experience' as const, number: '03', label: 'EXPERIENCE', href: resolve('/experience') },
		{ id: 'blog' as const, number: '04', label: 'BLOG', href: resolve('/blog') }
	];

	const homeHref = resolve('/');

	function goHome(e: MouseEvent) {
		if (!home) return;
		e.preventDefault();
		scrollToTop();
	}
</script>

<nav
	class="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-surface)"
	aria-label="Primary"
>
	<div
		class="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-5 py-3 sm:px-8 md:px-14 lg:px-20 xl:px-24"
	>
		<a
			href={homeHref}
			onclick={goHome}
			use:glitchLink
			class="glitch-link shrink-0 font-mono text-[10px] tracking-widest whitespace-nowrap text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) sm:text-[11px]"
		>
			<GlitchText>Louigie Caminoy</GlitchText>
		</a>

		<div class="ml-auto flex min-w-0 items-center gap-2.5 overflow-x-auto sm:gap-5">
			{#each items as item (item.id)}
				<a
					href={item.href}
					aria-current={active === item.id ? 'page' : undefined}
					use:glitchLink
					class="glitch-link relative shrink-0 py-1 font-mono text-[11px] tracking-[0.14em] transition-colors {active ===
					item.id
						? 'text-(--color-text-primary)'
						: 'text-(--color-text-secondary) hover:text-(--color-text-primary)'}"
				>
					<GlitchText>
						<span class="text-(--color-text-muted)">{item.number}</span>
						<span class="ml-1 hidden sm:inline">{item.label}</span>
					</GlitchText>
					<span
						class="absolute -bottom-[13px] left-0 h-[2px] bg-(--color-accent) transition-all duration-300 {active ===
						item.id
							? 'w-full opacity-100'
							: 'w-0 opacity-0'}"
					></span>
				</a>
			{/each}
		</div>
	</div>
</nav>
