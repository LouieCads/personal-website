import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Hero from '$lib/components/Hero.svelte';
import About from '$lib/components/About.svelte';
import Projects from '$lib/components/Projects.svelte';
import Contact from '$lib/components/Contact.svelte';
import CLI from '$lib/components/CLI.svelte';
import Nav from '$lib/components/Nav.svelte';

describe('Hero', () => {
	it('renders the name and role', () => {
		render(Hero);
		expect(screen.getByText('LOUIGIE')).toBeInTheDocument();
		expect(screen.getByText(/Blockchain Developer/)).toBeInTheDocument();
		expect(screen.getByText(/Project Manager/)).toBeInTheDocument();
	});

	it('renders tagline', () => {
		render(Hero);
		expect(screen.getByText(/comfort_kills_greatness/)).toBeInTheDocument();
	});

	it('renders CTA buttons', () => {
		render(Hero);
		expect(screen.getByText('View Projects')).toBeInTheDocument();
		expect(screen.getByText('Get in Touch')).toBeInTheDocument();
	});

	it('links View Projects to #projects', () => {
		render(Hero);
		const link = screen.getByText('View Projects').closest('a');
		expect(link).toHaveAttribute('href', '#projects');
	});
});

describe('About', () => {
	it('renders section heading', () => {
		render(About);
		expect(screen.getByText('About')).toBeInTheDocument();
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
});

describe('Projects', () => {
	it('renders section heading', () => {
		render(Projects);
		expect(screen.getByText('Projects')).toBeInTheDocument();
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
		expect(screen.getByText('Contact')).toBeInTheDocument();
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

describe('Nav', () => {
	it('renders navigation links', () => {
		render(Nav);
		expect(screen.getByText('About')).toBeInTheDocument();
		expect(screen.getByText('Projects')).toBeInTheDocument();
		expect(screen.getByText('Contact')).toBeInTheDocument();
	});

	it('renders resume link', () => {
		render(Nav);
		const resumeLink = screen.getByText('Resume').closest('a');
		expect(resumeLink).toHaveAttribute('href', '/resume.pdf');
		expect(resumeLink).toHaveAttribute('target', '_blank');
	});

	it('renders home link with terminal-style path', () => {
		render(Nav);
		expect(screen.getByText('~/louigie')).toBeInTheDocument();
	});
});

describe('CLI', () => {
	beforeEach(() => {
		// Mock scrollIntoView
		Element.prototype.scrollIntoView = vi.fn();
	});

	it('renders the terminal prompt', () => {
		render(CLI);
		expect(screen.getByText('~$')).toBeInTheDocument();
	});

	it('renders the input with placeholder', () => {
		render(CLI);
		const input = screen.getByPlaceholderText(/Try/);
		expect(input).toBeInTheDocument();
	});

	it('shows error for invalid command', async () => {
		render(CLI);
		const input = screen.getByPlaceholderText(/Try/);
		await fireEvent.input(input, { target: { value: '/invalid' } });
		await fireEvent.submit(input.closest('form')!);
		expect(screen.getByText(/command not found: \/invalid/)).toBeInTheDocument();
	});

	it('scrolls to section for valid navigation command', async () => {
		// Create a target element
		const section = document.createElement('section');
		section.id = 'about';
		document.body.appendChild(section);

		render(CLI);
		const input = screen.getByPlaceholderText(/Try/);
		await fireEvent.input(input, { target: { value: '/about' } });
		await fireEvent.submit(input.closest('form')!);

		expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

		document.body.removeChild(section);
	});

	it('opens external link for /github command', async () => {
		const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

		render(CLI);
		const input = screen.getByPlaceholderText(/Try/);
		await fireEvent.input(input, { target: { value: '/github' } });
		await fireEvent.submit(input.closest('form')!);

		expect(openSpy).toHaveBeenCalledWith('https://github.com/LouieCads', '_blank');
		openSpy.mockRestore();
	});

	it('opens resume for /resume command', async () => {
		const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

		render(CLI);
		const input = screen.getByPlaceholderText(/Try/);
		await fireEvent.input(input, { target: { value: '/resume' } });
		await fireEvent.submit(input.closest('form')!);

		expect(openSpy).toHaveBeenCalledWith('/resume.pdf', '_blank');
		openSpy.mockRestore();
	});

	it('clears input after command submission', async () => {
		render(CLI);
		const input = screen.getByPlaceholderText(/Try/) as HTMLInputElement;
		await fireEvent.input(input, { target: { value: '/home' } });
		await fireEvent.submit(input.closest('form')!);
		expect(input.value).toBe('');
	});
});
