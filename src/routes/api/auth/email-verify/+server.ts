import { EMAIL_VERIFY_JWT_SECRET } from '$env/static/private';
import { users } from '$lib/server/db/collections';
import type { ApiErrorRes, ApiRes, JwtEmailPayload } from '$lib/types';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const POST = async ({ request }) => {
	const { token } = await request.json();

	const apiRes: ApiRes = {};
	const apiErrorRes: ApiErrorRes = {
		inputs: {}
	};

	if (!token) {
		apiErrorRes.inputs.token = { message: 'Token is empty' };
	}

	if (Object.keys(apiErrorRes.inputs).length) {
		apiRes.errors = apiErrorRes;
		return json(apiRes, { status: 400 });
	}

	let jwtPayload: JwtEmailPayload;
	try {
		jwtPayload = jwt.verify(token, EMAIL_VERIFY_JWT_SECRET) as JwtEmailPayload;
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	try {
		await users.updateOne(
			{ email: jwtPayload.email },
			{
				$set: {
					emailVerified: true
				}
			}
		);
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	apiRes.message = 'Email verified, you can now login.';
	apiRes.messageType = 'success';
	return json(apiRes, { status: 200 });
};
