/**
 * Single source of content for the scrollable page.
 * Experience / podcast / article entries are PLACEHOLDER; swap for real ones.
 */

export interface Role {
	id: string;
	role: string;
	company: string;
	kind: 'work' | 'education';
	/** ISO year-month, e.g. '2024-06' */
	start: string;
	/** null = present */
	end: string | null;
	location: string;
	summary: string;
	achievements: string[];
	tags: string[];
	kpis: { value: string; label: string }[];
}

export const experience: Role[] = [
	{
		id: 'iskolar',
		role: 'Chief Technology Officer',
		company: 'iSkolar',
		kind: 'work',
		start: '2024-06',
		end: null,
		location: 'Manila - Remote',
		summary:
			'Directs a six-developer team across smart contracts, API and web. Built the on-chain escrow that holds scholarship funds until a provider releases them, and set the review and release process the team still runs on.',
		achievements: [
			'Directs a 6-developer team across contracts, API and web',
			'Shipped on-chain escrow for scholarship disbursement',
			'Set the review, CI and release process from zero'
		],
		tags: ['Solidity', 'Hardhat', 'TypeScript', 'PostgreSQL', 'Docker'],
		kpis: [
			{ value: '6', label: 'devs led' },
			{ value: '3', label: 'products live' },
			{ value: '2', label: 'chains shipped' }
		]
	},
	{
		id: 'finsharc',
		role: 'Founder - Mobile Lead',
		company: 'Finsharc',
		kind: 'work',
		start: '2025-01',
		end: null,
		location: 'Manila',
		summary:
			'An offline-first finance copilot with on-device receipt scanning. From first commit to testers’ hands in nine weeks, built solo.',
		achievements: [
			'Offline-first architecture with on-device receipt scanning',
			'React Native + Expo, in testers’ hands in nine weeks',
			'Owns product, design and release end to end'
		],
		tags: ['React Native', 'Expo', 'Zustand', 'ML Kit', 'NativeWind'],
		kpis: [
			{ value: '9', label: 'weeks to beta' },
			{ value: '100%', label: 'offline capable' },
			{ value: '1', label: 'person team' }
		]
	},
	{
		id: 'usmo',
		role: 'Web Lead',
		company: 'UMak Student Multimedia Organization',
		kind: 'work',
		start: '2024-02',
		end: '2025-03',
		location: 'University of Makati',
		summary:
			'Built and launched the organization’s public home at connect.usmo.org.ph, consolidating scattered social links into one entry point.',
		achievements: [
			'Built and launched connect.usmo.org.ph',
			'Consolidated org links, projects and socials into one page'
		],
		tags: ['HTML', 'CSS', 'JavaScript'],
		kpis: [
			{ value: '1', label: 'site launched' },
			{ value: '14', label: 'months' }
		]
	},
	{
		id: 'umak',
		role: 'BS Computer Science - Student Leader',
		company: 'University of Makati',
		kind: 'education',
		start: '2022-08',
		end: null,
		location: 'Makati City',
		summary:
			'Studying software engineering while leading academic and technical activities inside the student community.',
		achievements: [
			'Leads academic and technical activities in the student community',
			'Focus on distributed systems and applied cryptography'
		],
		tags: ['Computer Science', 'Student Leadership'],
		kpis: [
			{ value: '2026', label: 'expected' },
			{ value: '3', label: 'orgs served' }
		]
	}
];

export interface Episode {
	id: string;
	number: string;
	title: string;
	blurb: string;
	date: string;
	duration: string;
	/** Paste the episode link here; the card resolves its own preview image. */
	url: string;
	/** Filled in on the server when the link advertises a cover. */
	image?: string;
}

export const podcastName = 'Comfort Kills Greatness';

export const episodes: Episode[] = [
	{
		id: 'ep3',
		number: 'EP.03',
		title: 'Louigie Building With A Reason',
		blurb: 'Why “make it exist first” beats a perfect plan, and the two places that rule breaks.',
		date: '2026.08.20',
		duration: '42 min',
		url: 'https://www.youtube.com/watch?v=R_7leF_DDng'
	},
	{
		id: 'ep2',
		number: 'EP.02',
		title: 'How We Got Into Tech',
		blurb: 'The unglamorous review habits that catch more than a paid audit does.',
		date: '2026.07.30',
		duration: '38 min',
		url: 'https://www.youtube.com/watch?v=VkYuxziF-z4'
	},
	{
		id: 'ep1',
		number: 'EP.01',
		title: '"Outside the Bubble" — Building Beyond Your Own Circle',
		blurb: 'Building systems and self: discipline treated as an engineering practice.',
		date: '2026.07.02',
		duration: '31 min',
		url: 'https://www.youtube.com/watch?v=LbMx4Av1pL8'
	}
];

export interface Article {
	id: string;
	title: string;
	blurb: string;
	date: string;
	readTime: string;
	tag: string;
	/** Paste the post link here. */
	url: string;
	/** Optional explicit cover; a video link supplies its own. */
	image?: string;
}

