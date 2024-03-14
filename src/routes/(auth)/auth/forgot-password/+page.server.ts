import { apiClientUnauthed } from '$lib/server/api/client.js';
import type { IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		const failObj: IEnhanceFailRes = {
			inputs: { email },
			errors: {},
			message: '',
			messageType: 'error'
		};

		if (!email) {
			failObj.message = 'Email is empty.';
			return fail(400, failObj);
		}

		try {
			await apiClientUnauthed.post('/auth/forgot-password', {
				email
			});
		} catch (e) {
			console.log(e);
			failObj.message = 'There was an error, please try again.';
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Password reset link sent, please check your email.',
			messageType: 'success'
		};

		return successObj;
	}
};
