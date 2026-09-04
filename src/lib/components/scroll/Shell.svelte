<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { scrollToId, scrollToTop } from '$lib/scroll';
	import BinaryBackground from '../BinaryBackground.svelte';
	import SiteNav from './SiteNav.svelte';
	import CLI from '../CLI.svelte';
	import { sections, type SectionId } from '$lib/data/portfolio';

	interface Props {
		/** true on the scrollable home page; enables scroll-spy on the nav */
		home?: boolean;
		/** nav highlight on a detail page */
		section?: SectionId | '';
		children: Snippet;
	}
	let { home = false, section = '', children }: Props = $props();

	let spied = $state<SectionId | ''>('');
	const active = $derived(home ? spied : section);

	/** CLI commands stay live: they scroll on the home page, route from anywhere else. */
	function navigate(view: string) {
		if (view === 'commands') return void goto(resolve('/commands'));
		const id = view === 'home' ? 'hero' : view;

		if (home) {
			if (id === 'hero') scrollToTop();
			else scrollToId(id);
			return;
		}
		void goto(resolve('/')).then(() => {
			if (id === 'hero') scrollToTop();
			else scrollToId(id);
		});
	}

	onMount(() => {
		if (!home) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) spied = entry.target.id as SectionId;
				}
			},
			{ rootMargin: '-45% 0px -50% 0px', threshold: 0 }
		);

		for (const s of sections) {
			const el = document.getElementById(s.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});
</script>

<!-- pb clears the pinned CLI so the last row is never trapped behind it -->
<!-- The binary field runs the length of the page, not just the hero. -->
<div class="scanlines pointer-events-none fixed inset-0 z-0" aria-hidden="true">
	<BinaryBackground />
</div>

<div class="relative z-10 min-h-dvh pb-16 sm:pb-18">
	<SiteNav {active} {home} />
	<main>
		{@render children()}
	</main>

	<footer class="border-t border-(--color-rule)">
		<div
			class="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-5 sm:px-8 md:px-14 lg:px-20 xl:px-24"
		>
			<span class="font-mono text-[10px] text-(--color-text-muted)">
				© {new Date().getFullYear()} Louigie Caminoy
			</span>
			<span class="font-mono text-[10px] text-(--color-text-muted)">Built with precision.</span>
		</div>
	</footer>
</div>

<div class="fixed inset-x-0 bottom-0 z-50">
	<CLI {navigate} />
</div>
