import { articles, episodes } from '$lib/data/portfolio';
import { withPreviews } from '$lib/server/preview';
import type { PageServerLoad } from './$types';

export const prerender = true;

const row = <T extends { id: string; title: string; date: string; url: string; image?: string }>(
	item: T
) => ({ id: item.id, title: item.title, date: item.date, url: item.url, image: item.image });

export const load: PageServerLoad = async () => {
	const [resolvedEpisodes, resolvedArticles] = await Promise.all([
		withPreviews(episodes),
		withPreviews(articles)
	]);

	return {
		episodes: resolvedEpisodes.map(row),
		articles: resolvedArticles.map(row)
	};
};
