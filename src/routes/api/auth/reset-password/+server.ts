import {
	BCRYPT_SALT_ROUNDS,
	PASSWORD_MIN_LENGTH,
	RESET_PASS_JWT_SECRET
} from '$env/static/private';
import { users } from '$lib/server/db/collections';
import type { ApiErrorRes, ApiRes, JwtEmailPayload } from '$lib/types';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const POST = async ({ request }) => {
	const { token, password } = await request.json();

	const apiRes: ApiRes = {};
	const apiErrorRes: ApiErrorRes = {
		inputs: {}
	};

	if (!token) {
		apiErrorRes.inputs.token = { message: 'Token is empty' };
	}

	if (!password || password.length < parseInt(PASSWORD_MIN_LENGTH, 10)) {
		apiErrorRes.inputs.password = {
			message: `Password is too short, minimum ${PASSWORD_MIN_LENGTH} characters`
		};
	}

	if (Object.keys(apiErrorRes.inputs).length) {
		apiRes.errors = apiErrorRes;
		return json(apiRes, { status: 400 });
	}

	let jwtPayload: JwtEmailPayload;
	try {
		jwtPayload = jwt.verify(token, RESET_PASS_JWT_SECRET) as JwtEmailPayload;
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	try {
		const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS, 10));
		const hash = await bcrypt.hash(password, salt);

		await users.updateOne(
			{ email: jwtPayload.email },
			{
				$set: {
					password: hash
				}
			}
		);
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	apiRes.message = 'Password changed, please login with your new password.';
	apiRes.messageType = 'success';
	return json(apiRes, { status: 200 });
};
