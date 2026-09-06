import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Hero from '$lib/components/Hero.svelte';
import About from '$lib/components/About.svelte';
import Projects from '$lib/components/Project.svelte';
import Contact from '$lib/components/Contact.svelte';
import CLI from '$lib/components/CLI.svelte';

describe('Hero', () => {
	it('renders the role subtitle', () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		expect(screen.getByText('DEVELOPER')).toBeInTheDocument();
		expect(screen.getByText('PRODUCT BUILDER')).toBeInTheDocument();
	});

	it('renders all CTA buttons', () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		expect(screen.getByRole('button', { name: '[ ABOUT ]' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '[ PROJECTS ]' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '[ GET IN TOUCH ]' })).toBeInTheDocument();
	});

	it('calls navigate to contact when GET IN TOUCH clicked', async () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		await fireEvent.click(screen.getByRole('button', { name: '[ GET IN TOUCH ]' }));
		expect(navigate).toHaveBeenCalledWith('contact');
	});

	it('calls navigate to about when ABOUT clicked', async () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		await fireEvent.click(screen.getByRole('button', { name: '[ ABOUT ]' }));
		expect(navigate).toHaveBeenCalledWith('about');
	});

	it('calls navigate to projects when PROJECTS clicked', async () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		await fireEvent.click(screen.getByRole('button', { name: '[ PROJECTS ]' }));
		expect(navigate).toHaveBeenCalledWith('projects');
	});

	it('renders BitName canvas with aria-label', () => {
		const navigate = vi.fn();
		render(Hero, { props: { navigate } });
		expect(screen.getByRole('img', { name: 'LOUIGIE CAMINOY' })).toBeInTheDocument();
	});
});

describe('About', () => {
	it('renders section heading', () => {
		render(About, { props: { navigate: vi.fn() } });
		expect(screen.getByText('ABOUT')).toBeInTheDocument();
	});

	it('renders all specialties', () => {
		render(About, { props: { navigate: vi.fn() } });
		expect(screen.getByText('Systems Architecture')).toBeInTheDocument();
		expect(screen.getByText('System Design')).toBeInTheDocument();
		expect(screen.getByText('Technical Leadership')).toBeInTheDocument();
	});

	it('renders the stat row', () => {
		render(About, { props: { navigate: vi.fn() } });
		expect(screen.getByText('CTO')).toBeInTheDocument();
		expect(screen.getByText('Current Role')).toBeInTheDocument();
		expect(screen.getByText('Devs Managed')).toBeInTheDocument();
	});

	it('renders bio text', () => {
		render(About, { props: { navigate: vi.fn() } });
		expect(screen.getByText(/neuroplastic software engineer/i)).toBeInTheDocument();
	});

	it('calls navigate home when back button clicked', async () => {
		const navigate = vi.fn();
		render(About, { props: { navigate } });
		await fireEvent.click(screen.getByRole('button', { name: /HOME/i }));
		expect(navigate).toHaveBeenCalledWith('home');
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
		expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
		expect(screen.getByText('Solidity')).toBeInTheDocument();
		expect(screen.getByText('Docker')).toBeInTheDocument();
	});

	it('links to external project URLs', () => {
		render(Projects);
		const iskolarLink = screen.getByText('iSkolar').closest('a');
		expect(iskolarLink).toHaveAttribute('href', 'https://iskolar.io');
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
		expect(emailLink).toHaveAttribute(
			'href',
			'https://mail.google.com/mail/u/0/#all?compose=new'
		);
	});

	it('renders LinkedIn link', () => {
		render(Contact);
		const link = screen.getByText('linkedin.com/in/louie1221').closest('a');
		expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/louie1221/');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('renders X link', () => {
		render(Contact);
		const link = screen.getByText('x.com/louigie_21').closest('a');
		expect(link).toHaveAttribute('href', 'https://x.com/louigie_21');
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
		expect(screen.getByText('type-commands-to-know-me ~')).toBeInTheDocument();
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

	it('copies the address for /email command', async () => {
		const navigate = vi.fn();
		const writeText = vi.fn().mockResolvedValue(undefined);
		// jsdom ships no clipboard, and filling it is the whole point of /email.
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			configurable: true
		});
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/email' } });
		await fireEvent.submit(input.closest('form')!);
		expect(writeText).toHaveBeenCalledWith('louigiecads143@gmail.com');
	});

	it('shows help text for /help command', async () => {
		const navigate = vi.fn();
		render(CLI, { props: { navigate } });
		const input = screen.getByPlaceholderText(/help/i);
		await fireEvent.input(input, { target: { value: '/help' } });
		await fireEvent.submit(input.closest('form')!);
		const row = screen.getByText('Navigation:').parentElement;
		expect(row?.textContent).toMatch(/\/home/);
		expect(row?.textContent).toMatch(/\/about/);
		expect(row?.textContent).toMatch(/\/light/);
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
