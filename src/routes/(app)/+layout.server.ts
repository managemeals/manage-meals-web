import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent, url }) => {
	const parentData = await parent();

	if (!locals.user && !url.pathname.startsWith('/share')) {
		redirect(307, '/auth/login');
	}

	return { user: parentData.user };
};
