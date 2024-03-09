export interface IUser {
	uuid: string;
	name: string;
	email: string;
}

export interface ITag {
	name: string;
	uuid: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	createdByUuid: string;
}

export interface ICategory {
	name: string;
	uuid: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	createdByUuid: string;
}

interface IRecipeNutrient {
	calories: string;
	carbohydrateContent: string;
	cholesterolContent: string;
	fatContent: string;
	fiberContent: string;
	proteinContent: string;
	saturatedFatContent: string;
	sodiumContent: string;
	sugarContent: string;
	unsaturatedFatContent: string;
}

interface IRecipeIngredientGroup {
	ingredients: string[];
	purpose: string;
}

interface IRecipeData {
	author: string;
	canonical_url: string;
	category: string;
	cook_time: string;
	cuisine: string;
	description: string;
	host: string;
	image: string;
	ingredient_groups: IRecipeIngredientGroup[];
	ingredients: string[];
	instructions: string;
	instructions_list: string[];
	language: string;
	nutrients: IRecipeNutrient;
	prep_time: string;
	ratings: string;
	site_name: string;
	title: string;
	total_time: string;
	yields: string;
}

export interface IRecipe {
	uuid: string;
	slug: string;
	createdByUuid: string;
	createdAt: string;
	updatedAt: string;
	categoryUuids: string[];
	tagUuids: string[];
	categories: ICategory[];
	tags: ITag[];
	rating: number;
	data: IRecipeData;
}

interface IKeyVal {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export type TAlert = 'success' | 'warning' | 'error';

export interface IEnhanceRes extends IKeyVal {
	message?: string;
	messageType?: TAlert;
	messageTypeExtra?: IKeyVal;
}

export interface IEnhanceFailRes extends IEnhanceRes {
	inputs: IKeyVal;
	errors: IKeyVal;
}

export interface IPaginated<T> {
	page: number;
	total: number;
	data: T;
}
