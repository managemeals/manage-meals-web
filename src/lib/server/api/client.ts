import { env } from '$env/dynamic/private';
import type { IAPIError, ICookie } from '$lib/types';
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';

const sanitizeAxiosError = (error: AxiosError<IAPIError>): AxiosError<IAPIError> => {
	const response = error.response;

	const clean = new AxiosError<IAPIError>(
		error.message,
		error.code,
		undefined,
		undefined,
		response
			? ({
					status: response.status,
					statusText: response.statusText,
					data: response.data
				} as AxiosResponse<IAPIError>)
			: undefined
	);

	clean.isAxiosError = true;
	clean.stack = error.stack;

	return clean;
};

const attachErrorSanitizer = (instance: AxiosInstance) => {
	instance.interceptors.response.use(
		(response) => response,
		(error) => Promise.reject(axios.isAxiosError(error) ? sanitizeAxiosError(error) : error)
	);
};

const apiClientUnauthed = axios.create({
	baseURL: env.API_URL,
	timeout: 30000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

attachErrorSanitizer(apiClientUnauthed);

export { apiClientUnauthed };

const apiClient = (cookies: ICookie[]): AxiosInstance => {
	const accessToken = cookies.find((c) => c.name === env.COOKIE_ACCESS_TOKEN);
	// const refreshToken = cookies.find((c) => c.name === COOKIE_REFRESH_TOKEN);

	const apiClientAuthed = axios.create({
		baseURL: env.API_URL,
		timeout: 30000,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	apiClientAuthed.interceptors.request.use(
		(config) => {
			config.headers.Authorization = `Bearer ${accessToken?.value}`;
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// apiClientAuthed.interceptors.response.use(
	// 	(response) => {
	// 		return response;
	// 	},
	// 	async (error) => {
	// 		const originalConfig = error.config;

	// 		if (error.response && error.response.status === 401 && !originalConfig._retry) {
	// 			originalConfig._retry = true;

	// 			try {
	// 				const refreshRes = await apiClientUnauthed.post('/auth/refresh-token', {
	// 					token: refreshToken
	// 				});
	// 				apiClientAuthed.defaults.headers.common['Authorization'] = refreshRes.data.accessToken;
	// 			} catch (error2) {
	// 				return Promise.reject(error2);
	// 			}
	// 		}

	// 		return Promise.reject(error);
	// 	}
	// );

	attachErrorSanitizer(apiClientAuthed);

	return apiClientAuthed;
};

export default apiClient;
