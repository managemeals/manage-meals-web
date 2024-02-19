import { connectRedis } from '$lib/server/cache/redis';
import { users } from '$lib/server/db/collections';
import { connectMongo } from '$lib/server/db/mongo';
import type { JwtEmailPayload, SessionUser } from '$lib/types';
import jwt from 'jsonwebtoken';

try {
	await connectMongo();
	console.log('Mongo connected');
} catch (error) {
	console.error(error);
}

try {
	await connectRedis();
	console.log('Redis connected');
} catch (error) {
	console.error(error);
}

export const handle = async ({ event, resolve }) => {
	return await resolve(event);
	// const accessToken = (event.cookies.get(AUTH_ACCESS_TOKEN_NAME) || '').substring(7);
	// const refreshToken = (event.cookies.get(AUTH_REFRESH_TOKEN_NAME) || '').substring(7);
	// if (!accessToken && !refreshToken) {
	// 	return await resolve(event);
	// }

	// let jwtPayload: JwtEmailPayload;
	// let newAccessToken = '';
	// let newRefreshToken = '';
	// try {
	// 	jwtPayload = jwt.verify(accessToken, ACCESS_JWT_SECRET) as JwtEmailPayload;
	// } catch (err1) {
	// 	console.log('Verify access token error:', err1);
	// 	try {
	// 		jwtPayload = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as JwtEmailPayload;
	// 		newAccessToken = jwt.sign({ email: jwtPayload.email }, ACCESS_JWT_SECRET, {
	// 			expiresIn: parseInt(AUTH_ACCESS_TOKEN_MAX_AGE, 10)
	// 		});
	// 		newRefreshToken = jwt.sign({ email: jwtPayload.email }, REFRESH_JWT_SECRET, {
	// 			expiresIn: parseInt(AUTH_REFRESH_TOKEN_MAX_AGE, 10)
	// 		});
	// 	} catch (err2) {
	// 		console.log('Verify refresh token error:', err2);
	// 		return await resolve(event);
	// 	}
	// }

	// try {
	// 	const user = await users.findOne({ email: jwtPayload.email });
	// 	if (!user) {
	// 		throw new Error('User not found');
	// 	}
	// 	const sessionUser: SessionUser = {
	// 		uuid: user.uuid,
	// 		name: user.name,
	// 		email: user.email
	// 	};
	// 	event.locals.user = sessionUser;
	// } catch (error) {
	// 	console.log('Error finding user:', error);
	// 	return await resolve(event);
	// }

	// if (newAccessToken && newRefreshToken) {
	// 	event.cookies.set(AUTH_ACCESS_TOKEN_NAME, `Bearer ${newAccessToken}`, {
	// 		path: '/',
	// 		maxAge: parseInt(AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE, 10)
	// 	});
	// 	event.cookies.set(AUTH_REFRESH_TOKEN_NAME, `Bearer ${newRefreshToken}`, {
	// 		path: '/',
	// 		maxAge: parseInt(AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE, 10)
	// 	});
	// }

	// const response = await resolve(event);
	// return response;
};
