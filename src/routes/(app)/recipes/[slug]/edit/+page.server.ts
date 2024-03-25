import apiClient from '$lib/server/api/client';
import type { ICategory, IEnhanceFailRes, IEnhanceRes, IRecipe, ITag } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const { slug } = params;

	try {
		const recipeRes = await apiClient(cookies.getAll()).get(`/recipes/${slug}`);
		const categoriesRes = await apiClient(cookies.getAll()).get('/categories');
		const tagsRes = await apiClient(cookies.getAll()).get('/tags');
		return {
			recipe: recipeRes.data as IRecipe,
			categories: categoriesRes.data as ICategory[],
			tags: tagsRes.data as ITag[]
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipe');
	}
};

export const actions = {
	edit: async ({ request, cookies, params }) => {
		const { slug } = params;

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

		try {
			const recipeRes = await apiClient(cookies.getAll()).get(`/recipes/${slug}`);
			await apiClient(cookies.getAll()).put(`/recipes/${slug}`, {
				categoryUuids: categories ? categories.split(',') : [],
				tagUuids: tags ? tags.split(',') : [],
				rating: 0,
				data: {
					...recipeRes.data.data,
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
						...recipeRes.data.data.nutrients,
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
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceFailRes = { inputs: {}, errors: {} };
			failObj.messageType = 'error';
			failObj.message = 'There was an error saving recipe, please try again.';
			return fail(500, failObj);
		}

		return redirect(303, `/recipes/${slug}`);
	},
	delete: async ({ cookies, params }) => {
		const { slug } = params;

		try {
			await apiClient(cookies.getAll()).delete(`/recipes/${slug}`);
		} catch (e) {
			console.log(e);
			const failObj: IEnhanceRes = {
				deleteMessageType: 'error',
				deleteMessage: 'There was an error deleting recipe, please try again.'
			};
			return fail(500, failObj);
		}

		return redirect(303, '/categories');
	}
};