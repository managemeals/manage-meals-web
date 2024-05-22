import apiClient from '$lib/server/api/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { IMealPlan } from '$lib/types';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const res = await apiClient(cookies.getAll()).get('/meal-plans/latest');
		return json(res.data as IMealPlan);
	} catch (e) {
		console.log(e);
		throw new Error('Error getting latest meal plan');
	}
};
