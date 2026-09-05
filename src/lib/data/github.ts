const MONTH_LABELS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

export interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
	days: (ContributionDay | null)[];
}

export interface MonthLabel {
	label: string;
	span: number;
}

export interface ContributionGraph {
	weeks: ContributionWeek[];
	months: MonthLabel[];
	total: number;
}

/** Each day cell pairs a `<td data-date data-level>` with a `<tool-tip>` carrying the count. */
const DAY_RE =
	/<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[^>]*><\/td>\s*<tool-tip[^>]*>([^<]*)<\/tool-tip>/g;

/**
 * Scrapes the calendar fragment GitHub renders on a profile
 * (`github.com/users/<name>/contributions`) rather than going through a
 * third-party mirror API — those cache aggressively and lagged behind real
 * totals once private contributions were switched on. Public and unauthenticated,
 * so this still only sees what the profile itself shows to a logged-out visitor
 * (public activity, plus private activity if "Include private contributions on
 * my profile" is enabled). Runs at build/request time on the server, same as
 * the link-preview fetches in `server/preview`.
 *
 * No `from`/`to` params: that's GitHub's own default "last year" window,
 * trailing 12 months ending today. Matches what the profile shows — no
 * blank future months, and no mislabeling months that fall in the previous
 * calendar year.
 */
export async function fetchContributions(username: string): Promise<ContributionGraph> {
	const res = await fetch(`https://github.com/users/${username}/contributions`, {
		signal: AbortSignal.timeout(8000),
		headers: {
			accept: 'text/html',
			'user-agent':
				'Mozilla/5.0 (compatible; louigiecaminoy.com contribution graph; +https://louigiecaminoy.com)'
		}
	});
	if (!res.ok) throw new Error(`github contributions: ${res.status}`);

	const html = await res.text();
	const days: ContributionDay[] = [];
	let total = 0;

	for (const match of html.matchAll(DAY_RE)) {
		const [, date, level, text] = match;
		const countMatch = text.match(/^([\d,]+) contribution/);
		const count = countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0;
		days.push({ date, count, level: Number(level) as ContributionDay['level'] });
		total += count;
	}
	if (!days.length) return { weeks: [], months: [], total: 0 };

	days.sort((a, b) => a.date.localeCompare(b.date));

	// Pad the front so the first column starts on Sunday, matching GitHub's own grid.
	const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
	const padded: (ContributionDay | null)[] = [...Array(firstDow).fill(null), ...days];

	const weeks: ContributionWeek[] = [];
	for (let i = 0; i < padded.length; i += 7) {
		weeks.push({ days: padded.slice(i, i + 7) });
	}

	// A column is labeled with whichever month's 1st falls inside it — same rule
	// GitHub's own graph uses, so a column holding e.g. Aug 31 + Sep 1-6 reads as
	// "Sep", not a stray one-column "Aug" sliver at the very start of the grid.
	const months: MonthLabel[] = [];
	let lastMonth = -1;
	for (const week of weeks) {
		const monthStart = week.days.find(
			(d): d is ContributionDay => Boolean(d) && Number(d!.date.slice(8, 10)) === 1
		);
		let month: number;
		if (monthStart) {
			month = new Date(`${monthStart.date}T00:00:00Z`).getUTCMonth();
		} else if (lastMonth !== -1) {
			month = lastMonth;
		} else {
			const firstReal = week.days.find((d): d is ContributionDay => Boolean(d));
			month = firstReal ? new Date(`${firstReal.date}T00:00:00Z`).getUTCMonth() : 0;
		}
		if (month !== lastMonth) {
			months.push({ label: MONTH_LABELS[month], span: 1 });
			lastMonth = month;
		} else if (months.length) {
			months[months.length - 1].span++;
		}
	}

	return { weeks, months, total };
}
