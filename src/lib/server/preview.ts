import { linkThumbnail } from '$lib/data/portfolio';

/**
 * Resolves the preview image for a pasted link.
 *
 * A video link supplies its own thumbnail from the URL alone. Everything else
 * only advertises its cover in the page's own `og:image` meta tag, which a
 * browser cannot read across origins, so it has to be fetched here on the
 * server. Results are cached, and the whole thing runs at build time.
 */

const TTL = 1000 * 60 * 60 * 6;
const MAX_HTML = 250_000;
const TIMEOUT_MS = 6000;

const cache = new Map<string, { image: string | null; at: number }>();

/** Meta tags in priority order; first hit wins. */
const CANDIDATES = [
	'og:image:secure_url',
	'og:image:url',
	'og:image',
	'twitter:image',
	'twitter:image:src'
];

function attr(tag: string, name: string): string | undefined {
	const match = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
	return match?.[2] ?? match?.[3];
}

function findImage(html: string, baseUrl: string): string | null {
	const tags = html.match(/<meta\s[^>]*>/gi) ?? [];
	const found = new Map<string, string>();

	for (const tag of tags) {
		const key = (attr(tag, 'property') ?? attr(tag, 'name'))?.toLowerCase();
		const content = attr(tag, 'content');
		if (key && content && !found.has(key)) found.set(key, content);
	}

	let raw = CANDIDATES.map((key) => found.get(key)).find(Boolean);

	if (!raw) {
		const link = html.match(/<link\s[^>]*rel\s*=\s*["']image_src["'][^>]*>/i)?.[0];
		if (link) raw = attr(link, 'href');
	}

	if (!raw) return null;

	try {
		// covers relative paths and protocol-relative "//host/img.png"
		return new URL(raw.trim(), baseUrl).toString();
	} catch {
		return null;
	}
}

export async function previewImage(url: string): Promise<string | null> {
	if (!url) return null;

	const fromVideo = linkThumbnail(url);
	if (fromVideo) return fromVideo;

	let target: URL;
	try {
		target = new URL(url);
	} catch {
		return null;
	}
	if (target.protocol !== 'http:' && target.protocol !== 'https:') return null;

	const hit = cache.get(url);
	if (hit && Date.now() - hit.at < TTL) return hit.image;

	let image: string | null = null;
	try {
		const res = await fetch(target, {
			redirect: 'follow',
			signal: AbortSignal.timeout(TIMEOUT_MS),
			headers: {
				// plenty of sites serve meta tags only to something that looks like a browser
				'user-agent':
					'Mozilla/5.0 (compatible; louigiecaminoy.com link preview; +https://louigiecaminoy.com)',
				accept: 'text/html,application/xhtml+xml'
			}
		});

		if (res.ok && (res.headers.get('content-type') ?? '').includes('text/html')) {
			const html = (await res.text()).slice(0, MAX_HTML);
			image = findImage(html, res.url || target.toString());
		}
	} catch {
		// an unreachable or slow link just falls back to the binary plate
		image = null;
	}

	cache.set(url, { image, at: Date.now() });
	return image;
}

/** Fills in `image` for every entry that does not already have one. */
export async function withPreviews<T extends { url: string; image?: string }>(
	items: readonly T[]
): Promise<T[]> {
	return Promise.all(
		items.map(async (item) => {
			if (item.image) return item;
			const image = await previewImage(item.url);
			return image ? { ...item, image } : item;
		})
	);
}
