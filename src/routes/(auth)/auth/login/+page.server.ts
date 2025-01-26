import { env } from '$env/dynamic/private';
import { apiClientUnauthed } from '$lib/server/api/client.js';
import type { IAPIError, IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '$lib/errors';
import type { Actions } from './$types';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const gotoPath = data.get('goto') as string;

		const failObj: IEnhanceFailRes = { inputs: { email }, errors: {} };

		if (!email) {
			failObj.errors.email = 'Email is empty';
		}

		if (!password || password.length < parseInt(env.PASSWORD_MIN_LENGTH, 10)) {
			failObj.errors.password = 'Password is too short';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			const res = await apiClientUnauthed.post('/auth/login', {
				email,
				password
			});
			cookies.set(env.COOKIE_ACCESS_TOKEN, res.data.accessToken, {
				path: '/',
				maxAge: parseInt(env.COOKIE_ACCESS_TOKEN_EXPIRE_SEC, 10)
			});
			cookies.set(env.COOKIE_REFRESH_TOKEN, res.data.refreshToken, {
				path: '/',
				maxAge: parseInt(env.COOKIE_REFRESH_TOKEN_EXPIRE_SEC, 10)
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message =
				'There was an error logging in, please check if email and password are correct.';

			if (axios.isAxiosError(e)) {
				if (
					((e as AxiosError<IAPIError>)?.response?.data.message || '').startsWith(
						'Email not verified'
					)
				) {
					failObj.messageType = 'warning';
					failObj.message = (e as AxiosError<IAPIError>)?.response?.data.message;
				}
			}

			return fail(500, failObj);
		}

		return redirect(303, gotoPath || '/categories');
	},
	verify: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		const failObj: IEnhanceFailRes = {
			inputs: { email },
			errors: {},
			message: '',
			messageType: 'error'
		};

		if (!email) {
			failObj.message = 'Verify email is empty.';
			return fail(400, failObj);
		}

		try {
			await apiClientUnauthed.post('/auth/email-verify-resend', {
				email
			});
		} catch (e) {
			console.log(e);
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Verify email sent, please check your inbox.',
			messageType: 'success'
		};

		return successObj;
	}
} satisfies Actions;
