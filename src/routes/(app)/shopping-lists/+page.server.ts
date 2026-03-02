import apiClient from '$lib/server/api/client';
import { getErrorMessage } from '$lib/errors';
import type { IEnhanceRes, IShoppingList } from '$lib/types';
import axios from 'axios';
import { fail } from '@sveltejs/kit';
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

export const actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const slug = data.get('slug') as string;

		try {
			await apiClient(cookies.getAll()).delete(`/shopping-lists/${slug}`, {
				headers: {
					'Content-Type': null
				}
			});
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				deleteMessageType: 'error',
				deleteMessage: getErrorMessage(e)
			};
			return fail(500, failObj);
		}
	}
};
