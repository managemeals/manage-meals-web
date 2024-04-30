import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_ACCESS_TOKEN_EXPIRE_SEC,
	COOKIE_REFRESH_TOKEN,
	COOKIE_REFRESH_TOKEN_EXPIRE_SEC
} from '$env/static/private';
import apiClient, { apiClientUnauthed } from '$lib/server/api/client';
import { initLbShutdown } from '$lib/server/infra/health';
import type { Handle } from '@sveltejs/kit';

initLbShutdown();

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/' || event.url.pathname === '/logout') {
		return await resolve(event);
	}

	let accessToken = event.cookies.get(COOKIE_ACCESS_TOKEN) || '';
	let refreshToken = event.cookies.get(COOKIE_REFRESH_TOKEN) || '';

	if (!accessToken && !refreshToken) {
		if (!event.url.pathname.startsWith('/auth') && !event.url.pathname.startsWith('/infra')) {
			return new Response('Redirect', {
				status: 307,
				headers: { Location: `/auth/login?goto=${event.url.pathname}` }
			});
		} else {
			return await resolve(event);
		}
	}

	// If the access token has expired, but not the refresh token, then refresh
	// the tokens
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
			return new Response('Redirect', { status: 307, headers: { Location: '/logout' } });
		}
	}

	try {
		const res = await apiClient([
			{ name: COOKIE_ACCESS_TOKEN, value: accessToken },
			{ name: COOKIE_REFRESH_TOKEN, value: refreshToken }
		]).get('/settings/user');
		event.locals.user = res.data;
	} catch (e) {
		console.log(e);
	}

	const response = await resolve(event);
	return response;
};
