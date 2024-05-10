import { error, redirect } from '@sveltejs/kit';
import apiClient from '$lib/server/api/client';
import type { PageServerLoad } from './$types';
import axios, { AxiosError } from 'axios';
import type { IAPIError } from '$lib/types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		await apiClient(cookies.getAll()).post('/subscriptions', {});
	} catch (e) {
		console.log(e);
		if (
			axios.isAxiosError(e) &&
			((e as AxiosError<IAPIError>)?.response?.data.message || '').includes('already subscribed')
		) {
			throw error(400, (e as AxiosError<IAPIError>)?.response?.data.message);
		}
		throw new Error('Error creating subscription');
	}

	return redirect(303, '/settings/subscription/success');
};
