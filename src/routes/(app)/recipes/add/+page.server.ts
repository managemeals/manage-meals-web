import apiClient from '$lib/server/api/client';
import type { ICategory, IEnhanceFailRes, IEnhanceRes, ITag } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getErrorMessage } from '$lib/errors';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const categoriesRes = await apiClient(cookies.getAll()).get('/categories');
		const tagsRes = await apiClient(cookies.getAll()).get('/tags');
		return {
			categories: categoriesRes.data as ICategory[],
			tags: tagsRes.data as ITag[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading tags/categories');
	}
};

export const actions = {
	add: async ({ request, cookies }) => {
		const data = await request.formData();
		const url = data.get('url') as string;
		const categories = data.get('categories') as string;
		const tags = data.get('tags') as string;

		const failObj: IEnhanceFailRes = { inputs: { url }, errors: {} };

		if (!url) {
			failObj.errors.url = 'URL is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post(`/recipes/import?url=${url}`, {
				categoryUuids: categories ? categories.split(',') : [],
				tagUuids: tags ? tags.split(',') : []
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/recipes/${slug}`);
	},

	addcategory: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const failObj: IEnhanceFailRes = { inputs: { addCategoryName: name }, errors: {} };

		if (!name) {
			failObj.errors.addCategoryName = 'Name is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/categories', {
				name
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.addCategoryMessageType = 'error';
			failObj.addCategoryMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			addCategorySlug: slug as string
		};

		return successObj;
	},

	addtag: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const failObj: IEnhanceFailRes = { inputs: { addTagName: name }, errors: {} };

		if (!name) {
			failObj.errors.addTagName = 'Name is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/tags', {
				name
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.addTagMessageType = 'error';
			failObj.addTagMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			addTagSlug: slug as string
		};

		return successObj;
	}
};
