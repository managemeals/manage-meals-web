import apiClient from '$lib/server/api/client';
import type { IEnhanceFailRes, IEnhanceRes } from '$lib/types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const subject = data.get('subject') as string;
		const message = data.get('message') as string;

		const failObj: IEnhanceFailRes = { inputs: { subject, message }, errors: {} };

		if (!subject) {
			failObj.errors.subject = 'Subject is empty';
		}

		if (!message) {
			failObj.errors.message = 'Message is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).post('/help/contact', {
				subject,
				message
			});
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = 'There was an error sending message, please try again.';
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			message: 'Message sent, we will get back to you soon.',
			messageType: 'success'
		};

		return successObj;
	}
};
