import { COOKIE_ACCESS_TOKEN } from '$env/static/private';
import apiClient from '$lib/server/api/client';
import type { IRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const recipeRes = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').get(
			`/recipes/${slug}`
		);
		return {
			recipe: recipeRes.data as IRecipe
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipe');
	}
};
