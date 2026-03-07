import apiClient from '$lib/server/api/client';
import type { ICookbook } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	try {
		const cookbooksRes = await apiClient(cookies.getAll()).get('/cookbooks');
		return {
			cookbooks: cookbooksRes.data as ICookbook[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading cookbooks');
	}
};
