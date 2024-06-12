import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.user?.isAdmin) {
		redirect(307, '/categories');
	}
};
