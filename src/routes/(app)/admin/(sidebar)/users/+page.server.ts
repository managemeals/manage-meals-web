import apiClient from '$lib/server/api/client';
import type { IUser } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const usersRes = await apiClient(cookies.getAll()).get('/admin/users?sort=-createdAt');
		return {
			users: usersRes.data as IUser[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading users');
	}
};
