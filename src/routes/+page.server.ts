import { feed } from '$lib/data/portfolio';
import { withPreviews } from '$lib/server/preview';
import { fetchContributions, type ContributionGraph } from '$lib/data/github';
import type { PageServerLoad } from './$types';

const GITHUB_USERNAME = 'LouieCads';

/** Link previews resolve at build time, so the browser pays nothing for them. */
export const prerender = true;

export const load: PageServerLoad = async () => {
	const resolved = await withPreviews(feed);

	let github: ContributionGraph | null = null;
	try {
		github = await fetchContributions(GITHUB_USERNAME);
	} catch {
		// contribution graph is a nice-to-have; the page still renders without it
		github = null;
	}

	return {
		// ship only the fields the cards render
		feed: resolved.map(({ id, kind, title, blurb, date, url, image }) => ({
			id,
			kind,
			title,
			blurb,
			date,
			url,
			image
		})),
		github
	};
};
