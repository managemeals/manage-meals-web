import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_ACCESS_TOKEN_EXPIRE_SEC,
	COOKIE_REFRESH_TOKEN,
	COOKIE_REFRESH_TOKEN_EXPIRE_SEC
} from '$env/static/private';
import apiClient, { apiClientUnauthed } from '$lib/server/api/client';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let accessToken = event.cookies.get(COOKIE_ACCESS_TOKEN) || '';
	let refreshToken = event.cookies.get(COOKIE_REFRESH_TOKEN) || '';

	if (!accessToken && !refreshToken) {
		return await resolve(event);
	}

	// If the access token has expired, but not the refresh token
	if (!accessToken && refreshToken) {
		try {
			const res = await apiClientUnauthed.post('/auth/refresh-token', {
				token: refreshToken
			});
			accessToken = res.data.accessToken;
			refreshToken = res.data.refreshToken;
			event.cookies.set(COOKIE_ACCESS_TOKEN, accessToken, {
				path: '/',
				maxAge: parseInt(COOKIE_ACCESS_TOKEN_EXPIRE_SEC, 10)
			});
			event.cookies.set(COOKIE_REFRESH_TOKEN, refreshToken, {
				path: '/',
				maxAge: parseInt(COOKIE_REFRESH_TOKEN_EXPIRE_SEC, 10)
			});
		} catch (e) {
			console.log(e);
			return await resolve(event);
		}
	}

	try {
		const res = await apiClient(accessToken).get('/settings/user');
		event.locals.user = res.data;
	} catch (e) {
		console.log(e);
	}

	const response = await resolve(event);
	return response;
};
