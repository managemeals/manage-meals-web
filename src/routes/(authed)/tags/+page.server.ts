import { COOKIE_ACCESS_TOKEN } from '$env/static/private';
import apiClient from '$lib/server/api/client';
import type { ITag } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	console.log('tags load');
	try {
		const tagsRes = await apiClient(cookies.get(COOKIE_ACCESS_TOKEN) || '').get('/tags');
		return {
			tags: tagsRes.data as ITag[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading tags');
	}
};
