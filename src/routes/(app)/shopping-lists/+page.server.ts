import apiClient from '$lib/server/api/client';
import type { IShoppingList } from '$lib/types';
import axios from 'axios';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, parent }) => {
	let shoppingLists: IShoppingList[] = [];

	const parentData = await parent();

	try {
		const res = await apiClient(cookies.getAll()).get('/shopping-lists');
		shoppingLists = res.data as IShoppingList[];
	} catch (e) {
		console.log(e);
		if (!axios.isAxiosError(e) || e.response?.data.message === 'Invalid Authorization header') {
			throw new Error('Error loading shopping lists');
		}
	}

	return {
		user: parentData.user,
		shoppingLists
	};
};
