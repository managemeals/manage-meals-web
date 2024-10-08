import apiClient from '$lib/server/api/client';
import type { ICategory } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	try {
		const categoriesRes = await apiClient(cookies.getAll()).get('/categories');
		return {
			categories: categoriesRes.data as ICategory[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading categories');
	}
};
