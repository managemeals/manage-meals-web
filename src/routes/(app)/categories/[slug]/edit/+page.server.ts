import apiClient from '$lib/server/api/client';
import type { ICategory, IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getErrorMessage } from '$lib/errors';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { slug } = params;

	try {
		const res = await apiClient(cookies.getAll()).get(`/categories/${slug}`);
		return {
			category: res.data as ICategory
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading category');
	}
};

export const actions = {
	edit: async ({ request, cookies, params }) => {
		const { slug } = params;

		const data = await request.formData();
		const name = data.get('name') as string;

		const failObj: IEnhanceFailRes = { inputs: { name }, errors: {} };

		if (!name) {
			failObj.errors.name = 'Name is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).patch(`/categories/${slug}`, {
				name
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Category updated.',
			messageType: 'success',
			slug,
			name
		};

		return successObj;
	},

	delete: async ({ cookies, params }) => {
		const { slug } = params;

		try {
			await apiClient(cookies.getAll()).delete(`/categories/${slug}`);
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				deleteMessageType: 'error',
				deleteMessage: getErrorMessage(e)
			};
			return fail(500, failObj);
		}

		return redirect(303, '/categories');
	}
};
