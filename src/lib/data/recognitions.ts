export interface Recognition {
	id: string;
	/** Competition, program, or list. */
	event: string;
	/** Placement or title received, e.g. "Champion". */
	award: string;
	/** Special awards won at the same event. Shown only in the detail view. */
	alsoAwarded?: string[];
	venue: string;
	/** ISO month: YYYY-MM. */
	date: string;
	description: string;
	/** Project presented, when there was one. */
	project?: string;
	/** Public page for the recognition. */
	url?: string;
	/** Who ran the event. Shown under the logo on the roadmap. */
	organizer: string;
	/** Organizer's logo, shown on the roadmap pin. Initials stand in when missing. */
	logo?: string;
	/** The logo is white-on-transparent and needs a dark disc behind it. */
	logoOnDark?: boolean;
	/** The logo is a wide wordmark; let it span the disc instead of sitting inset. */
	logoWide?: boolean;
	/** The logo is already a round badge; let it fill the disc edge to edge. */
	logoFill?: boolean;
	/**
	 * Photo or artwork shown in the detail view. The frame has the same shape
	 * for every stop, so a photo of another proportion is cropped to fill it.
	 * `focus` is the part to keep in view as a CSS position ("50% 80%" keeps
	 * the lower middle); it defaults to the centre. `keepRatio` opts out of
	 * the crop for designed artwork (a banner with text to its edges): the
	 * frame takes the image's own proportions and shows all of it.
	 */
	image?: {
		src: string;
		alt: string;
		width: number;
		height: number;
		focus?: string;
		keepRatio?: boolean;
	};
}

