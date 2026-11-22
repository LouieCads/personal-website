export interface Certification {
	id: string;
	title: string;
	issuer: string;
	/** ISO date or month: YYYY-MM-DD or YYYY-MM. Omitted when the issuer gave none. */
	issued?: string;
	/** Expiration month, when provided by the issuer. */
	expires?: string;
	categories: string[];
	description?: string;
	credentialId?: string;
	/** Public HTTPS verification URL. */
	url?: string;
	/** Issuing institution's logo, shown as the card image. */
	logo?: string;
	/** Full certificate image, opened from the logo plate. */
	image?: string;
}

const entries: Certification[] = [
	{
		id: 'datacamp-ai-engineer',
		title: 'AI Engineer for Developers Associate',
		issuer: 'DataCamp',
		issued: '2026-09-28',
		expires: '2028-09',
		categories: ['Artificial Intelligence'],
		credentialId: 'AIEDA0013223515559',
		url: 'https://www.datacamp.com/certificate/AIEDA0013223515559',
		logo: '/certificates/logos/datacamp.webp',
		image: '/certificates/AI Engineer for Developers Associate.png'
	},
	{
		id: 'coddy-ai-prompts',
		title: 'AI Prompts Fundamentals',
		issuer: 'Coddy',
		issued: '2026-07',
		categories: ['Artificial Intelligence'],
		credentialId: 'vPOrMw-prompts-gO3Q1x',
		url: 'https://coddy.tech/certifications/vPOrMw-prompts-gO3Q1x',
		logo: '/certificates/logos/coddy.webp',
		image: '/certificates/AI Prompt Fundamentals.png'
	},
	{
		id: 'qcsp-quantum-blockchain-2025',
		title: 'Quantum Computing and Blockchain Lecture Series 2025',
		issuer: 'Quantum Computing Society of the Philippines',
		issued: '2025-07',
		categories: ['Quantum Computing', 'Blockchain'],
		description:
			'Completed the Quantum Computing and Blockchain Lecture Series 2025, delivered by the Quantum Computing Society of the Philippines and the DataProtect-SIERRA Project of DOST-ASTI from March 1 to May 30, 2025.',
		credentialId: '80947744189638',
		url: 'https://verified.sertifier.com/en/verify/80947744189638/',
		logo: '/certificates/logos/qcsp.webp',
		image: '/certificates/Quantum Computing and Blockcahin Lecture Series 2025.png'
	},
	{
		id: 'certiport-its-databases',
		title: 'Information Technology Specialist - Databases',
		issuer: 'Certiport',
		issued: '2026-11-21',
		expires: '2031-11',
		categories: ['Databases'],
		credentialId: 'rXUc-uSrC',
		/* Certiport has no per-credential URL: the code above is entered on this page. */
		url: 'https://verify.certiport.com',
		logo: '/certificates/logos/certiport.webp',
		image: '/certificates/ITS Databases.webp'
	},
	{
		id: 'bitget-blockchain4youth',
		title: 'Blockchain4Youth',
		issuer: 'Bitget',
		issued: '2026-09-25',
		categories: ['Blockchain'],
		description:
			'Completed the Blockchain4Youth Learning Hub Program, demonstrating foundational blockchain and Web3 knowledge.',
		credentialId: 'B4Y-2026-010078',
		logo: '/certificates/logos/bitget.webp',
		image: '/certificates/Blockchain4Youth.webp'
	}
];

/** Latest to oldest by issue date; undated entries sink to the end. */
export const certifications: Certification[] = [...entries].sort((a, b) =>
	(b.issued ?? '').localeCompare(a.issued ?? '')
);
