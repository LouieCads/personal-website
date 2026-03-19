<script lang="ts">
	const projects = [
		{
			title: 'iSkolar',
			description:
				'A scholarship application and management platform that connects university students with scholarship providers, streamlining the application and selection process.',
			tech: ['TypeScript', 'Solidity', 'React', 'Express.js', 'PostgreSQL', 'Docker'],
			link: 'https://iskolar.site/',
			index: '01'
		},
		{
			title: 'USMO',
			description:
				'A centralized landing page for UMak Student Multimedia Organization showcasing projects, initiatives, and social platforms for improved accessibility and engagement.',
			tech: ['Hostinger'],
			link: 'https://connect.usmo.org.ph/',
			index: '02'
		}
	];
</script>

<section id="projects" class="relative z-10 px-6 py-32">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 flex items-center gap-4">
			<span class="font-mono text-xs text-[var(--color-accent)]">02</span>
			<h2 class="text-2xl font-light tracking-tight text-white">Projects</h2>
			<span class="h-px flex-1 bg-[var(--color-border)]"></span>
		</div>

		<div class="grid gap-6">
			{#each projects as project}
				<a
					href={project.link}
					target="_blank"
					rel="noopener noreferrer"
					class="group block border border-[var(--color-border)] bg-[var(--color-surface-card)] p-8 transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-alt)]"
				>
					<div class="mb-6 flex items-start justify-between">
						<div>
							<span class="mb-2 block font-mono text-[10px] text-[var(--color-text-muted)]">{project.index}</span>
							<h3 class="text-xl font-medium text-white transition-colors group-hover:text-[var(--color-accent)]">
								{project.title}
							</h3>
						</div>
						<span
							class="font-mono text-sm text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
						>
							&nearr;
						</span>
					</div>

					<p class="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
						{project.description}
					</p>

					<div class="flex flex-wrap gap-2">
						{#each project.tech as t}
							<span class="border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] text-[var(--color-text-muted)]">
								{t}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
