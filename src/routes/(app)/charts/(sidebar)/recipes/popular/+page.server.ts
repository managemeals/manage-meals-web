import apiClient from '$lib/server/api/client';
import type { IPopularRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const recipesRes = await apiClient(cookies.getAll()).get('/recipes/popular?limit=20');

		return {
			popularRecipes: recipesRes.data as IPopularRecipe[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading popular recipes');
	}
};
