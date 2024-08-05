import { env } from '$env/dynamic/private';
import { getErrorMessage } from '$lib/errors';
import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes, IEnhanceRes, IPatchUserReq } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	return {
		user: parentData.user
	};
};

export const actions = {
	settings: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const failObj: IEnhanceFailRes = { inputs: { name, email }, errors: {} };

		if (!name) {
			failObj.errors.name = 'Name is empty';
		}

		if (!email) {
			failObj.errors.email = 'Email is empty';
		}

		if (password && password.length < parseInt(env.PASSWORD_MIN_LENGTH, 10)) {
			failObj.errors.password = 'Password is too short';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		const patchObj: IPatchUserReq = { name, email };

		if (password) {
			patchObj.password = password;
		}

		try {
			await apiClient(cookies.getAll()).patch('/settings/user', patchObj);
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'User settings updated.',
			messageType: 'success'
		};

		return successObj;
	},

	delete: async ({ cookies }) => {
		try {
			await apiClient(cookies.getAll()).delete('/settings/user');
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				deleteUserType: 'error',
				deleteUser: getErrorMessage(e)
			};
			return fail(500, failObj);
		}

		return redirect(303, '/logout');
	}
};
