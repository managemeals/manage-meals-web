import apiClient from '$lib/server/api/client';
import type { ITag } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	try {
		const tagsRes = await apiClient(cookies.getAll()).get('/tags');
		return {
			tags: tagsRes.data as ITag[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading tags');
	}
};
