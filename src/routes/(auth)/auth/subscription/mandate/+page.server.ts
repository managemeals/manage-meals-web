import { error, redirect } from '@sveltejs/kit';
import { apiClientUnauthed } from '$lib/server/api/client';
import axios, { AxiosError } from 'axios';
import type { IAPIError } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const uuid = url.searchParams.get('uuid');

	if (!uuid) {
		throw error(400, 'Missing UUID');
	}

	let authorisationUrl = '';
	let hasMandate = false;
	try {
		const res = await apiClientUnauthed.get(`/auth/mandate?uuid=${uuid}`);
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
		return redirect(303, `/auth/subscription/callback?uuid=${uuid}`);
	}

	return redirect(303, authorisationUrl);
};
