import { getErrorMessage } from '$lib/errors';
import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;

		const failObj: IEnhanceFailRes = { inputs: { title, description }, errors: {} };

		if (!title) {
			failObj.errors.title = 'Title is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/cookbooks', {
				title,
				description: description || undefined
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		return { slug, title };
	}
};
