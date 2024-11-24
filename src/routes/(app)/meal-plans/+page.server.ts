import {
	addDays,
	addMonths,
	eachDayOfInterval,
	endOfWeek,
	format,
	getDaysInMonth,
	isSameDay,
	isSameMonth,
	isSameWeek,
	lastDayOfMonth,
	startOfWeek,
	subDays
} from 'date-fns';
import type { PageServerLoad } from './$types';
import { WEEKDAYS, WEEKDAYS_LOWER } from '$lib/constants';
import type {
	ICategory,
	IEnhanceFailRes,
	IEnhanceRes,
	IMealPlan,
	IMealPlanCalendar,
	IMealPlanType,
	IRecipe,
	ITag,
	TDayMealPlanTypes
} from '$lib/types';
import { last } from 'lodash-es';
import apiClient from '$lib/server/api/client';
import { fail, redirect } from '@sveltejs/kit';
import { getErrorMessage } from '$lib/errors';
import axios from 'axios';

export const load: PageServerLoad = async ({ cookies, url, parent }) => {
	const dateQ = url.searchParams.get('date');

	let date = new Date();
	if (dateQ) {
		date = new Date(dateQ);
		if (isNaN(date.getTime())) {
			date = new Date();
		}
	}

	const parentData = await parent();

	const today = new Date();
	const dateIsSameMonth = isSameMonth(date, today);
	const totalDays = WEEKDAYS.length;
	const todayNum = parseInt(format(today, 'd'), 10);
	const firstDayOfMonth = format(date, 'yyyy-MM-01');
	const firstDayOfNextMonth = format(addMonths(firstDayOfMonth, 1), 'yyyy-MM-01');
	const lastDayOfPreviousMonth = subDays(firstDayOfMonth, 1);
	const firstDayOfPreviousMonth = format(lastDayOfPreviousMonth, 'yyyy-MM-01');
	const lastDayOfPreviousMonthNum = parseInt(format(lastDayOfPreviousMonth, 'd'), 10);
	const firstDayOfMonthIndex = WEEKDAYS.findIndex((d) => d === format(firstDayOfMonth, 'EEE'));
	const lastDayOfMonthIndex = WEEKDAYS.findIndex(
		(d) => d === format(format(lastDayOfMonth(date), 'yyyy-MM-dd'), 'EEE')
	);
	const totalDaysInMonth = getDaysInMonth(date);
	const firstDateOfWeek = startOfWeek(date, { weekStartsOn: 1 });
	const lastDateOfWeek = endOfWeek(date, { weekStartsOn: 1 });

	let mealPlans: IMealPlanCalendar[] = [];

	// Set previous month days
	for (let i = 0, n = firstDayOfMonthIndex - 1; i < firstDayOfMonthIndex; i++, n--) {
		mealPlans.push({
			calendarDate: {
				dateNum: lastDayOfPreviousMonthNum - n,
				day: WEEKDAYS[i],
				activeMonth: false,
				fullDate: subDays(lastDayOfPreviousMonth, n)
			},
			uuid: '',
			createdAt: '',
			updatedAt: '',
			createdByUuid: '',
			date: '',
			mealTypes: []
		});
	}

	// Set current month days
	let currDayIndex = firstDayOfMonthIndex;
	for (let i = 0; i < totalDaysInMonth; i++) {
		if (currDayIndex >= totalDays) {
			currDayIndex = 0;
		}
		const currDate = i + 1;
		mealPlans.push({
			calendarDate: {
				dateNum: currDate,
				day: WEEKDAYS[currDayIndex],
				activeMonth: true,
				isToday: dateIsSameMonth && todayNum === currDate,
				fullDate: addDays(firstDayOfMonth, i)
			},
			uuid: '',
			createdAt: '',
			updatedAt: '',
			createdByUuid: '',
			date: '',
			mealTypes: []
		});
		currDayIndex++;
	}

	// Set next month days
	const totalDaysLeft = totalDays - 1 - lastDayOfMonthIndex;
	for (let i = 0, n = totalDaysLeft; i < totalDaysLeft; i++, n--) {
		mealPlans.push({
			calendarDate: {
				dateNum: i + 1,
				day: WEEKDAYS[totalDays - n],
				activeMonth: false,
				fullDate: addDays(firstDayOfNextMonth, i)
			},
			uuid: '',
			createdAt: '',
			updatedAt: '',
			createdByUuid: '',
			date: '',
			mealTypes: []
		});
	}

	// Load recipes from dates, merge with mealPlans
	const fromDate = mealPlans[0].calendarDate.fullDate;
	const toDate = last(mealPlans)?.calendarDate.fullDate;
	try {
		const res = await apiClient(cookies.getAll()).get(
			`/meal-plans?dates=${fromDate.toISOString()}&dates=${toDate?.toISOString()}`
		);
		const resData = res.data as IMealPlan[];
		mealPlans = mealPlans.map((mealPlan) => {
			for (const resMealPlan of resData) {
				if (isSameDay(mealPlan.calendarDate.fullDate, new Date(resMealPlan.date))) {
					return {
						...mealPlan,
						...resMealPlan
					};
				}
			}
			return {
				...mealPlan
			};
		});
	} catch (e) {
		console.log(e);
		if (!axios.isAxiosError(e) || e.response?.data.message === 'Invalid Authorization header') {
			throw new Error('Error loading meal plans');
		}
	}

	// Meal plan at selected date
	const dateMealPlan = mealPlans.find((mp) => isSameDay(mp.calendarDate.fullDate, date));
	const dateMealPlanRecipes = (dateMealPlan?.mealTypes || []).reduce((prev, curr) => {
		if (curr.recipe) {
			return [...prev, curr.recipe];
		} else {
			return prev;
		}
	}, [] as IRecipe[]);

	// Meal plan at selected week
	const weekMealPlans = mealPlans.filter((mp) =>
		isSameWeek(mp.calendarDate.fullDate, date, { weekStartsOn: 1 })
	);
	const weekMealPlansRecipes = weekMealPlans
		.reduce((prev, curr) => {
			return [...prev, ...curr.mealTypes];
		}, [] as IMealPlanType[])
		.reduce((prev, curr) => {
			if (curr.recipe) {
				return [...prev, curr.recipe];
			} else {
				return prev;
			}
		}, [] as IRecipe[]);

	// Load categories and tags
	let categories: ICategory[] = [];
	let tags: ITag[] = [];
	try {
		const categoriesRes = await apiClient(cookies.getAll()).get('/categories');
		const tagsRes = await apiClient(cookies.getAll()).get('/tags');
		categories = categoriesRes.data as ICategory[];
		tags = tagsRes.data as ITag[];
	} catch (e) {
		console.log(e);
		throw new Error('Error loading tags/categories');
	}

	return {
		user: parentData.user,
		date,
		days: WEEKDAYS,
		firstDayOfPreviousMonth,
		firstDayOfNextMonth,
		mealPlans,
		dateMealPlan,
		dateMealPlanRecipes,
		weekMealPlansRecipes,
		today,
		firstDateOfWeek,
		lastDateOfWeek,
		categories,
		tags
	};
};

