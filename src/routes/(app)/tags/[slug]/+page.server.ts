import apiClient from '$lib/server/api/client';
import type { IPaginated, IRecipe, ITag } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url, params }) => {
	const { slug } = params;

	let page = url.searchParams.get('page') || '1';
	if (isNaN(parseInt(page, 10))) {
		page = '1';
	}

	let tag: ITag;
	try {
		const tagRes = await apiClient(cookies.getAll()).get(`/tags/${slug}`);
		tag = tagRes.data;
	} catch (e) {
		console.log(e);
		throw error(404, 'Tag not found');
	}

	try {
		const recipesRes = await apiClient(cookies.getAll()).get(
			`/recipes?page=${page}&tags=${tag.uuid}`
		);
		return {
			tag,
			recipes: recipesRes.data as IPaginated<IRecipe[]>
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipes');
	}
};
