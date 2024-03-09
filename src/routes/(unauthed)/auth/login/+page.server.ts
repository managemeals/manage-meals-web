import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_ACCESS_TOKEN_EXPIRE_SEC,
	COOKIE_REFRESH_TOKEN,
	COOKIE_REFRESH_TOKEN_EXPIRE_SEC,
	PASSWORD_MIN_LENGTH
} from '$env/static/private';
import { apiClientUnauthed } from '$lib/server/api/client.js';
import type { IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';
import axios from 'axios';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const failObj: IEnhanceFailRes = { inputs: { email, password }, errors: {} };

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
			const res = await apiClientUnauthed.post('/auth/login', {
				email,
				password
			});
			cookies.set(COOKIE_ACCESS_TOKEN, res.data.accessToken, {
				path: '/',
				maxAge: parseInt(COOKIE_ACCESS_TOKEN_EXPIRE_SEC, 10)
			});
			cookies.set(COOKIE_REFRESH_TOKEN, res.data.refreshToken, {
				path: '/',
				maxAge: parseInt(COOKIE_REFRESH_TOKEN_EXPIRE_SEC, 10)
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message =
				'There was an error logging in, please check if email and password are correct.';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (axios.isAxiosError(e) && (e as any).response.data.message === 'Email not verified') {
				failObj.messageTypeExtra = {};
				failObj.messageTypeExtra.emailVerifyWarning = true;
				failObj.messageType = 'warning';
				failObj.message =
					"Email not verified, please check your email for a link to verify. Didn't receive a verify email?";
			}
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'You have been logged in.',
			messageType: 'success'
		};

		return successObj;
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
			failObj.message = 'There was an error sending verify email, please try again.';
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Verify email sent, please check your inbox.',
			messageType: 'success'
		};

		return successObj;
	}
};
