import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete(COOKIE_ACCESS_TOKEN, { path: '/' });
	cookies.delete(COOKIE_REFRESH_TOKEN, { path: '/' });

	redirect(307, '/');
};
