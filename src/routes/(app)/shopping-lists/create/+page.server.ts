import { getErrorMessage } from '$lib/errors';
import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
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

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/shopping-lists', {
				title,
				ingredients: ingredients
					.replaceAll('\r', '\n')
					.split('\n\n')
					.filter((d) => d)
					.map((d) => d.trim()),
				recipeUuids: recipeUuids ? recipeUuids.split(',') : []
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/shopping-lists/${slug}`);
	}
};
