<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();

	const specialties = [
		{ label: 'Blockchain Development', detail: 'Smart contracts, DApps, and decentralized systems', index: '01' },
		{ label: 'Systems Architecture', detail: 'Scalable infrastructure and distributed systems', index: '02' },
		{ label: 'System Design', detail: 'High-level design patterns and technical blueprints', index: '03' },
		{ label: 'Technical Leadership', detail: 'Team direction, code reviews, and strategic decisions', index: '04' }
	];

	const stats = [
		{ value: 'CTO', label: 'Current Role' },
		{ value: '3+', label: 'Years Building' },
		{ value: '2', label: 'Live Projects' }
	];
</script>

<div class="view-enter flex h-full flex-col px-18 py-8">

	<!-- Header -->
	<div class="mb-10 flex items-center gap-4">
		<button
			onclick={() => navigate('home')}
			class="cursor-pointer font-mono text-[11px] tracking-widest text-[var(--color-text-muted)] transition-colors hover:text-white"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-2xl text-[var(--color-accent)]">01</span>
		<span class="font-mono text-sm tracking-[0.2em] text-white">ABOUT</span>
		<span class="h-px flex-1 bg-[var(--color-border)]"></span>
		<div class="flex items-center gap-2">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
			<span class="font-mono text-[10px] tracking-widest text-emerald-500/70">OPEN TO OPPORTUNITIES</span>
		</div>
	</div>

	<div class="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-5">

		<!-- Left: Bio -->
		<div class="flex flex-col justify-center lg:col-span-2">
			<p class="mb-1 font-mono text-xs tracking-widest text-[var(--color-text-muted)]">// WHO I AM</p>
			<h2 class="mb-6 text-3xl font-light leading-snug tracking-tight text-white">
				Growth-driven engineer.<br />
				<span class="text-[var(--color-text-secondary)]">Comfort kills greatness.</span>
			</h2>

			<p class="mb-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
				A neuroplastic software engineer passionate about blockchain technology, systems architecture,
				and constant evolution. I build at the intersection of decentralized systems and scalable infrastructure.
			</p>
			<p class="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)]">
				Every project is an opportunity to push boundaries and deliver real value — clean architecture,
				pragmatic solutions, and the compounding power of consistent growth.
			</p>

			<!-- Stats row -->
			<div class="flex gap-8 border-t border-[var(--color-border)] pt-6">
				{#each stats as stat}
					<div>
						<p class="font-mono text-xl font-semibold text-white">{stat.value}</p>
						<p class="mt-0.5 font-mono text-xs tracking-wider text-[var(--color-text-muted)]">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Right: Specialties -->
		<div class="flex flex-col justify-center lg:col-span-3">
			<p class="mb-4 font-mono text-xs tracking-widest text-[var(--color-text-muted)]">// SPECIALTIES</p>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each specialties as spec}
					<div class="group relative border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-alt)]">
						<div class="mb-4 flex items-center gap-3">
							<span class="font-mono text-xs text-[var(--color-accent)]">{spec.index}</span>
							<span class="h-px flex-1 bg-[var(--color-border)] transition-colors group-hover:bg-[var(--color-border-hover)]"></span>
						</div>
						<h3 class="mb-2 font-mono text-sm font-semibold tracking-wide text-[var(--color-text-primary)]">
							{spec.label}
						</h3>
						<p class="text-xs leading-relaxed text-[var(--color-text-muted)]">
							{spec.detail}
						</p>
					</div>
				{/each}
			</div>
		</div>

	</div>
</div>
