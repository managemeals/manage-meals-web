import { COOKIE_ACCESS_TOKEN } from '$env/static/private';
import apiClient from '$lib/server/api/client';
import type { ISearch, ISearchRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const q = url.searchParams.get('q');
	let page = url.searchParams.get('page') || '1';
	if (isNaN(parseInt(page, 10))) {
		page = '1';
	}

	if (!q) {
		return {
			search: undefined
		};
	}

	try {
		const searchRes = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').get(
			`/search?q=${q}&c=recipes&p=${page}`
		);
		return {
			q,
			search: searchRes.data as ISearch<ISearchRecipe>
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error searching');
	}
};
