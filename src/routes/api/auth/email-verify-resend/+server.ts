import { EMAIL_VERIFY_JWT_EXPIRE_SEC, EMAIL_VERIFY_JWT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { sendMail } from '$lib/server/email/sender';
import type { ApiErrorRes, ApiRes } from '$lib/types';
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

	try {
		const verifyToken = jwt.sign({ email }, EMAIL_VERIFY_JWT_SECRET, {
			expiresIn: parseInt(EMAIL_VERIFY_JWT_EXPIRE_SEC, 10)
		});
		await sendMail({
			to: email,
			subject: 'Verify email',
			html: `Hi, please <a href="${PUBLIC_APP_URL}/auth/email-verify?token=${verifyToken}">click here</a> to verify your email.<br/><br/>Or visit this link: <a href="${PUBLIC_APP_URL}/auth/email-verify?token=${verifyToken}">${PUBLIC_APP_URL}/auth/email-verify?token=${verifyToken}</a><br/><br/>Best,<br/>ManageMeals`
		});
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error sending verify email, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	apiRes.message = 'Verify email sent, please check your inbox.';
	apiRes.messageType = 'success';

	return json(apiRes, { status: 200 });
};
