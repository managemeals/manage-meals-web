import { PASSWORD_MIN_LENGTH } from '$env/static/private';
import { getErrorMessage } from '$lib/errors';
import { apiClientUnauthed } from '$lib/server/api/client.js';
import type { IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const failObj: IEnhanceFailRes = { inputs: { name, email }, errors: {} };

		if (!name) {
			failObj.errors.name = 'Name is empty';
		}

		if (!email) {
			failObj.errors.email = 'Email is empty';
		}

		if (!password || password.length < parseInt(PASSWORD_MIN_LENGTH, 10)) {
			failObj.errors.password = 'Password is too short';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			await apiClientUnauthed.post('/auth/register', {
				name,
				email,
				password
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'You have been registered! Please verify your email before logging in.',
			messageType: 'success'
		};

		return successObj;
	}
};
