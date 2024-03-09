import { COOKIE_ACCESS_TOKEN } from '$env/static/private';
import apiClient from '$lib/server/api/client';
import type { ICategory } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	console.log('categories load');
	try {
		const categoriesRes = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').get(
			'/categories'
		);
		return {
			categories: categoriesRes.data as ICategory[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading categories');
	}
};
