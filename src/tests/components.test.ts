import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Hero from '$lib/components/Hero.svelte';
import About from '$lib/components/About.svelte';
import Projects from '$lib/components/Projects.svelte';
import Contact from '$lib/components/Contact.svelte';
import CLI from '$lib/components/CLI.svelte';

describe('Hero', () => {
	it('renders the role subtitle', () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		expect(screen.getByText('CTO')).toBeInTheDocument();
		expect(screen.getByText('BLOCKCHAIN DEVELOPER')).toBeInTheDocument();
		expect(screen.getByText('PROJECT MANAGER')).toBeInTheDocument();
	});

	it('renders all CTA buttons', () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		expect(screen.getByText('ABOUT')).toBeInTheDocument();
		expect(screen.getByText('PROJECTS')).toBeInTheDocument();
		expect(screen.getByText('TOUCH')).toBeInTheDocument();
	});

	it('calls navigate to contact when GET IN TOUCH clicked', async () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		await fireEvent.click(screen.getByText('TOUCH').closest('button')!);
		expect(navigate).toHaveBeenCalledWith('contact');
	});

	it('calls navigate to about when ABOUT clicked', async () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		await fireEvent.click(screen.getByText('ABOUT').closest('button')!);
		expect(navigate).toHaveBeenCalledWith('about');
	});

	it('calls navigate to projects when PROJECTS clicked', async () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		await fireEvent.click(screen.getByText('PROJECTS').closest('button')!);
		expect(navigate).toHaveBeenCalledWith('projects');
	});

	it('renders BitName canvas with aria-label', () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		expect(screen.getByRole('img', { name: /LOUIGIE/i })).toBeInTheDocument();
	});
});

describe('About', () => {
	it('renders section heading', () => {
		render(About);
		expect(screen.getByText('ABOUT')).toBeInTheDocument();
	});

	it('renders all specialties', () => {
		render(About);
		expect(screen.getByText('Blockchain Development')).toBeInTheDocument();
		expect(screen.getByText('Systems Architecture')).toBeInTheDocument();
		expect(screen.getByText('System Design')).toBeInTheDocument();
		expect(screen.getByText('Technical Leadership')).toBeInTheDocument();
	});

	it('renders availability status', () => {
		render(About);
		expect(screen.getByText('Open to opportunities')).toBeInTheDocument();
	});

	it('renders bio text', () => {
		render(About);
		expect(screen.getByText(/neuroplastic, growth-driven/i)).toBeInTheDocument();
	});
});

describe('Projects', () => {
	it('renders section heading', () => {
		render(Projects);
		expect(screen.getByText('PROJECTS')).toBeInTheDocument();
	});

	it('renders project names', () => {
		render(Projects);
		expect(screen.getByText('iSkolar')).toBeInTheDocument();
		expect(screen.getByText('USMO')).toBeInTheDocument();
	});

	it('renders project descriptions', () => {
		render(Projects);
		expect(screen.getByText(/scholarship application/i)).toBeInTheDocument();
		expect(screen.getByText(/UMak Student Multimedia/i)).toBeInTheDocument();
	});

	it('renders tech stack tags', () => {
		render(Projects);
		expect(screen.getByText('TypeScript')).toBeInTheDocument();
		expect(screen.getByText('Solidity')).toBeInTheDocument();
		expect(screen.getByText('Docker')).toBeInTheDocument();
	});

	it('links to external project URLs', () => {
		render(Projects);
		const iskolarLink = screen.getByText('iSkolar').closest('a');
		expect(iskolarLink).toHaveAttribute('href', 'https://iskolar.site/');
		expect(iskolarLink).toHaveAttribute('target', '_blank');
	});
});

describe('Contact', () => {
	it('renders section heading', () => {
		render(Contact);
		expect(screen.getByText('CONTACT')).toBeInTheDocument();
	});

	it('renders email link', () => {
		render(Contact);
		const emailLink = screen.getByText('louigiecads143@gmail.com').closest('a');
		expect(emailLink).toHaveAttribute('href', 'mailto:louigiecads143@gmail.com');
	});

	it('renders LinkedIn link', () => {
		render(Contact);
		const link = screen.getByText('linkedin.com/in/louie1221').closest('a');
		expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/louie1221/');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('renders GitHub link', () => {
		render(Contact);
		const link = screen.getByText('github.com/LouieCads').closest('a');
		expect(link).toHaveAttribute('href', 'https://github.com/LouieCads');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('renders footer copyright', () => {
		render(Contact);
		expect(screen.getByText(/Louigie/)).toBeInTheDocument();
	});
});


describe('CLI', () => {
	beforeEach(() => {
		Element.prototype.scrollIntoView = vi.fn();
	});

	it('renders the terminal prompt', () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		expect(screen.getByText('visitor@louigie')).toBeInTheDocument();
		expect(screen.getByText('$')).toBeInTheDocument();
	});

	it('renders the input with placeholder', () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		expect(input).toBeInTheDocument();
	});

	it('shows error for invalid command', async () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/invalid' } });
		await fireEvent.submit(input.closest('form')!);
		expect(screen.getByText(/command not found: \/invalid/)).toBeInTheDocument();
	});

	it('calls navigate for valid navigation command', async () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/about' } });
		await fireEvent.submit(input.closest('form')!);
		expect(navigate).toHaveBeenCalledWith('about');
	});

	it('opens external link for /github command', async () => {
		const navigate = vi.fn();
		const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/github' } });
		await fireEvent.submit(input.closest('form')!);
		expect(openSpy).toHaveBeenCalledWith('https://github.com/LouieCads', '_blank');
		openSpy.mockRestore();
	});

	it('opens resume for /resume command', async () => {
		const navigate = vi.fn();
		const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/resume' } });
		await fireEvent.submit(input.closest('form')!);
		expect(openSpy).toHaveBeenCalledWith('/resume.pdf', '_blank');
		openSpy.mockRestore();
	});

	it('shows help text for /help command', async () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/help' } });
		await fireEvent.submit(input.closest('form')!);
		expect(screen.getByText(/Navigation.*\/home.*\/about/)).toBeInTheDocument();
	});

	it('clears input after command submission', async () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i) as HTMLInputElement;
		await fireEvent.input(input, { target: { value: '/home' } });
		await fireEvent.submit(input.closest('form')!);
		expect(input.value).toBe('');
	});
});
