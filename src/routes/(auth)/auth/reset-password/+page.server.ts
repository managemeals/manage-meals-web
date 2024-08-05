import { env } from '$env/dynamic/private';
import { getErrorMessage } from '$lib/errors';
import { apiClientUnauthed } from '$lib/server/api/client.js';
import type { IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token') as string;
		const password = data.get('password') as string;

		const failObj: IEnhanceFailRes = { inputs: {}, errors: {} };

		if (!token) {
			failObj.messageType = 'error';
			failObj.message = 'Token is empty.';
			failObj.errors.token = 'Token is empty';
		}

		if (!password || password.length < parseInt(env.PASSWORD_MIN_LENGTH, 10)) {
			failObj.errors.password = 'Password is too short';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			await apiClientUnauthed.post('/auth/reset-password', {
				token,
				password
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Password changed, please login with your new password.',
			messageType: 'success'
		};

		return successObj;
	}
};
