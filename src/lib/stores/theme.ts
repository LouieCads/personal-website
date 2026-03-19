import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? localStorage.getItem('theme') : null;
const initial: 'light' | 'dark' = (stored as 'light' | 'dark') ?? 'light';

export const theme = writable<'light' | 'dark'>(initial);

theme.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem('theme', value);
	if (value === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
});
