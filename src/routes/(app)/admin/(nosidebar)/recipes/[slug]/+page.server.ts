import apiClient from '$lib/server/api/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IRecipe } from '$lib/types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const recipeRes = await apiClient(cookies.getAll()).get(`/admin/recipes/${slug}`);
		return {
			recipe: recipeRes.data as IRecipe
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Recipe not found');
	}
};
