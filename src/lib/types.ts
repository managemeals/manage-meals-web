export interface User {
	uuid: string;
	createdAt: Date;
	name: string;
	email: string;
	emailVerified: boolean;
	password: string;
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
