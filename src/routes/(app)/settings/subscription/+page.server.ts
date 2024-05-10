import apiClient from '$lib/server/api/client';
import type { IEnhanceRes, ISubscriptionUpcomingPayment } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const parentData = await parent();

	let upcomingPayments: ISubscriptionUpcomingPayment[] = [];

	try {
		const res = await apiClient(cookies.getAll()).get('/subscriptions/payments');
		upcomingPayments = res.data;
	} catch (e) {
		console.log(e);
	}

	return { upcomingPayments, user: parentData.user };
};

export const actions = {
	cancel: async ({ cookies }) => {
		try {
			await apiClient(cookies.getAll()).post('/subscriptions/cancel', {});
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				messageType: 'error',
				message: 'There was an error cancelling subscription, please try again.'
			};
			return fail(500, failObj);
		}

		return redirect(303, '/settings/subscription/cancel');
	}
};