export const articles: Article[] = [
	{
		id: 'escrow',
		title: 'Claude AI Recovered Lost Bitcoin',
		blurb:
			'What actually breaks when you put a disbursement flow on a public ledger, and the three things I would design differently on the next one.',
		date: '2026.08.14',
		readTime: '8 min read',
		tag: 'Blockchain',
		url: 'https://tutorialsdojo.com/claude-ai-recovered-lost-bitcoin/'
	}
	// {
	// 	id: 'offline',
	// 	title: 'Offline-first is a product decision',
	// 	blurb:
	// 		'Sync is not an infrastructure detail. Deciding what works without a signal decides what the product is.',
	// 	date: '2026.07.11',
	// 	readTime: '6 min read',
	// 	tag: 'Mobile',
	// 	url: ''
	// },
	// {
	// 	id: 'team',
	// 	title: 'Running a 6-dev team as a student',
	// 	blurb:
	// 		'Scheduling reviews around class, and why written decisions beat standups when nobody shares a timezone.',
	// 	date: '2026.06.02',
	// 	readTime: '5 min read',
	// 	tag: 'Leadership',
	// 	url: ''
	// }
];

/**
 * Pull the video id out of any common YouTube link shape:
 * watch?v=, youtu.be/, /shorts/, /embed/, /live/.
 */
export function youtubeId(url: string): string | null {
	if (!url) return null;
	try {
		const u = new URL(url);
		const host = u.hostname.replace(/^www\./, '');

		if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
		if (!host.endsWith('youtube.com') && !host.endsWith('youtube-nocookie.com')) return null;

		const v = u.searchParams.get('v');
		if (v) return v;

		const parts = u.pathname.split('/').filter(Boolean);
		if (['shorts', 'embed', 'live', 'v'].includes(parts[0])) return parts[1] ?? null;
		return null;
	} catch {
		return null;
	}
}

/**
 * The preview image for a pasted link. A YouTube link resolves to its own
 * thumbnail; anything else returns null and the card falls back to the
 * binary plate (or an explicit `image`).
 */
