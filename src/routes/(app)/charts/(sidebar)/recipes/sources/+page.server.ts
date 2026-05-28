import apiClient from '$lib/server/api/client';
import type { IImportHostStat } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const res = await apiClient(cookies.getAll()).get('/recipes/charts/import-hosts?limit=25');

		return {
			importHosts: res.data as IImportHostStat[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipe sources chart');
	}
};
