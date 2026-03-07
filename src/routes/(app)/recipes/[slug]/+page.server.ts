import apiClient from '$lib/server/api/client';
import type { ICookbook, IEnhanceFailRes, IEnhanceRes, IRecipe } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getErrorMessage } from '$lib/errors';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const { slug } = params;

	try {
		const [recipeRes, cookbooksRes] = await Promise.all([
			apiClient(cookies.getAll()).get(`/recipes/${slug}`),
			apiClient(cookies.getAll()).get('/cookbooks')
		]);
		return {
			recipe: recipeRes.data as IRecipe,
			cookbooks: cookbooksRes.data as ICookbook[]
		};
	} catch (e) {
		console.log(e);
		throw error(404, 'Recipe not found');
	}
};

export const actions = {
	favorite: async ({ request, cookies }) => {
		const data = await request.formData();
		const slug = data.get('slug') as string;

		try {
			await apiClient(cookies.getAll()).post(`/recipes/${slug}/favorite`, {});
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceFailRes = { inputs: {}, errors: {} };
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		return {};
	},

	unfavorite: async ({ request, cookies }) => {
		const data = await request.formData();
		const slug = data.get('slug') as string;

		try {
			await apiClient(cookies.getAll()).delete(`/recipes/${slug}/favorite`, {
				headers: { 'Content-Type': null }
			});
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceFailRes = { inputs: {}, errors: {} };
			failObj.messageType = 'error';
			failObj.message = getErrorMessage(e);
			return fail(500, failObj);
		}

		return {};
	},

	shoppinglist: async ({ request, cookies }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const recipeUuids = data.get('recipeUuids') as string;
		const ingredients = data.get('ingredients') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!title) {
			failObj.shoppingListMessageType = 'error';
			failObj.shoppingListMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/shopping-lists', {
				title,
				ingredients: ingredients.split('|||').filter(Boolean),
				recipeUuids: recipeUuids.split(',').filter(Boolean)
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.shoppingListMessageType = 'error';
			failObj.shoppingListMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/shopping-lists/${slug}`);
	},

	share: async ({ request, cookies }) => {
		const data = await request.formData();
		const recipeUuid = data.get('recipeUuid') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!recipeUuid) {
			failObj.shareMessageType = 'error';
			failObj.shareMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/share/recipes', {
				recipeUuid
			});
			slug = res.data.slug;
		} catch (e) {
			console.log(e);
			failObj.shareMessageType = 'error';
			failObj.shareMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			shareSlug: slug as string
		};

		return successObj;
	},

	deleteshare: async ({ request, cookies }) => {
		const data = await request.formData();
		const slug = data.get('slug') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!slug) {
			failObj.shareMessageType = 'error';
			failObj.shareMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).delete(`/share/recipes/${slug}`, {
				headers: {
					'Content-Type': null
				}
			});
		} catch (e) {
			console.log(e);
			failObj.shareMessageType = 'error';
			failObj.shareMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			shareDeleteSlug: slug
		};

		return successObj;
	},

	addtocookbook: async ({ request, cookies }) => {
		const data = await request.formData();
		const cookbookSlug = data.get('cookbookSlug') as string;
		const recipeUuid = data.get('recipeUuid') as string;

		const failObj: IEnhanceFailRes = { inputs: {}, errors: {} };

		if (!cookbookSlug || !recipeUuid) {
			failObj.cookbookMessageType = 'error';
			failObj.cookbookMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		try {
			const cookbookRes = await apiClient(cookies.getAll()).get(`/cookbooks/${cookbookSlug}`);
			const cookbook: ICookbook = cookbookRes.data;
			const recipeUuids = [...(cookbook.recipeUuids || [])];
			if (!recipeUuids.includes(recipeUuid)) {
				recipeUuids.push(recipeUuid);
				await apiClient(cookies.getAll()).patch(`/cookbooks/${cookbookSlug}`, { recipeUuids });
			}
		} catch (e) {
			console.log(e);
			failObj.cookbookMessageType = 'error';
			failObj.cookbookMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			cookbookMessage: 'Recipe added to cookbook.',
			cookbookMessageType: 'success',
			addedToCookbookSlug: cookbookSlug
		};

		return successObj;
	}
};
