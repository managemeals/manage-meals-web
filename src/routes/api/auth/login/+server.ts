import {
	ACCESS_JWT_SECRET,
	AUTH_ACCESS_TOKEN_EXPIRE_SEC,
	AUTH_REFRESH_TOKEN_EXPIRE_SEC,
	REFRESH_JWT_SECRET
} from '$env/static/private';
import { users } from '$lib/server/db/collections';
import type { ApiErrorRes, ApiRes, User } from '$lib/types';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST = async ({ request }) => {
	const { email, password } = await request.json();

	const apiRes: ApiRes = {};
	const apiErrorRes: ApiErrorRes = {
		inputs: {}
	};

	if (!email) {
		apiErrorRes.inputs.email = { message: 'Email is empty' };
	}

	if (!password) {
		apiErrorRes.inputs.password = { message: 'Password is empty' };
	}

	if (Object.keys(apiErrorRes.inputs).length) {
		apiRes.errors = apiErrorRes;
		return json(apiRes, { status: 400 });
	}

	let user: User;
	try {
		user = (await users.findOne({ email }, { projection: { _id: 0 } })) as User;
		if (!user) {
			apiRes.message = 'Could not login, please check if email and password are correct.';
			apiRes.messageType = 'warning';
			return json(apiRes, { status: 400 });
		}
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error logging in, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	let accessToken = '';
	let refreshToken = '';
	try {
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			apiRes.message = 'Could not login, please check if email and password are correct.';
			apiRes.messageType = 'warning';
			return json(apiRes, { status: 400 });
		}
		if (!user.emailVerified) {
			apiRes.message =
				"Email not verified, please check your email for a link to verify. Didn't receive a verify email?";
			apiRes.messageType = 'warning';
			apiRes.messageTypeExtra = {
				emailVerifyWarning: true
			};
			return json(apiRes, { status: 403 });
		}
		accessToken = jwt.sign({ email }, ACCESS_JWT_SECRET, {
			expiresIn: parseInt(AUTH_ACCESS_TOKEN_EXPIRE_SEC, 10)
		});
		refreshToken = jwt.sign({ email }, REFRESH_JWT_SECRET, {
			expiresIn: parseInt(AUTH_REFRESH_TOKEN_EXPIRE_SEC, 10)
		});
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error logging in, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	apiRes.message = 'You have been logged in.';
	apiRes.messageType = 'success';
	apiRes.data = {
		accessToken,
		refreshToken
	};
	return json(apiRes, { status: 200 });
};
