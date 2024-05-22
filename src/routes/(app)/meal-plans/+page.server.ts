import {
	addDays,
	addMonths,
	endOfWeek,
	format,
	getDaysInMonth,
	isSameDay,
	isSameMonth,
	lastDayOfMonth,
	startOfWeek,
	subDays
} from 'date-fns';
import type { PageServerLoad } from './$types';
import { WEEKDAYS } from '$lib/constants';
import type { IEnhanceFailRes, IEnhanceRes, IMealPlan, IMealPlanCalendar } from '$lib/types';
import { last } from 'lodash-es';
import apiClient from '$lib/server/api/client';
import { fail } from '@sveltejs/kit';
import { getErrorMessage } from '$lib/errors';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const dateQ = url.searchParams.get('date');

	let date = new Date();
	if (dateQ) {
		date = new Date(dateQ);
		if (isNaN(date.getTime())) {
			date = new Date();
		}
	}

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
		throw new Error('Error loading meal plans');
	}

	// Meal plan at selected date
	const dateMealPlan = mealPlans.find((mp) => isSameDay(mp.calendarDate.fullDate, date));

	return {
		date,
		days: WEEKDAYS,
		firstDayOfPreviousMonth,
		firstDayOfNextMonth,
		mealPlans,
		dateMealPlan,
		today,
		firstDateOfWeek,
		lastDateOfWeek
	};
};

export const actions = {
	refresh: async ({ request, cookies }) => {
		const data = await request.formData();
		const uuid = data.get('uuid') as string;
		const date = data.get('date') as string;
		const mealType = data.get('mealType') as string;
		const categoryUuids = data.get('categoryUuids') as string;
		const tagUuids = data.get('tagUuids') as string;

		const failObj: IEnhanceFailRes = {
			inputs: {
				refreshUuid: uuid,
				refreshDate: date,
				refreshMealType: mealType,
				refreshCategoryUuids: categoryUuids,
				refreshTagUuids: tagUuids
			},
			errors: {}
		};

		if (!uuid) {
			failObj.errors.refresUuid = 'UUID is empty';
		}

		if (!date) {
			failObj.errors.refreshName = 'Date is empty';
		}

		if (!mealType) {
			failObj.errors.refreshMealType = 'Meal type is empty';
		}

		if (!categoryUuids) {
			failObj.errors.refreshCategoryUuids = 'Categories is empty';
		}

		if (!tagUuids) {
			failObj.errors.refreshTagUuids = 'Tags is empty';
		}

		if (Object.keys(failObj.errors).length) {
			return fail(400, failObj);
		}

		try {
			await apiClient(cookies.getAll()).patch(`/meal-plans/${uuid}`, {
				date,
				mealTypes: [
					{
						mealType,
						categoryUuids: categoryUuids.split(','),
						tagUuids: tagUuids.split(',')
					}
				]
			});
		} catch (e) {
			console.log(e);
			failObj.refreshMessageType = 'error';
			failObj.refreshMessage = getErrorMessage(e);
			return fail(500, failObj);
		}

		const successObj: IEnhanceRes = {
			refreshUuid: uuid
		};

		return successObj;
	}
};
