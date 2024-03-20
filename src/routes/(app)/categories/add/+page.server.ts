import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const failObj: IEnhanceFailRes = { inputs: { name }, errors: {} };

		if (!name) {
			failObj.errors.name = 'Name is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/categories', {
				name
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = 'There was an error adding category, please try again.';
			return fail(500, failObj);
		}

		return redirect(303, `/categories/${slug}`);
	}
};
