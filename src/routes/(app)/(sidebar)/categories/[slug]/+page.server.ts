import { COOKIE_ACCESS_TOKEN } from '$env/static/private';
import apiClient from '$lib/server/api/client';
import type { ICategory, IPaginated, IRecipe } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url, params }) => {
	const { slug } = params;

	let page = url.searchParams.get('page') || '1';
	if (isNaN(parseInt(page, 10))) {
		page = '1';
	}

	let category: ICategory;
	try {
		const categoryRes = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').get(
			`/categories/${slug}`
		);
		category = categoryRes.data;
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipes');
	}

	try {
		const recipesRes = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').get(
			`/recipes?page=${page}&categories=${category.uuid}`
		);
		return {
			category,
			recipes: recipesRes.data as IPaginated<IRecipe[]>
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipes');
	}
};