// Newest first. Content comes from the CV.
export const recognitions: Recognition[] = [
	{
		id: 'tiktok-shop-sea-2026',
		organizer: 'TikTok Shop',
		logo: '/recognitions/logos/tiktok.webp',
		logoFill: true,
		image: {
			src: '/recognitions/tiktok-shop-sea-2026.webp',
			alt: 'The four-member team seated in front of the TikTok Shop Regional Case Challenge 2026 backdrop with the Champion board',
			width: 1280,
			height: 960
		},
		event: 'TikTok Shop Regional Case Challenge 2026',
		award: 'Champion',
		venue: 'ByteDance Office, BGC Taguig',
		date: '2026-11',
		project: 'Kapitbahay Hub Lite',
		description:
			'Won the Philippine leg of TikTok Shop’s Southeast Asia Regional Case Challenge as part of a 4-member team. The pitch, Kapitbahay Hub Lite, turns sari-sari stores into pickup and prepayment points to cut failed Cash on Delivery orders.',
		url: 'https://bytedance.feishuapp.cn/app/app_17ddqg44fxc'
	},
	{
		id: 'stellar-ph100-2026',
		organizer: 'StellarPH',
		logo: '/recognitions/logos/stellarph.webp',
		image: {
			src: '/recognitions/stellar-ph100-2026.webp',
			alt: 'StellarPH PH100 2026 honoree Louigie Caminoy, Co-founder and CTO of Iskolar',
			width: 1731,
			height: 909,
			keepRatio: true
		},
		event: 'Stellar PH100 2026',
		award: 'Honoree',
		venue: 'McKinley Hill',
		date: '2026-11',
		description:
			'Named to the PH100 2026 as Co-Founder and CTO of iSkolar. StellarPH’s annual PH100 spotlights the 100 brightest minds under 30 in the Filipino startup ecosystem, across design, engineering, marketing, academia, media, and more.',
		url: 'https://stellarph.io/programs/ph100/2026'
	},
	{
		id: 'it-skills-olympics-2026',
		organizer: 'University of Makati',
		logo: '/recognitions/logos/it-skills-olympics.webp',
		image: {
			src: '/recognitions/it-skills-olympics-2026.webp',
			alt: 'The team holding certificates on stage at the 15th IT Skills Olympics',
			width: 960,
			height: 1280,
			focus: '50% 85%'
		},
		event: 'IT Skills Olympics',
		award: '2nd Runner-Up',
		venue: 'University of Makati',
		date: '2026-11',
		project: 'Animo',
		description:
			'Presented Animo, a palay marketplace and advisory app, at the 15th IT Skills Olympics (“Igniting Ingenuity, Transforming Digital Frontiers”) and placed against 20+ Philippine universities.'
	},
	{
		id: 'infotech-2026',
		organizer: 'UMak CCIS',
		logo: '/recognitions/logos/infotechnolympics.webp',
		logoOnDark: true,
		logoWide: true,
		event: 'InfoTechnOlympics 2026',
		award: 'Champion',
		venue: 'University of Makati',
		date: '2026-10',
		project: 'Animo',
		description:
			'Won the Android App Development (Productivity) category at InfoTechnOlympics 2026: The Techodyssey, run by the UMak CCIS Student Council. Team Black Elite presented Animo, a palay marketplace and advisory app, and beat 15 teams.',
		url: 'https://www.facebook.com/share/p/1EpCh6qqWQ/',
		image: {
			src: '/recognitions/infotechnolympics-2026.webp',
			alt: "INFOTECH'26 Android App Development, Productivity category: team Black Elite, Champion",
			width: 1200,
			height: 1200,
			focus: '50% 72%'
		}
	},
	{
		id: 'pcci-asenso-360-2026',
		organizer: 'PCCI Makati',
		logo: '/recognitions/logos/pcci-makati.webp',
		logoFill: true,
		event: 'PCCI - Makati Asenso 360 MSME Day',
		award: 'Champion',
		venue: 'University of Makati',
		date: '2026-07',
		project: 'iSkolar',
		description:
			'Presented iSkolar, a scholarship platform focused on efficiency and transparency, as part of a 3-member team and won against 10 participating teams.',
		url: 'https://www.facebook.com/share/p/1ARKBxLUjq/',
		image: {
			src: '/recognitions/pcci-asenso-360-2026.webp',
			alt: 'The iSkolar team presenting on stage at the PCCI - Makati Asenso 360 MSME Day',
			width: 1600,
			height: 1066
		}
	},
	{
		id: 'dost-spark-a-change-2026',
		organizer: 'DOST',
		logo: '/recognitions/logos/dost.svg',
		image: {
			src: '/recognitions/dost-spark-a-change-2026.webp',
			alt: 'The iSkolar team pitching on stage at the DOST Spark-A-Change Challenge 2.0 in front of the judges',
			width: 960,
			height: 1280,
			focus: '35% 48%'
		},
		event: 'DOST Spark-A-Change Challenge 2.0',
		award: 'Top 12 Finalist',
		venue: 'Gateway Mall',
		date: '2026-06',
		project: 'iSkolar',
		description:
			'Presented iSkolar, a scholarship platform focused on efficiency and transparency, as part of a 5-member team and placed in the Top 12 out of 25 teams.',
		url: 'https://www.facebook.com/share/p/1Ca1bUqHQY/'
	},
	{
		id: 'project-rise-2026',
		organizer: 'University of Makati',
		logo: '/recognitions/logos/umak.webp',
		image: {
			src: '/recognitions/project-rise-2026.webp',
			alt: 'Project RISE finalists posing together in front of the Project RISE screen',
			width: 1280,
			height: 960,
			focus: '50% 38%'
		},
		event: 'Project RISE',
		award: 'Top 10 Finalist',
		venue: 'Makati Diamond Residences',
		date: '2026-04',
		project: 'iSkolar',
		description:
			'Pitched iSkolar, a scholarship platform focused on efficiency and transparency, at the Project RISE Demo Day and was selected as one of the Top 10 teams from 50 participants.'
	},
	{
		id: 'ccis-hackathon-7',
		organizer: 'UMak CCIS',
		logo: '/recognitions/logos/umak.webp',
		image: {
			src: '/recognitions/ccis-hackathon-7.webp',
			alt: 'The team holding certificates on stage at the 7th CCIS Hackathon, University of Makati',
			width: 960,
			height: 1280,
			focus: '50% 76%'
		},
		event: '7th CCIS Hackathon',
		award: '1st Runner-Up',
		alsoAwarded: ['Most Disruptive Innovation'],
		venue: 'University of Makati',
		date: '2025-05',
		project: 'Faculty Repository System',
		description:
			'Presented Faculty Repository System, a blockchain-based file storage system that keeps faculty files private and organized, under the theme “Venturing to a Smart Security Campus through the Development of Intelligent App Technology.”'
	}
];

/** "2026-11" → "November 2026", for prose and structured data. */
export function formatMonthLong(iso: string): string {
	const [y, m] = iso.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

/** "Champion" plus any special awards: "1st Runner-Up and Most Disruptive Innovation". */
export function fullAward(r: Recognition): string {
	return [r.award, ...(r.alsoAwarded ?? [])].join(' and ');
}
