import apiClient from '$lib/server/api/client';
import type { IPaginated, IRecipe, ITag } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url, parent }) => {
	let page = url.searchParams.get('page') || '1';
	if (isNaN(parseInt(page, 10))) {
		page = '1';
	}

	try {
		const tagsRes = await apiClient(cookies.getAll()).get('/tags');
		const tagsResData = tagsRes.data as ITag[];

		const parentRes = await parent();

		let selectedCategories = ['Categories'];
		const categoriesQ = url.searchParams.get('categories');
		let categoriesFilter: string[] = [];
		if (categoriesQ) {
			categoriesFilter = categoriesQ.split(',').map((c) => {
				const category = parentRes.categories.find((pc) => pc.slug === c);
				return `categories=${category?.uuid}`;
			});
			selectedCategories = categoriesQ.split(',').map((c) => {
				const category = parentRes.categories.find((pc) => pc.slug === c);
				return category?.name || '';
			});
		}

		let selectedTags = ['Tags'];
		const tagsQ = url.searchParams.get('tags');
		let tagsFilter: string[] = [];
		if (tagsQ) {
			tagsFilter = tagsQ.split(',').map((t) => {
				const tag = tagsResData.find((td) => td.slug === t);
				return `tags=${tag?.uuid}`;
			});
			selectedTags = tagsQ.split(',').map((t) => {
				const tag = tagsResData.find((td) => td.slug === t);
				return tag?.name || '';
			});
		}

		const sort = url.searchParams.get('sort') || '';
		const minCalories = url.searchParams.get('minCalories') || '';
		const maxCalories = url.searchParams.get('maxCalories') || '';
		const minProtein = url.searchParams.get('minProtein') || '';
		const maxProtein = url.searchParams.get('maxProtein') || '';

		const nutritionFilter = [
			minCalories ? `minCalories=${minCalories}` : '',
			maxCalories ? `maxCalories=${maxCalories}` : '',
			minProtein ? `minProtein=${minProtein}` : '',
			maxProtein ? `maxProtein=${maxProtein}` : ''
		]
			.filter(Boolean)
			.join('&');

		const recipesRes = await apiClient(cookies.getAll()).get(
			`/recipes?page=${page}${categoriesFilter.length ? `&${categoriesFilter.join('&')}` : ''}${tagsFilter.length ? `&${tagsFilter.join('&')}` : ''}${sort ? `&sort=${sort}` : ''}${nutritionFilter ? `&${nutritionFilter}` : ''}`
		);

		return {
			recipes: recipesRes.data as IPaginated<IRecipe[]>,
			tags: tagsResData,
			selectedCategories,
			selectedTags,
			selectedCategoriesSlugs: (categoriesQ || '').split(','),
			selectedTagsSlugs: (tagsQ || '').split(','),
			selectedSort: sort,
			minCalories,
			maxCalories,
			minProtein,
			maxProtein
		};
	} catch (e) {
		console.log(e);
		throw new Error('Error loading recipes');
	}
};
