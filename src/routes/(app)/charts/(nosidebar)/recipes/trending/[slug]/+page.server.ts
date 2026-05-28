import apiClient from '$lib/server/api/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IPopularRecipe } from '$lib/types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const recipeRes = await apiClient(cookies.getAll()).get(`/recipes/trending/${slug}`);
		return {
			trendingRecipe: recipeRes.data as IPopularRecipe
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Recipe not found');
	}
};
