/**
 * Single source of content for the scrollable page.
 * Podcast / article entries are PLACEHOLDER; swap for real ones.
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
		role: 'Co-founder & Chief Technology Officer',
		company: 'iSkolar',
		kind: 'work',
		start: '2025-01',
		end: null,
		location: 'Taguig',
		summary:
			'Co-founded iSkolar and lead engineering as CTO. Designed a scalable platform supporting 10+ features that keeps new feature work fast to ship, and reworked client-side routing for a 60% performance jump in navigation.',
		achievements: [
			'Designed a scalable platform supporting 10+ features, enabling rapid feature integration and growth',
			'Optimized client-side routing, delivering a 60% performance improvement and faster navigation'
		],
		tags: ['React', 'TypeScript', 'Solidity', 'PostgreSQL', 'Docker', 'Microsoft Azure'],
		kpis: [
			{ value: '10+', label: 'features shipped' },
			{ value: '60%', label: 'perf improvement' }
		]
	},
	{
		id: 'heron',
		role: 'AI Lead',
		company: 'AWS Learning Club - Heron',
		kind: 'work',
		start: '2026-01',
		end: null,
		location: 'Taguig',
		summary:
			'Leads AI initiatives for the club, focused on LLMs, AI engineering and emerging AI technologies, and mentors aspiring AI developers from idea through implementation.',
		achievements: [
			'Led AI initiatives for 5 members, focused on LLMs, AI engineering, and emerging AI technologies',
			'Mentored 5 aspiring AI developers, guiding teams from idea through implementation'
		],
		tags: ['LLMs', 'AI Engineering', 'Python'],
		kpis: [
			{ value: '5', label: 'members led' },
			{ value: '5', label: 'developers mentored' }
		]
	},
	{
		id: 'tutorials-dojo',
		role: 'Software Engineer Intern',
		company: 'Tutorials Dojo',
		kind: 'work',
		start: '2026-01',
		end: '2026-04',
		location: 'Taguig',
		summary:
			'Software engineering internship building consumer mobile apps end to end. Co-developed Finsharc, a finance-tracking app, and Inki, a social book-tracking app.',
		achievements: [
			'Co-developed Finsharc, a finance-tracking app that reached #1 on the Australian App Store',
			'Co-developed Inki, a social book-tracking app that reached #1 on the Philippine App Store'
		],
		tags: ['React Native', 'Expo', 'TypeScript', 'SQLite'],
		kpis: [
			{ value: '#1', label: 'AU App Store' },
			{ value: '#1', label: 'PH App Store' }
		]
	},
	{
		id: 'usmo',
		role: 'Website Manager',
		company: 'UMak Student Multimedia Organization',
		kind: 'work',
		start: '2025-01',
		end: '2026-02',
		location: 'Taguig',
		summary:
			'Designed the organization’s official landing page and published news across social media to grow digital presence, reach, and engagement.',
		achievements: [
			'Designed the official landing page and published news across social media to improve digital presence, reach, and engagement',
			'Managed and published accurate, relevant website news content aligned with university standards'
		],
		tags: ['HTML', 'CSS', 'JavaScript'],
		kpis: [
			{ value: '1', label: 'site launched' },
			{ value: '12', label: 'months' }
		]
	},
	{
		id: 'umak',
		role: 'BS Computer Science',
		company: 'University of Makati',
		kind: 'education',
		start: '2023-06',
		end: null,
		location: 'Makati City',
		summary:
			'Studying computer science with coursework in software engineering, project management, database systems, and system design.',
		achievements: [
			'Relevant coursework: Software Engineering, Project Management, Database Systems, System Design'
		],
		tags: ['Computer Science', 'Software Engineering'],
		kpis: [{ value: '2027', label: 'expected' }]
	}
];

export interface Episode {
	id: string;
	number: string;
	title: string;
	blurb: string;
	date: string;
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
		date: 'May 26, 2026',
		url: 'https://www.youtube.com/watch?v=R_7leF_DDng'
	},
	{
		id: 'ep2',
		number: 'EP.02',
		title: 'How We Got Into Tech',
		blurb: 'The unglamorous review habits that catch more than a paid audit does.',
		date: 'June 30, 2026',
		url: 'https://www.youtube.com/watch?v=VkYuxziF-z4'
	},
	{
		id: 'ep1',
		number: 'EP.01',
		title: '"Outside the Bubble" — Building Beyond Your Own Circle',
		blurb: 'Building systems and self: discipline treated as an engineering practice.',
		date: 'August 13, 2026',
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
		id: 'claude',
		title: 'Claude AI Recovered Lost Bitcoin',
		blurb:
			'What actually breaks when you put a disbursement flow on a public ledger, and the three things I would design differently on the next one.',
		date: 'June 04, 2026',
		readTime: '8 min read',
		tag: 'Blockchain',
		url: 'https://tutorialsdojo.com/claude-ai-recovered-lost-bitcoin/'
	}
	// {
	// 	id: 'offline',
	// 	title: 'Offline-first is a product decision',
	// 	blurb:
	// 		'Sync is not an infrastructure detail. Deciding what works without a signal decides what the product is.',
	// 	date: 'July 11, 2026',
	// 	readTime: '6 min read',
	// 	tag: 'Mobile',
	// 	url: ''
	// },
	// {
	// 	id: 'team',
	// 	title: 'Running a 6-dev team as a student',
	// 	blurb:
	// 		'Scheduling reviews around class, and why written decisions beat standups when nobody shares a timezone.',
	// 	date: 'June 02, 2026',
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
	{ value: '3', label: 'Years Building' },
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
	},
	{
		label: 'X',
		display: 'X',
		href: 'https://x.com/louigie_21',
		external: true
	}
];

export const sections = [
	{ id: 'hero', number: '00', label: 'HOME' },
	{ id: 'about', number: '01', label: 'ABOUT' },
	{ id: 'projects', number: '02', label: 'PROJECTS' },
	{ id: 'experience', number: '03', label: 'EXPERIENCE' },
	{ id: 'blog', number: '04', label: 'BLOG' },
	{ id: 'github', number: '05', label: 'GITHUB' }
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

/** 2-paragraph summary for the scroll page's about preview. */
export const aboutSummary = [
	'A software engineering student and technopreneur driven by discipline and curiosity. I build across development, design, and product, with a focus on blockchain and AI.',
	'I like building things from the ground up, testing what works and improving through iteration - and outside of tech, I stay active, train, compete, and keep enough range to move between different disciplines.'
];

