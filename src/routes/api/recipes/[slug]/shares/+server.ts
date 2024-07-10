import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import apiClient from '$lib/server/api/client';
import type { IShareRecipe } from '$lib/types';

export const GET: RequestHandler = async ({ cookies, params }) => {
	const { slug } = params;

	try {
		const res = await apiClient(cookies.getAll()).get(`/recipes/${slug}/shares`);
		return json(res.data as IShareRecipe[]);
	} catch (e) {
		console.log(e);
		throw new Error('Error getting share recipes');
	}
};
