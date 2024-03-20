import apiClient from '$lib/server/api/client';
import type { IRecipe } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const recipeRes = await apiClient(cookies.getAll()).get(`/recipes/${slug}`);
		return {
			recipe: recipeRes.data as IRecipe
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Recipe not found');
	}
};
