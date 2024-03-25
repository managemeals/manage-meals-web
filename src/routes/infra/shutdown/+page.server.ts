import { INFRA_ENDPOINT_KEY } from '$env/static/private';
import { setLbShutdown } from '$lib/server/infra/health';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const key = url.searchParams.get('key');
	if (!key || key !== INFRA_ENDPOINT_KEY) {
		throw error(403, 'Invalid infra key');
	}

	setLbShutdown(true);
};