export const actions = {
	refreshday: async ({ request, cookies }) => {
		const data = await request.formData();
		const uuid = data.get('uuid') as string;
		const date = data.get('date') as string;
		const mealType = data.get('mealType') as string;
		const categoryUuids = data.get('categoryUuids') as string;
		const tagUuids = data.get('tagUuids') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!uuid || !date || !mealType) {
			failObj.refreshDayMessageType = 'error';
			failObj.refreshDayMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).patch(`/meal-plans/${uuid}`, {
				date,
				mealTypes: [
					{
						mealType,
						categoryUuids: categoryUuids.split(',').filter(Boolean),
						tagUuids: tagUuids.split(',').filter(Boolean)
					}
				]
			});
		} catch (e) {
			console.log(e);
			failObj.refreshDayMessageType = 'error';
			failObj.refreshDayMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			refreshDayUuid: uuid
		};

		return successObj;
	},

	shoppinglistday: async ({ request, cookies }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const recipeUuids = data.get('recipeUuids') as string;
		const ingredients = data.get('ingredients') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!title) {
			failObj.shoppingListDayMessageType = 'error';
			failObj.shoppingListDayMessage = 'Missing inputs';
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
			failObj.shoppingListDayMessageType = 'error';
			failObj.shoppingListDayMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/shopping-lists/${slug}`);
	},

	shoppinglistweek: async ({ request, cookies }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const recipeUuids = data.get('recipeUuids') as string;
		const ingredients = data.get('ingredients') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!title) {
			failObj.shoppingListDayMessageType = 'error';
			failObj.shoppingListDayMessage = 'Missing inputs';
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
			failObj.shoppingListWeekMessageType = 'error';
			failObj.shoppingListWeekMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		return redirect(303, `/shopping-lists/${slug}`);
	},

	selectday: async ({ request, cookies }) => {
		const data = await request.formData();
		const uuid = data.get('uuid') as string;
		const recipeUuid = data.get('recipeUuid') as string;
		const date = data.get('date') as string;
		const mealType = data.get('mealType') as string;
		const categoryUuids = data.get('categoryUuids') as string;
		const tagUuids = data.get('tagUuids') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!uuid || !recipeUuid || !date || !mealType) {
			failObj.selectDayMessageType = 'error';
			failObj.selectDayMessage = 'Missing inputs';
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).patch(`/meal-plans/${uuid}`, {
				date,
				mealTypes: [
					{
						mealType,
						categoryUuids: categoryUuids.split(',').filter(Boolean),
						tagUuids: tagUuids.split(',').filter(Boolean),
						recipeUuid
					}
				]
			});
		} catch (e) {
			console.log(e);
			failObj.selectDayMessageType = 'error';
			failObj.selectDayMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			selectDayUuid: uuid
		};

		return successObj;
	},

	planday: async ({ request, cookies }) => {
		const data = await request.formData();
		const obj = Object.fromEntries(data);

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!obj['date']) {
			failObj.planDayMessageType = 'error';
			failObj.planDayMessage = 'Date is empty';
			return fail(400, failObj);
		}

		const mealTypes: IMealPlanType[] = [];
		let i = 0;
		const maxI = 1000;
		for (;;) {
			if (obj[`mealType${i}`] === undefined || i > maxI) {
				break;
			}
			const mealType = obj[`mealType${i}`] as string;
			const categoryUuids = ((obj[`categoryUuids${i}`] as string) || '').split(',').filter(Boolean);
			const tagUuids = ((obj[`tagUuids${i}`] as string) || '').split(',').filter(Boolean);

			mealTypes.push({
				mealType,
				categoryUuids,
				tagUuids
			});

			if (!mealType) {
				failObj.errors[`planDayMealType${i}`] = 'Meal type is empty';
			}
			i++;
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		let uuid = '';
		try {
			const res = await apiClient(cookies.getAll()).post('/meal-plans', {
				date: obj['date'],
				mealTypes
			});
			uuid = res.data.uuid;
		} catch (e) {
			console.log(e);
			failObj.planDayMessageType = 'error';
			failObj.planDayMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			planDayUuid: uuid
		};

		return successObj;
	},

	planweek: async ({ request, cookies }) => {
		const data = await request.formData();
		const obj = Object.fromEntries(data);

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!obj['dateFrom'] || !obj['dateTo']) {
			failObj.planWeekMessageType = 'error';
			failObj.planWeekMessage = 'Date is empty';
			return fail(400, failObj);
		}

		const mealTypes: TDayMealPlanTypes = {
			mon: [],
			tue: [],
			wed: [],
			thu: [],
			fri: [],
			sat: [],
			sun: []
		};
		for (const dayKey of WEEKDAYS_LOWER) {
			let i = 0;
			const maxI = 1000;
			for (;;) {
				if (obj[`mealType${dayKey}${i}`] === undefined || i > maxI) {
					break;
				}
				const mealType = obj[`mealType${dayKey}${i}`] as string;
				const categoryUuids = ((obj[`categoryUuids${dayKey}${i}`] as string) || '')
					.split(',')
					.filter(Boolean);
				const tagUuids = ((obj[`tagUuids${dayKey}${i}`] as string) || '')
					.split(',')
					.filter(Boolean);

				mealTypes[dayKey].push({
					mealType,
					categoryUuids,
					tagUuids
				});

				if (!mealType) {
					failObj.errors[`planWeekMealType${dayKey}${i}`] = 'Meal type is empty';
				}
				i++;
			}
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		const dates = eachDayOfInterval({
			start: new Date(obj['dateFrom'] as string),
			end: new Date(obj['dateTo'] as string)
		});

		const promises = dates.map((d, i) => {
			return apiClient(cookies.getAll()).post('/meal-plans', {
				date: d.toISOString(),
				mealTypes: mealTypes[WEEKDAYS_LOWER[i]]
			});
		});

		let uuids: string[] = [];
		try {
			const res = await Promise.all(promises);
			uuids = res.map((r) => r.data.uuid);
		} catch (e) {
			console.log(e);
			failObj.planWeekMessageType = 'error';
			failObj.planWeekMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			planWeekUuids: uuids
		};

		return successObj;
	},

	deleteday: async ({ request, cookies }) => {
		const data = await request.formData();
		const uuid = data.get('uuid') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {},
			errors: {}
		};

		if (!uuid) {
			failObj.deleteDayMessageType = 'error';
			failObj.deleteDayMessage = 'Missing UUID';
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).delete(`/meal-plans/${uuid}`, {
				headers: {
					'Content-Type': null
				}
			});
		} catch (e) {
			console.log(e);
			failObj.deleteDayMessageType = 'error';
			failObj.deleteDayMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			deleteDayUuid: uuid
		};

		return successObj;
	}
};
