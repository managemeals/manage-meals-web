import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes, IRecipe } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getErrorMessage } from '$lib/errors';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const recipeRes = await apiClient(cookies.getAll()).get(`/recipes/${slug}`);
		return {
			recipe: recipeRes.data as IRecipe
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Recipe not found');
	}
};

export const actions = {
	shoppinglist: async ({ request, cookies }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const recipeUuids = data.get('recipeUuids') as string;
		const ingredients = data.get('ingredients') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!title) {
			failObj.shoppingListMessageType = 'error';
			failObj.shoppingListMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/shopping-lists', {
				title,
				ingredients: ingredients.split('|||').filter(Boolean),
				recipeUuids: recipeUuids.split(',').filter(Boolean)
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.shoppingListMessageType = 'error';
			failObj.shoppingListMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/shopping-lists/${slug}`);
	}
};
