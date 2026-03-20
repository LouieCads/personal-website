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

<div class="view-enter flex h-full flex-col px-4 py-4 sm:px-8 sm:py-6 md:px-16 md:py-8 lg:px-24">

	<div class="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4 md:mb-8">
		<button
			onclick={() => navigate('home')}
			class="cursor-pointer font-mono text-[11px] tracking-widest text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
		>
			&larr; HOME
		</button>
		<span class="font-mono text-xl text-(--color-accent) sm:text-2xl">02</span>
		<span class="font-mono text-sm tracking-wider text-(--color-text-primary)">PROJECTS</span>
		<span class="h-px flex-1 bg-(--color-border)"></span>
	</div>

	<div class="flex flex-1 pt-2 sm:pt-0 flex-col overflow-y-auto">
		<div class="my-auto flex flex-col gap-4 sm:gap-5">
		{#each projects as project (project.index)}
			<a
				href={project.link}
				target="_blank"
				rel="noopener noreferrer external"
				class="group flex flex-col border border-(--color-border) bg-(--color-surface-card) transition-all hover:border-(--color-border-hover) hover:bg-(--color-surface-alt) sm:flex-row sm:h-55"
			>
				<!-- Left: image -->
				<div class="h-40 shrink-0 overflow-hidden border-b border-(--color-border) sm:h-auto sm:w-60 sm:border-b-0 sm:border-r md:w-72 lg:w-95">
					<img
						src={project.image}
						alt={project.title}
						class="h-full w-full object-cover object-top opacity-85 transition-opacity group-hover:opacity-100"
					/>
				</div>

				<!-- Right: content -->
				<div class="flex flex-1 flex-col justify-between p-4 sm:px-5 sm:py-4 lg:px-8 lg:py-6">
					<div>
						<div class="mb-2 flex items-start justify-between sm:mb-3">
							<div>
								<span class="mb-1 block font-mono text-xs text-(--color-text-muted) sm:mb-2">{project.index}</span>
								<h3 class="text-lg font-medium text-(--color-text-primary) transition-colors group-hover:text-(--color-accent) sm:text-xl">
									{project.title}
								</h3>
							</div>
							<span class="font-mono text-sm text-(--color-text-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--color-accent)">
								&nearr;
							</span>
						</div>
						<p class="mb-3 text-sm leading-relaxed text-(--color-text-secondary) sm:mb-5 sm:text-base">
							{project.description}
						</p>
					</div>
					<div class="flex flex-wrap gap-1.5 sm:gap-2">
						{#each project.tech as t (t)}
							<span class="border border-(--color-border) px-2 py-0.5 font-mono text-[9px] text-(--color-text-secondary) sm:px-3 sm:py-1 sm:text-[10px]">
								{t}
							</span>
						{/each}
					</div>
				</div>
			</a>
		{/each}
		</div>
	</div>
</div>
