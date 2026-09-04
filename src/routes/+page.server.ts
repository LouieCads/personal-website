import { feed } from '$lib/data/portfolio';
import { withPreviews } from '$lib/server/preview';
import type { PageServerLoad } from './$types';

/** Link previews resolve at build time, so the browser pays nothing for them. */
export const prerender = true;

export const load: PageServerLoad = async () => {
	const resolved = await withPreviews(feed);

	// ship only the fields the cards render
	return {
		feed: resolved.map(({ id, kind, title, blurb, date, url, image }) => ({
			id,
			kind,
			title,
			blurb,
			date,
			url,
			image
		}))
	};
};
