import apiClient from '$lib/server/api/client';
import type { IPopularRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const recipesRes = await apiClient(cookies.getAll()).get('/recipes/trending?limit=20');

		return {
			trendingRecipes: recipesRes.data as IPopularRecipe[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading trending recipes');
	}
};
