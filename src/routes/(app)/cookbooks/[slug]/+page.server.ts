import apiClient from '$lib/server/api/client';
import { getErrorMessage } from '$lib/errors';
import type { ICookbook, IEnhanceRes } from '$lib/types';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const cookbookRes = await apiClient(cookies.getAll()).get(`/cookbooks/${slug}`);
		return {
			cookbook: cookbookRes.data as ICookbook
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Cookbook not found');
	}
};

export const actions = {
	removerecipe: async ({ params, request, cookies }) => {
		const { slug } = params;
		const data = await request.formData();
		const recipeUuid = data.get('recipeUuid') as string;

		try {
			const cookbookRes = await apiClient(cookies.getAll()).get(`/cookbooks/${slug}`);
			const cookbook: ICookbook = cookbookRes.data;
			const recipeUuids = (cookbook.recipeUuids || []).filter((uuid) => uuid !== recipeUuid);
			await apiClient(cookies.getAll()).patch(`/cookbooks/${slug}`, { recipeUuids });
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				messageType: 'error',
				message: getErrorMessage(e)
			};
			return fail(500, failObj);
		}
	}
};
