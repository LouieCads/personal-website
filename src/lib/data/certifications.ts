export interface Certification {
	id: string;
	title: string;
	issuer: string;
	/** ISO date or month: YYYY-MM-DD or YYYY-MM. */
	issued: string;
	/** Expiration month, when provided by the issuer. */
	expires?: string;
	categories: string[];
	description?: string;
	credentialId?: string;
	/** Public HTTPS verification URL. */
	url?: string;
	/** Badge image path, when supplied by the issuer. */
	badge?: string;
	/** Full certificate image, displayed without cropping. */
	image?: string;
}

// Newest first. Dates and credential details come from the supplied certificates.
export const certifications: Certification[] = [
	{
		id: 'datacamp-ai-engineer',
		title: 'AI Engineer for Developers Associate',
		issuer: 'DataCamp',
		issued: '2026-09-28',
		expires: '2028-09',
		categories: ['Artificial Intelligence'],
		credentialId: 'AIEDA0013223515559',
		url: 'https://www.datacamp.com/certificate/AIEDA0013223515559',
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
		image: '/certificates/AI Prompt Fundamentals.png'
	},
	{
		id: 'qcsp-quantum-blockchain-2025',
		title: 'Quantum Computing and Blockchain Lecture Series 2025',
		issuer: 'OneQuantum Philippines',
		issued: '2025-07',
		categories: ['Quantum Computing', 'Blockchain'],
		description:
			'Completed the Quantum Computing and Blockchain Lecture Series 2025, delivered by the Quantum Computing Society of the Philippines and the DataProtect-SIERRA Project of DOST-ASTI from March 1 to May 30, 2025.',
		credentialId: '80947744189638',
		url: 'https://verified.sertifier.com/en/verify/80947744189638/',
		image: '/certificates/Quantum Computing and Blockcahin Lecture Series 2025.png'
	}
];
