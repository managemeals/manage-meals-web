import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete(env.COOKIE_ACCESS_TOKEN, { path: '/' });
	cookies.delete(env.COOKIE_REFRESH_TOKEN, { path: '/' });

	redirect(307, '/auth/login');
};
