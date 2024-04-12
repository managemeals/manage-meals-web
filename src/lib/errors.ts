import axios, { AxiosError } from 'axios';
import type { IAPIError } from './types';

export const getErrorMessage = (e: unknown) => {
	const defaultError = 'There was an error, please try again.';

	if (!axios.isAxiosError(e)) {
		if (typeof e === 'string') {
			return e;
		} else if (e instanceof Error) {
			return e.message;
		} else {
			return defaultError;
		}
	}

	return (e as AxiosError<IAPIError>)?.response?.data.message || defaultError;
};
