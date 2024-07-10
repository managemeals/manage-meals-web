import apiClient from '$lib/server/api/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { IShareRecipe } from '$lib/types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const res = await apiClient(cookies.getAll()).get(`/share/recipes/${slug}`);
		return {
			shareRecipe: res.data as IShareRecipe
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Share recipe not found');
	}
};
