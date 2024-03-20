import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import apiClient from '$lib/server/api/client';
import type { ISearch, ISearchRecipe } from '$lib/types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const q = url.searchParams.get('q');
	if (!q) {
		throw error(400, 'Invalid query');
	}

	try {
		const searchRes = await apiClient(cookies.getAll()).get(`/search?q=${q}&c=recipes&p=1`);
		return json(searchRes.data as ISearch<ISearchRecipe>);
	} catch (e) {
		console.log(e);
		throw new Error('Error searching');
	}
};
