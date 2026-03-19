<script lang="ts">
	const specialties = [
		{ label: 'Blockchain Development', detail: 'Smart contracts, DApps, and decentralized systems' },
		{ label: 'Systems Architecture', detail: 'Scalable infrastructure and distributed systems' },
		{ label: 'System Design', detail: 'High-level design patterns and technical blueprints' },
		{ label: 'Technical Leadership', detail: 'Team direction, code reviews, and strategic decisions' }
	];
</script>

<div class="view-enter flex h-full flex-col px-18 py-8">
	<div class="mb-8 flex items-center gap-4">
		<span class="font-mono text-xs text-[var(--color-accent)]">01</span>
		<span class="font-mono text-sm tracking-wider text-white">ABOUT</span>
		<span class="h-px flex-1 bg-[var(--color-border)]"></span>
	</div>

	<div class="grid flex-1 gap-12 lg:grid-cols-2">
		<div class="flex flex-col justify-center">
			<p class="mb-6 max-w-lg text-base leading-relaxed text-[var(--color-text-secondary)]">
				A neuroplastic, growth-driven software engineer passionate about tech, fitness,
				and constant evolution. I build at the intersection of blockchain technology and
				systems architecture.
			</p>
			<p class="mb-8 max-w-lg text-base leading-relaxed text-[var(--color-text-secondary)]">
				My philosophy is simple — comfort kills greatness. Every project is an opportunity
				to push boundaries and deliver real value. I believe in clean architecture,
				pragmatic solutions, and the compounding power of consistent growth.
			</p>

			<div class="flex items-center gap-3">
				<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
				<span class="font-mono text-xs text-emerald-400/80">Open to opportunities</span>
			</div>
		</div>

		<div class="flex flex-col justify-center">
			<div class="grid gap-3 sm:grid-cols-2">
				{#each specialties as spec, i}
					<div
						class="border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 transition-all hover:border-[var(--color-border-hover)]"
					>
						<span class="mb-2 block font-mono text-[10px] text-[var(--color-text-muted)]">0{i + 1}</span>
						<h3 class="mb-2 font-mono text-xs font-medium text-[var(--color-text-primary)]">
							{spec.label}
						</h3>
						<p class="text-[11px] leading-relaxed text-[var(--color-text-muted)]">
							{spec.detail}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
