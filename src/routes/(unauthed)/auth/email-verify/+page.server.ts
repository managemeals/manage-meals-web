import { apiClientUnauthed } from '$lib/server/api/client.js';
import type { IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token') as string;

		const failObj: IEnhanceFailRes = {
			inputs: { token },
			errors: {},
			message: '',
			messageType: 'error'
		};

		if (!token) {
			failObj.message = 'Token is empty.';
			return fail(400, failObj);
		}

		try {
			await apiClientUnauthed.post('/auth/email-verify', {
				token
			});
		} catch (e) {
			console.log(e);
			failObj.message = 'There was an error verifying email, please try again.';
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Email verified, you can now login.',
			messageType: 'success'
		};

		return successObj;
	}
};
