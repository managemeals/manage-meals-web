export type TSubscriptionType = 'FREE' | 'PREMIUM';

export interface IUser {
	uuid: string;
	name: string;
	email: string;
	subscriptionType: TSubscriptionType;
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
}

export interface IEnhanceFailRes extends IEnhanceRes {
	inputs: IKeyVal;
	errors: IKeyVal;
}

export interface IPaginated<T> {
	page: number;
	total: number;
	perPage: number;
	data: T;
}

export interface ILink {
	href: string;
	title: string;
}

export interface IIconHelpLink extends ILink {
	icon: string;
	help: string;
}

export interface IIconLink extends ILink {
	icon: string;
}

export interface ISidebarLink extends IIconLink {
	isCustom?: boolean;
}

interface ISearchFacetCountsCount {
	count: number;
	highlighted: string;
	value: string;
}

interface ISearchFacetCountsStats {
	total_values: number;
}

interface ISearchFacetCounts {
	counts: ISearchFacetCountsCount[];
	field_name: string;
	sampled: boolean;
	stats: ISearchFacetCountsStats;
}

export interface ISearchRecipe {
	categories: string[];
	createdByUuid: string;
	description: string;
	id: string;
	imageUrl: string;
	ingredients: string[];
	rating: number;
	slug: string;
	tags: string[];
	title: string;
}

interface ISearchHitsTextMatchInfo {
	best_field_score: string;
	best_field_weight: number;
	fields_matched: number;
	score: string;
	tokens_matched: number;
}

interface ISearchHitsHighlightField {
	matched_tokens: string[];
	snippet: string;
}

interface ISearchHitsHighlight {
	[key: string]: ISearchHitsHighlightField;
}

interface ISearchHitsHighlights {
	field: string;
	matched_tokens: string[];
	snippet: string;
}

export interface ISearchHits<T> {
	document: T;
	highlight: ISearchHitsHighlight;
	highlights: ISearchHitsHighlights[];
	text_match: number;
	text_match_info: ISearchHitsTextMatchInfo;
}

interface ISearchRequestParams {
	collection_name: string;
	per_page: number;
	q: string;
}

export interface ISearch<T> {
	facet_counts: ISearchFacetCounts[];
	found: number;
	hits: ISearchHits<T>[];
	out_of: number;
	page: number;
	request_params: ISearchRequestParams;
	search_cutoff: boolean;
	search_time_ms: number;
}

export interface ICookie {
	name: string;
	value: string;
}

export interface IAPIError {
	statusCode: number;
	error: string;
	message: string;
}

export interface ISubscriptionUpcomingPayment {
	chargeDate: string;
	amount: number;
}

export interface IPatchUserReq {
	name: string;
	email: string;
	password?: string;
}

export interface ITabItem {
	title: string;
}

export type TShortDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type TShortDayLower = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ICalendarDay {
	dateNum: number;
	day: TShortDay;
	activeMonth: boolean;
	isToday?: boolean;
	fullDate: Date;
}

export interface IMealPlanType {
	mealType: string;
	categoryUuids: string[];
	tagUuids: string[];
	categories?: ICategory[];
	tags?: ITag[];
	recipe?: IRecipe;
	recipeUuid?: string;
}

export interface IMealPlan {
	uuid: string;
	createdAt: string;
	updatedAt: string;
	createdByUuid: string;
	date: string;
	mealTypes: IMealPlanType[];
}

export interface IMealPlanCalendar extends IMealPlan {
	calendarDate: ICalendarDay;
}

export type TDayMealPlanTypes = Record<TShortDayLower, IMealPlanType[]>;

export interface IShoppingList {
	uuid: string;
	createdAt: string;
	updatedAt: string;
	createdByUuid: string;
	slug: string;
	title: string;
	ingredients?: string[];
	recipeUuids?: string[];
	recipes?: IRecipe[];
}