export const aboutParagraphs = [
	'A software engineering student and technopreneur driven by discipline and curiosity. I build across development, design, and product, with a focus on blockchain and AI.',
	'I like building things from the ground up, whether it’s a product, a system, or an idea worth exploring. Most of my work comes from figuring things out as I go, testing what works, and improving through iteration.',
	'Outside of tech, I spend my time between training, competing, creating, and exploring new interests. I value staying active, taking on difficult things, and having enough range to move between different disciplines.'
];

export const aboutStats = [
	{ value: 'Full Stack', label: 'Core Skillset' },
	{ value: 'Agile', label: 'Team Workflow' },
	{ value: '6', label: 'Devs Managed' }
];

export const specialties = [
	{
		index: '01',
		label: 'Technical Leadership',
		detail: 'Team direction, code reviews, and strategic decisions'
	},
	{
		index: '02',
		label: 'Systems Architecture',
		detail: 'Scalable infrastructure and distributed systems'
	},
	{
		index: '03',
		label: 'System Design',
		detail: 'High-level design patterns and technical blueprints'
	},
	{
		index: '04',
		label: 'Project Management',
		detail: 'Agile workflows and team coordination'
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
	/** object-position for the crop; default 'center top' suits browser/desktop shots */
	imagePosition?: string;
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
			'React',
			'TypeScript',
			'Vite',
			'Tailwind CSS',
			'TanStack Router',
			'React Query',
			'Gemini AI',
			'Microsoft Azure'
		],
		link: 'https://iskolar.io',
		host: 'iskolar.io',
		image: '/projects/iskolar-preview.webp',
		year: '2024',
		role: 'CTO - Architecture & contracts'
	},
	{
		index: '02',
		title: 'inki',
		tagline: 'A social book tracker.',
		description:
			'A reading companion where readers log what they are reading and follow what the people around them read.',
		tech: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'SQLite'],
		link: 'https://apps.apple.com/us/app/inki-social-book-tracker/id6776695671',
		host: 'apps.apple.com',
		image: '/projects/inki-preview.webp',
		imagePosition: 'center top'
	},
	{
		index: '03',
		title: 'Dave Malinao',
		tagline: 'A home chef’s portfolio of dishes, stories and process.',
		description:
			'A culinary portfolio for a home chef and food creator, built around signature dishes, kitchen stories and a philosophy of slow, honest cooking.',
		tech: ['Svelte', 'SvelteKit', 'TypeScript', 'Tailwind CSS', 'Vite'],
		link: 'https://davemalinao.netlify.app/',
		host: 'davemalinao.netlify.app',
		image: '/projects/dave-malinao-preview.webp'
	},
	{
		index: '04',
		title: 'USMO',
		tagline: 'One front door for a student organization.',
		description:
			'A centralized landing page for UMak Student Multimedia Organization showcasing projects, initiatives, and social platforms for improved accessibility and engagement.',
		tech: ['Hostinger Website Builder', 'HTML', 'CSS', 'JavaScript'],
		link: 'https://connect.usmo.org.ph',
		host: 'connect.usmo.org.ph',
		image: '/projects/usmo-preview.webp',
		imagePosition: 'left top',
		year: '2024',
		role: 'Web lead'
	},
	{
		index: '05',
		title: 'fundr. studios',
		tagline: 'A software studio site for client work, design to release.',
		description: 'A software studio taking products from design through to release.',
		tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Motion'],
		link: 'https://fundr.software/',
		host: 'fundr.software',
		image: '/projects/fundr-studios-preview.png'
	},
	{
		index: '06',
		title: 'Finsharc',
		tagline: 'A finance copilot that works with no signal.',
		description:
			'An intelligent mobile finance copilot that helps understand and act on personal and business finances with clarity and control, built offline first and designed to keep users oriented and in command.',
		tech: ['React Native', 'Expo', 'TypeScript', 'NativeWind', 'Zustand', 'Llama'],
		link: 'https://www.finsharc.com',
		host: 'finsharc.com',
		image: '/projects/finsharc-preview.webp',
		year: '2025',
		role: 'Founder - Mobile lead'
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
			meta: e.number,
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
