import apiClient from '$lib/server/api/client';
import type { IPaginated, IRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	let page = url.searchParams.get('page') || '1';
	if (isNaN(parseInt(page, 10))) {
		page = '1';
	}

	try {
		const recipesRes = await apiClient(cookies.getAll()).get(`/recipes?page=${page}&categories=[]`);
		return {
			recipes: recipesRes.data as IPaginated<IRecipe[]>
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipes');
	}
};
