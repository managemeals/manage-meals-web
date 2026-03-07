import apiClient from '$lib/server/api/client';
import { getErrorMessage } from '$lib/errors';
import type { IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	return {
		cookbooks: parentData.cookbooks
	};
};

export const actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const slug = data.get('slug') as string;

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
	}
};
