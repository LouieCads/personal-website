<script lang="ts">
	import Shell from '$lib/components/scroll/Shell.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BackBar from '$lib/components/scroll/BackBar.svelte';
	import ExperienceSection from '$lib/components/scroll/ExperienceSection.svelte';
</script>

<SEO
	title="Experience | Louigie Caminoy"
	description="Work history and education: CTO at iSkolar, Project Manager at Academy, AI Lead at AWS Learning Club - Heron, and Software Engineer Intern at Tutorials Dojo."
	path="/experience"
/>

<Shell section="experience">
	<h1 class="sr-only">Experience — Louigie Caminoy</h1>
	<BackBar anchor="experience" title="EXPERIENCE" />
	<ExperienceSection />
</Shell>
