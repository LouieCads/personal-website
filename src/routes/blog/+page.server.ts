import { articles, episodes } from '$lib/data/portfolio';
import { withPreviews } from '$lib/server/preview';
import type { PageServerLoad } from './$types';

export const prerender = true;

const row = <
	T extends {
		id: string;
		title: string;
		blurb: string;
		date: string;
		url: string;
		image?: string;
	}
>(
	item: T
) => ({
	id: item.id,
	title: item.title,
	blurb: item.blurb,
	date: item.date,
	url: item.url,
	image: item.image
});

const byLatest = (a: { date: string }, b: { date: string }) =>
	new Date(b.date).getTime() - new Date(a.date).getTime();

export const load: PageServerLoad = async () => {
	const [resolvedEpisodes, resolvedArticles] = await Promise.all([
		withPreviews(episodes),
		withPreviews(articles)
	]);

	return {
		episodes: resolvedEpisodes.map(row).sort(byLatest),
		articles: resolvedArticles.map(row).sort(byLatest)
	};
};
