import apiClient from '$lib/server/api/client';
import type { IRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const res = await apiClient(cookies.getAll()).get('/admin/recipes/latest');
		return {
			recipesLatest: res.data as IRecipe[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipes');
	}
};
