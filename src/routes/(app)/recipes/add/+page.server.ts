import { COOKIE_ACCESS_TOKEN } from '$env/static/private';
import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const url = data.get('url') as string;

		const failObj: IEnhanceFailRes = { inputs: { url }, errors: {} };

		if (!url) {
			failObj.errors.url = 'URL is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').post(
				`/recipes/import?url=${url}`,
				{}
			);
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = 'There was an error adding recipe, please try again.';
			return fail(500, failObj);
		}

		return redirect(303, `/recipes/${slug}`);
	}
};
