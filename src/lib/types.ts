export interface User {
	uuid: string;
	createdAt: Date;
	name: string;
	email: string;
	emailVerified: boolean;
	password: string;
}

export interface SessionUser {
	uuid: string;
	name: string;
	email: string;
}

export interface Tag {
	uuid: string;
	slug: string;
	name: string;
}

export interface Category {
	uuid: string;
	slug: string;
	name: string;
}

interface Nutrient {
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

interface IngredientGroup {
	ingredients: string[];
	purpose: string;
}

export interface Recipe {
	uuid: string;
	createdAt: Date;
	createdByUuid: string;
	categoryUuids: string[];
	tagUuids: string[];
	author: string;
	canonical_url: string;
	cookTime?: number;
	cuisine?: string;
	description: string;
	host: string;
	image: string;
	ingredientGroups: IngredientGroup[];
	ingredients: string[];
	instructions: string;
	instructionsList: string[];
	language: string;
	prepTime: number;
	ratings: number;
	site_name: string;
	title: string;
	totalTime: number;
	yields: string;
	nutrients: Nutrient;
}

export interface JwtEmailPayload {
	email: string;
}

interface KeyVal {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export type AlertType = 'success' | 'warning' | 'error';

export interface FailRes extends KeyVal {}

interface ApiInputErrorRes {
	message: string;
}

interface ApiKVInputErrorRes {
	[key: string]: ApiInputErrorRes;
}

export interface ApiErrorRes {
	inputs: ApiKVInputErrorRes;
}

export interface ApiRes {
	message?: string;
	messageType?: AlertType;
	messageTypeExtra?: KeyVal;
	errors?: ApiErrorRes;
	data?: KeyVal;
}
