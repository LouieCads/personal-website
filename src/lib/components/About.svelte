<script lang="ts">
	import BinaryFace from './BinaryFace.svelte';

	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();

	const stats = [
		{ value: 'CTO', label: 'Current Role' },
		{ value: 'Full Stack', label: 'Core Skillset' },
		{ value: 'Agile', label: 'Team Workflow' },
		{ value: '5', label: 'Devs Managed' },
		{ value: '2', label: 'Live Projects' },
	];

	const specialties = [
		{ label: 'Blockchain Development', detail: 'Smart contracts, DApps, and decentralized systems', index: '01' },
		{ label: 'Systems Architecture', detail: 'Scalable infrastructure and distributed systems', index: '02' },
		{ label: 'Technical Leadership', detail: 'Team direction, code reviews, and strategic decisions', index: '03' },
		{ label: 'System Design', detail: 'High-level design patterns and technical blueprints', index: '04' },
		{ label: 'Project Management', detail: 'Agile workflows, delivery pipelines, and cross-team coordination', index: '05' }
	];
</script>

<div class="view-enter flex h-full flex-col px-4 py-4 gap-4 sm:px-8 sm:py-6 sm:gap-5 md:px-16 md:py-8 md:gap-6 lg:px-24">

	<!-- Header -->
	<div class="mb-2 flex items-center gap-3 sm:mb-4 sm:gap-4 md:mb-10">
		<button
			onclick={() => navigate('home')}
			class="cursor-pointer font-mono text-[11px] tracking-widest text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-xl text-(--color-accent) sm:text-2xl">01</span>
		<span class="font-mono text-sm tracking-[0.2em] text-(--color-text-primary)">ABOUT</span>
		<span class="h-px flex-1 bg-(--color-border)"></span>
		<div class="hidden items-center gap-2 sm:flex">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
			<span class="font-mono text-[10px] tracking-widest text-emerald-500/70">OPEN TO OPPORTUNITIES</span>
		</div>
	</div>

	<div class="grid min-h-0 flex-1 items-start grid-cols-1 gap-6 overflow-y-auto sm:gap-8 lg:grid-cols-7 lg:gap-10 lg:overflow-visible">

		<!-- Column 1: [Face | Bio] -->
		<div class="flex flex-col lg:col-span-4 justify-center gap-6 sm:gap-8 lg:gap-10">

			<!-- Face + Bio: stacked on mobile, side by side on sm+ -->
			<div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">

				<!-- Binary face -->
				<div class="flex shrink-0 flex-col items-center">
					<div class="relative w-32 sm:w-40 md:w-52">
						<span class="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-(--color-border-hover)"></span>
						<span class="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-(--color-border-hover)"></span>
						<span class="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-(--color-border-hover)"></span>
						<span class="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-(--color-border-hover)"></span>
						<div class="group/face aspect-square w-full overflow-hidden">
							<BinaryFace />
							<img
								src="/profile.jpg"
								alt="Louigie Caminoy"
								class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover/face:opacity-100"
							/>
						</div>
					</div>
					<div class="mt-3 text-center">
						<p class="font-mono text-xs tracking-[0.25em] text-(--color-text-secondary)">LOUIGIE C. CAMINOY</p>
					</div>
				</div>

				<!-- Bio description -->
				<div class="flex-1">
					<p class="mb-1 font-mono text-xs tracking-widest text-(--color-text-muted)">// WHO I AM</p>
					<h2 class="mb-3 text-lg font-light leading-snug tracking-tight text-(--color-text-primary) sm:text-xl">
						Growth-driven engineer.
						<span class="text-(--color-text-secondary)">Discipline over comfort.</span>
					</h2>
					<p class="mb-3 text-sm leading-relaxed text-(--color-text-secondary)">
						A neuroplastic software engineering student focused on blockchain, systems architecture, and emerging technologies.
						I build at the intersection of decentralized systems and scalable infrastructure — turning ideas into real, working products.
					</p>
					<p class="mb-3 text-sm leading-relaxed text-(--color-text-secondary)">
						I prioritize execution: make it exist first, refine it later. Each project is an opportunity to push boundaries through clean architecture,
						thoughtful decisions, and continuous improvement.
					</p>
					<p class="mb-3 text-sm leading-relaxed text-(--color-text-secondary)">
						Alongside building, I serve as a student leader at the University of Makati,
						where I contribute to academic and technical activities within the community.
					</p>
					<p class="text-sm leading-relaxed text-(--color-text-secondary)">
						Outside of code, I stay disciplined through gym training, calisthenics, and running —
						building both systems and self.
					</p>
				</div>
			</div>

			<!-- Stats row — below face and bio -->
			<div class="grid grid-cols-3 gap-4 border-t border-(--color-border) pt-4 sm:flex sm:gap-8 sm:pt-6 md:gap-12 md:pt-8">
				{#each stats as stat (stat)}
					<div>
						<p class="font-mono text-base font-semibold text-(--color-text-primary) sm:text-lg md:text-xl">{stat.value}</p>
						<p class="mt-0.5 font-mono text-[10px] tracking-wider text-(--color-text-muted) sm:text-xs">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Column 2: Specialties -->
		<div class="flex flex-col lg:col-span-3 justify-center">
			<p class="mb-4 font-mono text-xs tracking-widest text-(--color-text-muted)">// SPECIALTIES</p>
			<div class="flex flex-col gap-3">
				{#each specialties as spec (spec)}
					<div class="group relative border border-(--color-border) bg-(--color-surface-card) p-3 transition-all duration-200 hover:border-(--color-border-hover) hover:bg-(--color-surface-alt) sm:p-4">
						<div class="flex items-center gap-3">
							<span class="font-mono text-xs text-(--color-primary)">{spec.index}</span>
							<h3 class="font-mono text-xs font-semibold tracking-wide text-(--color-text-primary) sm:text-sm">
								{spec.label}
							</h3>
							<span class="h-px flex-1 bg-(--color-border) transition-colors group-hover:bg-(--color-border-hover)"></span>
						</div>
						<p class="mt-2 pl-8 text-xs leading-relaxed text-(--color-text-muted)">
							{spec.detail}
						</p>
					</div>
				{/each}
			</div>
		</div>

	</div>
</div>
