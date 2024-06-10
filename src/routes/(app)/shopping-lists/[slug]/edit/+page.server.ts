import type { IEnhanceFailRes, IEnhanceRes, IShoppingList } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import apiClient from '$lib/server/api/client';
import { getErrorMessage } from '$lib/errors';

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

export const actions = {
	edit: async ({ request, cookies, params }) => {
		const { slug } = params;

		const data = await request.formData();
		const title = data.get('title') as string;
		const ingredients = data.get('ingredients') as string;
		const recipeUuids = data.get('recipeUuids') as string;

		const failObj: IEnhanceFailRes = { inputs: { title }, errors: {} };

		if (!title) {
			failObj.errors.title = 'Title is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).put(`/shopping-lists/${slug}`, {
				title,
				ingredients: ingredients
					.replaceAll('\r', '\n')
					.split('\n\n')
					.filter((d) => d)
					.map((d) => d.trim()),
				recipeUuids: recipeUuids ? recipeUuids.split(',') : []
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/shopping-lists/${slug}`);
	},

	delete: async ({ cookies, params }) => {
		const { slug } = params;

		try {
			await apiClient(cookies.getAll()).delete(`/shopping-lists/${slug}`);
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				deleteMessageType: 'error',
				deleteMessage: getErrorMessage(e)
			};
			return fail(500, failObj);
		}

		return redirect(303, '/shopping-lists');
	}
};
