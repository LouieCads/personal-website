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
	/** Photo or artwork shown in the detail view. */
	image?: { src: string; alt: string; width: number; height: number };
}

// Newest first. Content comes from the CV.
export const recognitions: Recognition[] = [
	{
		id: 'tiktok-shop-sea-2026',
		organizer: 'TikTok Shop',
		logo: '/recognitions/logos/tiktok.webp',
		logoFill: true,
		event: 'TikTok Shop Regional Case Challenge 2026',
		award: 'Champion',
		venue: 'ByteDance Office, BGC Taguig',
		date: '2026-11',
		project: 'Kapitbahay Hub Lite',
		description:
			'Presented Kapitbahay Hub Lite, a sari-sari store pickup and prepayment model that cuts failed Cash on Delivery orders, as part of a 4-member team and won the Philippine leg of the case challenge.',
		url: 'https://bytedance.feishuapp.cn/app/app_17ddqg44fxc'
	},
	{
		id: 'stellar-ph100-2026',
		organizer: 'StellarPH',
		logo: '/recognitions/logos/stellarph.webp',
		image: {
			src: '/ph100-2026.png',
			alt: 'StellarPH PH100 2026 honoree Louigie Caminoy, Co-founder and CTO of Iskolar',
			width: 1731,
			height: 909
		},
		event: 'Stellar PH100 2026',
		award: 'Honoree',
		venue: 'McKinley Hill',
		date: '2026-11',
		description:
			'Recognized among the Philippines’ Top 100 brightest young minds under 30 for startup contributions. The annual StellarPH list celebrates talent across design, engineering, marketing, academia, media, and more.',
		url: 'https://stellarph.io/programs/ph100/2026'
	},
	{
		id: 'it-skills-olympics-2026',
		organizer: 'University of Makati',
		logo: '/recognitions/logos/it-skills-olympics.webp',
		event: 'IT Skills Olympics',
		award: '2nd Runner-Up',
		venue: 'University of Makati',
		date: '2026-11',
		project: 'Animo',
		description: 'Presented Animo against 20+ Philippine universities.'
	},
	{
		id: 'infotech-2026',
		organizer: 'UMak CCIS',
		logo: '/recognitions/logos/infotechnolympics.webp',
		logoOnDark: true,
		logoWide: true,
		event: 'INFOTECHNOLYMPICS 2026',
		award: 'Champion',
		venue: 'University of Makati',
		date: '2026-10',
		project: 'Animo',
		description:
			'Presented Animo, a palay marketplace and advisory app focused on efficiency and transparency, and won against 15 participating teams.'
	},
	{
		id: 'pcci-asenso-360-2026',
		organizer: 'PCCI Makati',
		logo: '/recognitions/logos/pcci.svg',
		logoOnDark: true,
		event: 'PCCI - Makati Asenso 360 MSME Day',
		award: 'Champion',
		venue: 'University of Makati',
		date: '2026-07',
		project: 'iSkolar',
		description:
			'Presented iSkolar, a scholarship platform focused on efficiency and transparency, as part of a 3-member team and won against 10 participating teams.'
	},
	{
		id: 'dost-spark-a-change-2026',
		organizer: 'DOST',
		logo: '/recognitions/logos/dost.svg',
		event: 'DOST Spark-A-Change Challenge 2.0',
		award: 'Top 12 Finalist',
		venue: 'Gateway Mall',
		date: '2026-06',
		project: 'iSkolar',
		description:
			'Presented iSkolar as part of a 5-member team and placed in the Top 12 out of 25 teams.'
	},
	{
		id: 'project-rise-2026',
		organizer: 'University of Makati',
		logo: '/recognitions/logos/umak.webp',
		event: 'Project RISE',
		award: 'Top 10 Finalist',
		venue: 'Makati Diamond Residences',
		date: '2026-04',
		project: 'iSkolar',
		description:
			'Presented iSkolar and was selected as one of the Top 10 teams from 50 participants.'
	},
	{
		id: 'ccis-hackathon-7',
		organizer: 'UMak CCIS',
		logo: '/recognitions/logos/umak.webp',
		event: '7th CCIS Hackathon',
		award: '1st Runner-Up',
		alsoAwarded: ['Most Disruptive Innovation'],
		venue: 'University of Makati',
		date: '2025-05',
		project: 'Faculty Repository System',
		description:
			'Presented Faculty Repository System, a file storage system addressing privacy and file organization using blockchain technology.'
	}
];

/** "2026-11" → "NOV 2026" */
export function formatMonth(iso: string): string {
	const [y, m] = iso.split('-').map(Number);
	const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', {
		month: 'short',
		timeZone: 'UTC'
	});
	return `${month.toUpperCase()} ${y}`;
}
