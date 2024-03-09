import { API_URL } from '$env/static/private';
import axios, { type AxiosInstance } from 'axios';

const apiClientUnauthed = axios.create({
	baseURL: API_URL,
	timeout: 5000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

export { apiClientUnauthed };

const apiClient = (token: string): AxiosInstance => {
	const apiClientAuthed = axios.create({
		baseURL: API_URL,
		timeout: 5000,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	apiClientAuthed.interceptors.request.use(
		(config) => {
			config.headers.Authorization = `Bearer ${token}`;
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	return apiClientAuthed;
};

export default apiClient;
