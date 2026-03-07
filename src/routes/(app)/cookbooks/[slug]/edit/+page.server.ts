import apiClient from '$lib/server/api/client';
import type { ICookbook, IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getErrorMessage } from '$lib/errors';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { slug } = params;

	try {
		const res = await apiClient(cookies.getAll()).get(`/cookbooks/${slug}`);
		return {
			cookbook: res.data as ICookbook
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading cookbook');
	}
};

export const actions = {
	edit: async ({ request, cookies, params }) => {
		const { slug } = params;

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

		try {
			await apiClient(cookies.getAll()).patch(`/cookbooks/${slug}`, {
				title,
				description: description || undefined
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Cookbook updated.',
			messageType: 'success',
			slug,
			title
		};

		return successObj;
	},

	delete: async ({ cookies, params }) => {
		const { slug } = params;

		try {
			await apiClient(cookies.getAll()).delete(`/cookbooks/${slug}`, {
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

		return redirect(303, '/cookbooks');
	}
};