export function linkThumbnail(url: string): string | null {
	const id = youtubeId(url);
	return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/** Whether a pasted link points at playable video. */
export function isVideoLink(url: string): boolean {
	return youtubeId(url) !== null;
}

export const heroMetrics = [
	{ value: '6', label: 'Live Projects' },
	{ value: '4', label: 'Years Building' },
	{ value: '20+', label: 'Technologies' }
];

export const socials = [
	{
		label: 'Email',
		display: 'louigiecads143@gmail.com',
		href: 'mailto:louigiecads143@gmail.com',
		external: false
	},
	{
		label: 'LinkedIn',
		display: 'LinkedIn',
		href: 'https://www.linkedin.com/in/louie1221/',
		external: true
	},
	{
		label: 'Instagram',
		display: 'Instagram',
		href: 'https://www.instagram.com/louie.21_/',
		external: true
	}
];

export const sections = [
	{ id: 'hero', number: '00', label: 'HOME' },
	{ id: 'about', number: '01', label: 'ABOUT' },
	{ id: 'projects', number: '02', label: 'PROJECTS' },
	{ id: 'experience', number: '03', label: 'EXPERIENCE' },
	{ id: 'blog', number: '04', label: 'BLOG' }
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** Fractional year, e.g. '2024-06' → 2024.416 */
export function toYearFraction(iso: string | null): number {
	if (!iso) {
		const now = new Date();
		return now.getFullYear() + now.getMonth() / 12;
	}
	const [y, m] = iso.split('-').map(Number);
	return y + (m - 1) / 12;
}

export function monthsBetween(start: string, end: string | null): number {
	return Math.round((toYearFraction(end) - toYearFraction(start)) * 12);
}

export function formatRange(start: string, end: string | null): string {
	const fmt = (iso: string) => iso.replace('-', '.');
	return `${fmt(start)} → ${end ? fmt(end) : 'PRESENT'}`;
}

/** Just the starting year, e.g. "2024". */
export function startYear(start: string): string {
	return start.slice(0, 4);
}

/** Years only, e.g. "2024 → PRESENT" or "2024 → 2025". */
export function formatYears(start: string, end: string | null): string {
	const year = (iso: string) => iso.slice(0, 4);
	const to = end ? year(end) : 'PRESENT';
	return year(start) === to ? year(start) : `${year(start)} → ${to}`;
}

export const aboutParagraphs = [
	'A neuroplastic software engineering student focused on blockchain, systems architecture, and emerging technologies. I build at the intersection of decentralized systems and scalable infrastructure, turning ideas into real, working products.',
	'I prioritize execution: make it exist first, refine it later. Each project is an opportunity to push boundaries through clean architecture, thoughtful decisions, and continuous improvement.',
	'Alongside building, I serve as a student leader at the University of Makati, where I contribute to academic and technical activities within the community.',
	'Outside of code, I stay disciplined through gym training, calisthenics, and running, building both systems and self.'
];

export const aboutStats = [
	{ value: 'Full Stack', label: 'Core Skillset' },
	{ value: 'Agile', label: 'Team Workflow' },
	{ value: '6', label: 'Devs Managed' }
];

export const specialties = [
	{
		index: '01',
		label: 'Blockchain Development',
		detail: 'Smart contracts, DApps, and decentralized systems'
	},
	{
		index: '02',
		label: 'Systems Architecture',
		detail: 'Scalable infrastructure and distributed systems'
	},
	{
		index: '03',
		label: 'Technical Leadership',
		detail: 'Team direction, code reviews, and strategic decisions'
	},
	{
		index: '04',
		label: 'System Design',
		detail: 'High-level design patterns and technical blueprints'
	},
	{
		index: '05',
		label: 'Project Management',
		detail: 'Agile workflows, delivery pipelines, and cross-team coordination'
	}
];

export interface Project {
	index: string;
	title: string;
	tagline: string;
	description: string;
	tech: string[];
	link: string;
	/** drop a screenshot in static/projects and point here; omit for a plate */
	image?: string;
	year?: string;
	role?: string;
	/** shown in the card's window chrome */
	host: string;
}

export const projects: Project[] = [
	{
		index: '01',
		title: 'iSkolar',
		tagline: 'Scholarships, applied for and awarded on-chain.',
		description:
			'A scholarship application and management platform connecting university students with scholarship providers, streamlining the application and selection process.',
		tech: [
			'TypeScript',
			'Solidity',
			'Hardhat',
			'React',
			'Tailwind CSS',
			'Express.js',
			'PostgreSQL',
			'Vitest',
			'Docker',
			'bun'
		],
		link: 'https://iskolar.io',
		host: 'iskolar.io',
		image: '/projects/iskolar-preview.webp',
		year: '2024',
		role: 'CTO - Architecture & contracts'
	},
	{
		index: '02',
		title: 'Finsharc',
		tagline: 'A finance copilot that works with no signal.',
		description:
			'An intelligent mobile finance copilot that helps understand and act on personal and business finances with clarity and control, built offline first and designed to keep users oriented and in command.',
		tech: [
			'TypeScript',
			'React Native',
			'Expo',
			'NativeWind',
			'Zustand',
			'Vitest',
			'ML Kit',
			'pnpm'
		],
		link: 'https://www.finsharc.com',
		host: 'finsharc.com',
		image: '/projects/finsharc-preview.webp',
		year: '2025',
		role: 'Founder - Mobile lead'
	},
	{
		index: '03',
		title: 'USMO',
		tagline: 'One front door for a student organization.',
		description:
			'A centralized landing page for UMak Student Multimedia Organization showcasing projects, initiatives, and social platforms for improved accessibility and engagement.',
		tech: ['Hostinger Website Builder', 'HTML', 'CSS', 'JavaScript'],
		link: 'https://connect.usmo.org.ph',
		host: 'connect.usmo.org.ph',
		image: '/projects/usmo-preview.webp',
		year: '2024',
		role: 'Web lead'
	},
	{
		index: '04',
		title: 'inki',
		tagline: 'A social book tracker for iOS.',
		description:
			'A reading companion on the App Store where readers log what they are reading and follow what the people around them read.',
		tech: ['iOS'],
		link: 'https://apps.apple.com/us/app/inki-social-book-tracker/id6776695671',
		host: 'apps.apple.com'
	},
	{
		index: '05',
		title: 'fundr. studios',
		tagline: 'Software, designed and shipped.',
		description: 'A software studio taking products from design through to release.',
		tech: [],
		link: 'https://fundr.software/',
		host: 'fundr.software'
	},
	{
		index: '06',
		title: 'Dave Malinao',
		tagline: 'Crafting memories through food.',
		description:
			'A culinary portfolio for a home chef and food creator, built around signature dishes, kitchen stories and a philosophy of slow, honest cooking.',
		tech: ['SvelteKit', 'Netlify'],
		link: 'https://davemalinao.netlify.app/',
		host: 'davemalinao.netlify.app'
	}
];

/** Latest posts across both formats, newest first; used by the home preview. */
export interface FeedItem {
	id: string;
	kind: 'PODCAST' | 'ARTICLE';
	title: string;
	blurb: string;
	date: string;
	meta: string;
	url: string;
	image?: string;
}

export const feed: FeedItem[] = [
	...episodes.map(
		(e): FeedItem => ({
			id: e.id,
			kind: 'PODCAST',
			title: e.title,
			blurb: e.blurb,
			date: e.date,
			meta: `${e.number} - ${e.duration}`,
			url: e.url
		})
	),
	...articles.map(
		(a): FeedItem => ({
			id: a.id,
			kind: 'ARTICLE',
			title: a.title,
			blurb: a.blurb,
			date: a.date,
			meta: `${a.tag} - ${a.readTime}`,
			url: a.url,
			image: a.image
		})
	)
].sort((x, y) => y.date.localeCompare(x.date));
