import apiClient from '$lib/server/api/client';
import type { IAdminStatus } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const res = await apiClient(cookies.getAll()).get('/admin/status');
		return res.data as IAdminStatus;
	} catch (e) {
		console.log(e);
		throw new Error('Error loading status');
	}
};
