import type { IAccessRefreshToken, IEnhanceFailRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { apiClientUnauthed } from '$lib/server/api/client';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url }) => {
	const state = url.searchParams.get('state');

	console.log('state', state);

	if (!state) {
		return;
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const state = data.get('state') as string;

		const failObj: IEnhanceFailRes = { inputs: { state }, errors: {} };

		if (!state) {
			failObj.messageType = 'error';
			failObj.message = 'State is empty';
			failObj.errors.state = 'State is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			const res = await apiClientUnauthed.post<IAccessRefreshToken>('/auth/oauth/exchange-token', {
				state
			});
			cookies.set(env.COOKIE_ACCESS_TOKEN, res.data.accessToken, {
				path: '/',
				maxAge: parseInt(env.COOKIE_ACCESS_TOKEN_EXPIRE_SEC, 10)
			});
			cookies.set(env.COOKIE_REFRESH_TOKEN, res.data.refreshToken, {
				path: '/',
				maxAge: parseInt(env.COOKIE_REFRESH_TOKEN_EXPIRE_SEC, 10)
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = 'There was an error exchanging tokens, please try logging in again.';
			return fail(500, failObj);
		}

		return redirect(303, '/categories');
	}
} satisfies Actions;
