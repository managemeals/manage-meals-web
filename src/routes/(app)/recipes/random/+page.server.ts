import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import apiClient from '$lib/server/api/client';
import type { IRecipe } from '$lib/types';

export const load: PageServerLoad = async ({ cookies }) => {
	let recipe: IRecipe | null = null;
	try {
		const res = await apiClient(cookies.getAll()).get('/recipes/random');
		recipe = res.data as IRecipe;
	} catch (e) {
		console.log(e);
	}

	if (!recipe) {
		return redirect(303, '/categories');
	}

	return redirect(303, `/recipes/${recipe.slug}`);
};
