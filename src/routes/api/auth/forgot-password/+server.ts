import { RESET_PASS_JWT_EXPIRE_SEC, RESET_PASS_JWT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { users } from '$lib/server/db/collections';
import { sendMail } from '$lib/server/email/sender';
import type { ApiErrorRes, ApiRes, User } from '$lib/types';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const POST = async ({ request }) => {
	const { email } = await request.json();

	const apiRes: ApiRes = {};
	const apiErrorRes: ApiErrorRes = {
		inputs: {}
	};

	if (!email) {
		apiErrorRes.inputs.email = { message: 'Email is empty' };
	}

	if (Object.keys(apiErrorRes.inputs).length) {
		apiRes.errors = apiErrorRes;
		return json(apiRes, { status: 400 });
	}

	let user: User;
	try {
		user = (await users.findOne({ email }, { projection: { _id: 0 } })) as User;
		if (!user) {
			apiRes.message = 'There was an error, please check if email is correct.';
			apiRes.messageType = 'warning';
			return json(apiRes, { status: 400 });
		}
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	try {
		const resetToken = jwt.sign({ email: user.email }, RESET_PASS_JWT_SECRET, {
			expiresIn: parseInt(RESET_PASS_JWT_EXPIRE_SEC, 10)
		});
		await sendMail({
			to: user.email,
			subject: 'Reset password',
			html: `Hi, please <a href="${PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}">click here</a> to reset your password.<br/><br/>Or visit this link: <a href="${PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}">${PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}</a><br/><br/>Best,<br/>ManageMeals`
		});
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	apiRes.message = 'Password reset link sent, please check your email.';
	apiRes.messageType = 'success';

	return json(apiRes, { status: 200 });
};
