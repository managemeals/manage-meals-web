import type { IShoppingList } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import apiClient from '$lib/server/api/client';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { slug } = params;

	let shoppingList: IShoppingList;
	try {
		const res = await apiClient(cookies.getAll()).get(`/shopping-lists/${slug}`);
		shoppingList = res.data as IShoppingList;
	} catch (e) {
		console.log(e);
		throw error(404, 'Shopping list not found');
	}

	return {
		shoppingList
	};
};
