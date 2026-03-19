<script lang="ts">
	const specialties = [
		{ label: 'Blockchain Development', description: 'Smart contracts, DApps, and decentralized systems' },
		{ label: 'Systems Architecture', description: 'Scalable infrastructure and distributed systems' },
		{ label: 'System Design', description: 'High-level design patterns and technical blueprints' },
		{ label: 'Technical Leadership', description: 'Team direction, code reviews, and strategic decisions' }
	];
</script>

<section id="about" class="relative z-10 px-6 py-32">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 flex items-center gap-4">
			<span class="font-mono text-xs text-[var(--color-accent)]">01</span>
			<h2 class="text-2xl font-light tracking-tight text-white">About</h2>
			<span class="h-px flex-1 bg-[var(--color-border)]"></span>
		</div>

		<div class="grid gap-16 lg:grid-cols-2">
			<div>
				<p class="mb-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
					I'm a growth-driven engineer who thrives at the intersection of blockchain technology
					and systems architecture. With experience leading teams and shipping products, I bring
					a bias toward action and a commitment to building things that matter.
				</p>
				<p class="text-base leading-relaxed text-[var(--color-text-secondary)]">
					My philosophy is simple: comfort kills greatness. Every project is an opportunity
					to push boundaries, learn something new, and deliver real value. I believe in clean
					architecture, pragmatic solutions, and the compounding power of consistent growth.
				</p>

				<div class="mt-8 flex items-center gap-3">
					<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
					<span class="font-mono text-xs text-emerald-500">Open to opportunities</span>
				</div>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each specialties as specialty, i}
					<div
						class="group border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 transition-all hover:border-[var(--color-border-hover)]"
					>
						<span class="mb-1 block font-mono text-[10px] text-[var(--color-text-muted)]">0{i + 1}</span>
						<h3 class="mb-2 font-mono text-sm font-medium text-[var(--color-text-primary)]">
							{specialty.label}
						</h3>
						<p class="text-xs leading-relaxed text-[var(--color-text-muted)]">
							{specialty.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
