import {
	BCRYPT_SALT_ROUNDS,
	EMAIL_VERIFY_JWT_EXPIRE_SEC,
	EMAIL_VERIFY_JWT_SECRET,
	PASSWORD_MIN_LENGTH
} from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { users } from '$lib/server/db/collections';
import { sendMail } from '$lib/server/email/sender';
import type { ApiErrorRes, ApiRes } from '$lib/types';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST = async ({ request }) => {
	const { name, email, password } = await request.json();

	const apiRes: ApiRes = {};
	const apiErrorRes: ApiErrorRes = {
		inputs: {}
	};

	if (!name) {
		apiErrorRes.inputs.name = { message: 'Name is empty' };
	}

	if (!email) {
		apiErrorRes.inputs.email = { message: 'Email is empty' };
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

	try {
		const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS, 10));
		const hash = await bcrypt.hash(password, salt);

		await users.insertOne({
			uuid: crypto.randomUUID(),
			name,
			email,
			password: hash,
			createdAt: new Date(),
			emailVerified: false
		});
	} catch (error) {
		console.log(error);
		apiRes.message = 'There was an error registering, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
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
		apiRes.message = 'There was an error registering, please try again.';
		apiRes.messageType = 'error';
		return json(apiRes, { status: 500 });
	}

	apiRes.message = 'You have been registered! Please verify your email before signing in.';
	apiRes.messageType = 'success';
	return json(apiRes, { status: 201 });
};
