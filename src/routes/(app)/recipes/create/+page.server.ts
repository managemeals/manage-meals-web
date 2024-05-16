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
	create: async ({ request, cookies }) => {
		const data = await request.formData();
		const dataTitle = data.get('data.title') as string;
		const categories = data.get('categories') as string;
		const tags = data.get('tags') as string;
		const dataDescription = data.get('data.description') as string;
		const dataCanonicalUrl = data.get('data.canonical_url') as string;
		const dataCookTime = data.get('data.cook_time') as string;
		const dataPrepTime = data.get('data.prep_time') as string;
		const dataTotalTime = data.get('data.total_time') as string;
		const dataYields = data.get('data.yields') as string;
		const dataIngredients = data.get('data.ingredients') as string;
		const dataInstructions = data.get('data.instructions_list') as string;
		const dataNutrientsCalories = data.get('data.nutrients.calories') as string;
		const dataNutrientsCarbohydrate = data.get('data.nutrients.carbohydrateContent') as string;
		const dataNutrientsCholesterol = data.get('data.nutrients.cholesterolContent') as string;
		const dataNutrientsFat = data.get('data.nutrients.fatContent') as string;
		const dataNutrientsFiber = data.get('data.nutrients.fiberContent') as string;
		const dataNutrientsProtein = data.get('data.nutrients.proteinContent') as string;
		const dataNutrientsSaturatedFat = data.get('data.nutrients.saturatedFatContent') as string;
		const dataNutrientsSodium = data.get('data.nutrients.sodiumContent') as string;
		const dataNutrientsSugar = data.get('data.nutrients.sugarContent') as string;
		const dataNutrientsUnsaturatedFat = data.get('data.nutrients.unsaturatedFatContent') as string;

		const failObj: IEnhanceFailRes = { inputs: { data: { title: dataTitle } }, errors: {} };

		if (!dataTitle) {
			failObj.errors.data = {
				title: 'Title is empty'
			};
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let slug = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/recipes', {
				categoryUuids: categories ? categories.split(',') : [],
				tagUuids: tags ? tags.split(',') : [],
				rating: 0,
				data: {
					title: dataTitle,
					description: dataDescription,
					canonical_url: dataCanonicalUrl,
					cook_time: dataCookTime,
					prep_time: dataPrepTime,
					total_time: dataTotalTime,
					yields: dataYields,
					ingredients: dataIngredients
						.replaceAll('\r', '\n')
						.split('\n\n')
						.filter((d) => d)
						.map((d) => d.trim()),
					instructions_list: dataInstructions
						.replaceAll('\r', '\n')
						.split('\n\n')
						.filter((d) => d)
						.map((d) => d.trim()),
					nutrients: {
						calories: dataNutrientsCalories,
						carbohydrateContent: dataNutrientsCarbohydrate,
						cholesterolContent: dataNutrientsCholesterol,
						fatContent: dataNutrientsFat,
						fiberContent: dataNutrientsFiber,
						proteinContent: dataNutrientsProtein,
						saturatedFatContent: dataNutrientsSaturatedFat,
						sodiumContent: dataNutrientsSodium,
						sugarContent: dataNutrientsSugar,
						unsaturatedFatContent: dataNutrientsUnsaturatedFat
					}
				}
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

	createcategory: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const failObj: IEnhanceFailRes = { inputs: { createCategoryName: name }, errors: {} };

		if (!name) {
			failObj.errors.createCategoryName = 'Name is empty';
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
			failObj.createCategoryMessageType = 'error';
			failObj.createCategoryMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			createCategorySlug: slug as string
		};

		return successObj;
	},

	createtag: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const failObj: IEnhanceFailRes = { inputs: { createTagName: name }, errors: {} };

		if (!name) {
			failObj.errors.createTagName = 'Name is empty';
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
			failObj.createTagMessageType = 'error';
			failObj.createTagMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			createTagSlug: slug as string
		};

		return successObj;
	}
};
