<script lang="ts">
	interface Props {
		navigate: (view: string) => void;
	}
	let { navigate }: Props = $props();

	const projects = [
		{
			title: 'iSkolar',
			description:
				'A scholarship application and management platform connecting university students with scholarship providers, streamlining the application and selection process.',
			tech: ['TypeScript', 'Solidity', 'Hardhat', 'React', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Docker'],
			link: 'https://iskolar.site/',
			index: '01',
			image: '/projects/iskolar-preview.png'
		},
		{
			title: 'USMO',
			description:
				'A centralized landing page for UMak Student Multimedia Organization showcasing projects, initiatives, and social platforms for improved accessibility and engagement.',
			tech: ['Hostinger Website Builder', 'HTML', 'CSS', 'JavaScript'],
			link: 'https://connect.usmo.org.ph/',
			index: '02',
			image: '/projects/usmo-preview.png'
		}
	];
</script>

<div class="view-enter flex h-full flex-col px-24 py-8">

	<div class="mb-8 flex items-center gap-4">
		<button
			onclick={() => navigate('home')}
			class="cursor-pointer font-mono text-[11px] tracking-widest text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-2xl text-(--color-accent)">02</span>
		<span class="font-mono text-sm tracking-wider text-(--color-text-primary)">PROJECTS</span>
		<span class="h-px flex-1 bg-(--color-border)"></span>
	</div>

	<div class="flex flex-1 flex-col justify-center gap-5">
		{#each projects as project (project.index)}
			<a
				href={project.link}
				target="_blank"
				rel="noopener noreferrer external"
				class="group flex h-55 border border-(--color-border) bg-(--color-surface-card) transition-all hover:border-(--color-border-hover) hover:bg-(--color-surface-alt)"
			>
				<!-- Left: image -->
				<div class="w-95 shrink-0 overflow-hidden border-r border-(--color-border)">
					<img
						src={project.image}
						alt={project.title}
						class="h-full w-full object-cover object-top opacity-85 transition-opacity group-hover:opacity-100"
					/>
				</div>

				<!-- Right: content -->
				<div class="flex flex-1 flex-col justify-between px-6 py-4 lg:px-8 lg:py-6">
					<div>
						<div class="mb-3 flex items-start justify-between">
							<div>
								<span class="mb-2 block font-mono text-xs text-(--color-text-muted)">{project.index}</span>
								<h3 class="text-xl font-medium text-(--color-text-primary) transition-colors group-hover:text-(--color-accent)">
									{project.title}
								</h3>
							</div>
							<span class="font-mono text-sm text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">
								&nearr;
							</span>
						</div>
						<p class="mb-5 text-md leading-relaxed text-(--color-text-secondary)">
							{project.description}
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each project.tech as t (t)}
							<span class="border border-(--color-border) px-3 py-1 font-mono text-[10px] text-(--color-text-secondary)]">
								{t}
							</span>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>