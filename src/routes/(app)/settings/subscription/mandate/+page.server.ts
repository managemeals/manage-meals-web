import { redirect } from '@sveltejs/kit';
import apiClient from '$lib/server/api/client';
import axios, { AxiosError } from 'axios';
import type { IAPIError } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	let authorisationUrl = '';
	let hasMandate = false;
	try {
		const res = await apiClient(cookies.getAll()).get('/subscriptions/mandate');
		authorisationUrl = res.data.authorisationUrl;
	} catch (e) {
		console.log(e);
		if (
			axios.isAxiosError(e) &&
			((e as AxiosError<IAPIError>)?.response?.data.message || '').includes('already has one')
		) {
			hasMandate = true;
		} else {
			throw new Error('Error getting authorisation URL');
		}
	}

	if (hasMandate) {
		return redirect(303, '/settings/subscription/callback');
	}

	return redirect(303, authorisationUrl);
};
