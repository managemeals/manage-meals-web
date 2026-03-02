<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { format, isSameDay } from 'date-fns';
	import Icon from '@iconify/svelte';
	import type { ActionData, PageData } from './$types';
	import RecipeCategoryTag from '$lib/components/RecipeCategoryTag.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type {
		IMealPlan,
		IMealPlanType,
		ISearch,
		ISearchRecipe,
		TAlert,
		TDayMealPlanTypes,
		TShortDayLower
	} from '$lib/types';
	import { WEEKDAYS_LOWER } from '$lib/constants';
	import { debounce } from 'lodash-es';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form = $bindable() }: Props = $props();

	// Modal visibility
	let showSelectDayModal = $state(false);
	let showPlanDayModal = $state(false);
	let showPlanWeekModal = $state(false);
	let showDeleteDayModal = $state(false);
	let showShoppingListDayModal = $state(false);
	let showShoppingListWeekModal = $state(false);
	let showFormMessageModal = $state(false);

	// Submitting states
	let refreshDaySubmitting = $state(false);
	let planDaySubmitting = $state(false);
	let planWeekSubmitting = $state(false);
	let selectDaySubmitting = $state(false);
	let isLoadingPlanLatestMealTypes = $state(false);
	let isSearching = $state(false);

	// Form message (for refresh errors)
	let formMessageType: TAlert = $state('error');
	let formMessage = $state('');

	// Plan day state
	let planDayMealTypes: IMealPlanType[] = $state([]);

	$effect(() => {
		if (form?.planDayUuid) {
			showPlanDayModal = false;
		}
	});

	// Reset plan day state when modal closes
	$effect(() => {
		if (!showPlanDayModal) {
			planDayMealTypes = [];
		}
	});

	// Plan week state
	let planWeekSelectedDay: TShortDayLower = $state('mon');
	let planWeekMealTypes: TDayMealPlanTypes = $state({
		mon: [],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
		sun: []
	});

	$effect(() => {
		if (form?.planWeekUuids) {
			showPlanWeekModal = false;
		}
	});

	// Reset plan week state when modal closes
	$effect(() => {
		if (!showPlanWeekModal) {
			planWeekMealTypes = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
			planWeekSelectedDay = 'mon';
		}
	});

	const handleCopyDay = () => {
		for (const dayKey of WEEKDAYS_LOWER) {
			if (dayKey === planWeekSelectedDay) continue;
			planWeekMealTypes[dayKey] = planWeekMealTypes[planWeekSelectedDay].map((mt) => ({ ...mt }));
		}
	};

	// Load last plan as template (manual trigger)
	const handlePlanLatestMealTypes = async () => {
		isLoadingPlanLatestMealTypes = true;
		try {
			const res = await fetch('/api/meal-plans/latest');
			const obj = (await res.json()) as IMealPlan;
			const mapped = (obj.mealTypes || []).map((mt) => ({
				mealType: mt.mealType,
				categoryUuids: mt.categoryUuids || [],
				tagUuids: mt.tagUuids || []
			}));
			planDayMealTypes = mapped;
			planWeekMealTypes = {
				mon: mapped.map((mt) => ({ ...mt })),
				tue: [],
				wed: [],
				thu: [],
				fri: [],
				sat: [],
				sun: []
			};
		} catch (e) {
			// leave state as-is if fetch fails
		} finally {
			isLoadingPlanLatestMealTypes = false;
		}
	};

	// Refresh day errors
	$effect(() => {
		if (form?.refreshDayMessage) {
			formMessage = form.refreshDayMessage as string;
			formMessageType = form.refreshDayMessageType as TAlert;
			showFormMessageModal = true;
			form.refreshDayMessage = '';
		}
	});

	// Delete day
	$effect(() => {
		if (form?.deleteDayUuid) {
			showDeleteDayModal = false;
		}
	});

	// Select day / recipe search
	let searchInput = $state('');
	let searchResults: ISearch<ISearchRecipe> | undefined = $state();
	let selectDayMealType = $state('');
	let selectDayCategoryUuids: string[] = $state([]);
	let selectDayTagUuids: string[] = $state([]);

	const doSearch = debounce(async () => {
		isSearching = true;
		try {
			const res = await fetch(`/api/search?q=${searchInput}`);
			searchResults = await res.json();
		} catch (e) {
			searchResults = undefined;
		} finally {
			isSearching = false;
		}
	}, 300);

	$effect(() => {
		if (searchInput) {
			doSearch();
		} else {
			searchResults = undefined;
		}
	});

	$effect(() => {
		if (form?.selectDayUuid) {
			showSelectDayModal = false;
		}
	});

	// Helper: add empty meal type
	const newMealType = (): IMealPlanType => ({ mealType: '', categoryUuids: [], tagUuids: [] });
</script>

<svelte:head>
	<title>Meal Plans - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

{#if data.date}
	<div class="p-5 pb-20">
		<h1 class="text-2xl font-bold mb-5 flex items-center gap-3">
			<span>Meal Plans</span>
			{#if data.user.subscriptionType !== 'PREMIUM' && env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
				<a href="/settings/subscription" class="text-base text-orange-500 hover:underline"
					>Premium</a
				>
			{/if}
		</h1>
		<p class="mb-5">
			Plan meals for a day or week. Choose a meal type, pick categories or tags, and a recipe is
			selected randomly - refresh to get a new one, or pick manually.
		</p>

		<!-- Calendar navigation -->
		<div class="flex justify-between mb-5 gap-3 items-center">
			<h2 class="text-xl font-bold">{format(data.date, 'MMMM yyyy')}</h2>
			<div class="flex gap-1 items-center">
				<a
					href={`?date=${data.firstDayOfPreviousMonth}`}
					title="Previous month"
					class="hover:bg-gray-200 p-1 rounded-sm"
				>
					<Icon icon="ph:caret-left" color="#000" width="1.2rem" />
				</a>
				<a
					href={`?date=${format(data.today, 'yyyy-MM-dd')}`}
					class="hover:bg-gray-200 p-1 rounded-sm">Today</a
				>
				<a
					href={`?date=${data.firstDayOfNextMonth}`}
					title="Next month"
					class="hover:bg-gray-200 p-1 rounded-sm"
				>
					<Icon icon="ph:caret-right" color="#000" width="1.2rem" />
				</a>
			</div>
		</div>

		<!-- Calendar grid -->
		<div class="border mb-5">
			<div class="grid grid-cols-7">
				{#each data.days as day}
					<div class="p-3 text-center font-semibold border-r last:border-r-0 text-sm sm:text-base">
						{#each day.split('') as dayLetter, i}
							<span class={i !== 0 ? 'hidden sm:inline' : ''}>{dayLetter}</span>
						{/each}
					</div>
				{/each}
			</div>
			<div class="grid grid-cols-7">
				{#each data.mealPlans as mealPlan}
					<a
						data-sveltekit-noscroll
						href={`?date=${format(mealPlan.calendarDate.fullDate, 'yyyy-MM-dd')}`}
						class={`flex flex-col justify-start text-left p-3 border-r hover:bg-slate-50 min-h-24 border-t
							${mealPlan.calendarDate.day === 'Sun' ? 'border-r-0' : ''}
							${!mealPlan.calendarDate.activeMonth ? 'bg-gray-50' : ''}
							${isSameDay(mealPlan.calendarDate.fullDate, data.date) ? 'bg-slate-50' : ''}`.trim()}
					>
						<div class="mb-2">
							<div
								class={`text-sm h-7 w-7 flex items-center justify-center
									${mealPlan.calendarDate.isToday ? 'bg-orange-500 rounded-full text-white' : ''}`}
							>
								{mealPlan.calendarDate.dateNum}
							</div>
						</div>
						<div class="hidden md:flex flex-col gap-1.5">
							{#each mealPlan.mealTypes as mealType}
								<div class="text-xs leading-tight">
									<div class="text-gray-400">{mealType.mealType}</div>
									<div class="truncate text-gray-700">{mealType.recipe?.data.title || ''}</div>
								</div>
							{/each}
						</div>
						<div class="flex flex-wrap gap-1 md:hidden">
							{#each mealPlan.mealTypes as _}
								<div class="w-2 h-2 bg-gray-400 rounded-full"></div>
							{/each}
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Day and week action buttons -->
		<div class="flex flex-col gap-5 sm:flex-row sm:gap-10 mb-6">
			<div>
				<div class="text-sm text-gray-500 mb-0.5">Day</div>
				<h3 class="text-lg font-semibold mb-1">{format(data.date, 'EEE d MMMM yyyy')}</h3>
				<div class="flex gap-1 flex-wrap">
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center"
						onclick={() => (showPlanDayModal = true)}
					>
						<Icon icon="ph:note-pencil" color="#000" width="1.5rem" />
						<span>Plan day</span>
					</button>
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center"
						onclick={() => (showDeleteDayModal = true)}
					>
						<Icon icon="ph:trash" color="#000" width="1.5rem" />
						<span>Delete</span>
					</button>
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center"
						onclick={() => (showShoppingListDayModal = true)}
					>
						<Icon icon="ph:shopping-cart" color="#000" width="1.5rem" />
						<span>Shopping list</span>
					</button>
				</div>
			</div>
			<div>
				<div class="text-sm text-gray-500 mb-0.5">Week</div>
				<h3 class="text-lg font-semibold mb-1">
					{format(data.firstDateOfWeek, 'EEE d MMM')} – {format(
						data.lastDateOfWeek,
						'EEE d MMM yyyy'
					)}
				</h3>
				<div class="flex gap-1">
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center"
						onclick={() => (showPlanWeekModal = true)}
					>
						<Icon icon="ph:note-pencil" color="#000" width="1.5rem" />
						<span>Plan week</span>
					</button>
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center"
						onclick={() => (showShoppingListWeekModal = true)}
					>
						<Icon icon="ph:shopping-cart" color="#000" width="1.5rem" />
						<span>Shopping list</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Day meal plan: recipe cards -->
		<div class="flex flex-col gap-4">
			{#each data.dateMealPlan?.mealTypes || [] as mealType}
				<div class="border rounded-sm p-4">
					<!-- Header: meal type name + filter pills -->
					<div class="flex flex-wrap items-center gap-2 mb-3">
						<span class="font-semibold">{mealType.mealType}</span>
						{#each mealType.categories || [] as category}
							<a
								href={`/categories/${category.slug}`}
								class="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full hover:bg-orange-100"
								>{category.name}</a
							>
						{/each}
						{#each mealType.tags || [] as tag}
							<a
								href={`/tags/${tag.slug}`}
								class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-gray-200"
								>{tag.name}</a
							>
						{/each}
					</div>
					<!-- Recipe + actions -->
					<div class="flex flex-col lg:flex-row gap-5">
						<a
							href={`/recipes/${mealType.recipe?.slug}`}
							style={`background-image: url("${mealType.recipe?.data.image}")`}
							class="bg-center bg-no-repeat bg-cover w-full lg:w-48 h-36 rounded-sm shrink-0"
							title="See recipe"
						></a>
						<div class="flex-1 min-w-0">
							<h4 class="mb-2 font-medium hover:underline">
								<a href={`/recipes/${mealType.recipe?.slug}`}>{mealType.recipe?.data.title}</a>
							</h4>
							{#if mealType.recipe}
								<RecipeCategoryTag recipe={mealType.recipe} />
							{/if}
						</div>
						<div class="flex lg:flex-col gap-1 shrink-0">
							<form
								method="post"
								action="?/refreshday"
								use:enhance={() => {
									return async ({ update }) => {
										refreshDaySubmitting = true;
										await update();
										refreshDaySubmitting = false;
									};
								}}
							>
								<input type="hidden" name="uuid" value={data.dateMealPlan?.uuid} />
								<input type="hidden" name="date" value={data.date.toISOString()} />
								<input type="hidden" name="mealType" value={mealType.mealType} />
								<input
									type="hidden"
									name="categoryUuids"
									value={mealType.categoryUuids.join(',')}
								/>
								<input type="hidden" name="tagUuids" value={mealType.tagUuids.join(',')} />
								<button
									type="submit"
									class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center whitespace-nowrap"
									disabled={refreshDaySubmitting}
									title="Pick a different random recipe"
								>
									<Icon icon="ph:arrows-clockwise" color="#000" width="1.5rem" />
									<span>Refresh</span>
								</button>
							</form>
							<button
								type="button"
								class="hover:bg-gray-200 p-1 rounded-sm flex gap-2 items-center whitespace-nowrap"
								onclick={() => {
									selectDayMealType = mealType.mealType;
									selectDayCategoryUuids = mealType.categoryUuids;
									selectDayTagUuids = mealType.tagUuids;
									showSelectDayModal = true;
								}}
							>
								<Icon icon="ph:magnifying-glass" color="#000" width="1.5rem" />
								<span>Pick recipe</span>
							</button>
						</div>
					</div>
				</div>
			{/each}
			{#if !data.dateMealPlan?.mealTypes?.length}
				<p class="italic text-gray-500">No meal plan for this day.</p>
			{/if}
		</div>
	</div>
{/if}

<!-- ─── Select Recipe Modal ─────────────────────────────────────── -->
<Modal bind:show={showSelectDayModal}>
	<h4 class="text-xl font-bold mb-1">Pick a Recipe</h4>
	<p class="text-sm text-gray-500 mb-5">
		Search and select a specific recipe for <span class="font-semibold text-gray-700"
			>{selectDayMealType}</span
		>.
	</p>
	{#if form?.selectDayMessage}
		<div class="pb-4">
			<Alert variant={form?.selectDayMessageType || 'error'}>{form?.selectDayMessage}</Alert>
		</div>
	{/if}
	<form
		action="/search"
		method="get"
		onsubmit={(e) => {
			e.preventDefault();
			doSearch();
		}}
	>
		<div
			class="flex border-2 border-slate-200 rounded-sm w-full focus-within:border-orange-500 hover:border-slate-300"
		>
			<input
				bind:value={searchInput}
				type="text"
				placeholder="Search recipes…"
				class="p-3 w-full rounded-sm outline-hidden"
			/>
			<button type="submit" class="rounded-r px-3 hover:bg-slate-100" title="Search">
				{#if isSearching}
					<Icon icon="ph:circle-notch" color="#000" width="1.4rem" class="animate-spin" />
				{:else}
					<Icon icon="ph:magnifying-glass" width="1.4rem" color="#000" />
				{/if}
			</button>
		</div>
	</form>
	<div class="flex flex-col gap-3 mt-4 max-h-96 overflow-auto" class:hidden={!searchResults?.found}>
		{#each searchResults?.hits || [] as hit}
			<form
				method="post"
				action="?/selectday"
				class="w-full"
				use:enhance={() => {
					return async ({ update }) => {
						selectDaySubmitting = true;
						await update();
						selectDaySubmitting = false;
					};
				}}
			>
				<input type="hidden" name="uuid" value={data.dateMealPlan?.uuid} />
				<input type="hidden" name="recipeUuid" value={hit.document.id} />
				<input type="hidden" name="date" value={data.date.toISOString()} />
				<input type="hidden" name="mealType" value={selectDayMealType} />
				<input type="hidden" name="categoryUuids" value={selectDayCategoryUuids.join(',')} />
				<input type="hidden" name="tagUuids" value={selectDayTagUuids.join(',')} />
				<button
					type="submit"
					class="flex flex-col sm:flex-row gap-4 border rounded-sm p-3 hover:bg-gray-50 w-full text-left"
					disabled={selectDaySubmitting}
				>
					<div
						style={`background-image: url("${hit.document.imageUrl}")`}
						class="bg-center bg-no-repeat bg-cover w-full h-24 rounded-sm sm:w-28 sm:h-20 shrink-0"
					></div>
					<div class="min-w-0">
						<h4 class="mb-2 flex gap-2 items-start">
							<span>{@html hit.highlight.title.snippet}</span>
							<a
								href={`/recipes/${hit.document.slug}`}
								target="_blank"
								class="hover:bg-gray-200 p-1 rounded-sm shrink-0"
								title="Open recipe"
								onclick={(e) => e.stopPropagation()}
							>
								<Icon icon="ph:arrow-square-out" width="1rem" color="#000" />
							</a>
						</h4>
						<div class="flex flex-wrap gap-1 text-xs text-gray-500">
							{#each hit.document.categories as cat}
								<span class="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full">{cat}</span>
							{/each}
							{#each hit.document.tags as tag}
								<span class="bg-gray-100 px-1.5 py-0.5 rounded-full">{tag}</span>
							{/each}
						</div>
					</div>
				</button>
			</form>
		{/each}
	</div>
</Modal>

<!-- ─── Plan Day Modal ──────────────────────────────────────────── -->
<Modal bind:show={showPlanDayModal}>
	<h4 class="text-xl font-bold mb-1">Plan Day</h4>
	<p class="text-sm text-gray-500 mb-4">{format(data.date, 'EEE d MMMM yyyy')}</p>

	{#if form?.planDayMessage}
		<div class="pb-4">
			<Alert variant={form?.planDayMessageType || 'error'}>{form?.planDayMessage}</Alert>
		</div>
	{/if}

	<div class="mb-5">
		<button
			type="button"
			class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-sm disabled:opacity-50"
			disabled={isLoadingPlanLatestMealTypes}
			onclick={handlePlanLatestMealTypes}
		>
			{#if isLoadingPlanLatestMealTypes}
				<Icon icon="ph:circle-notch" color="#000" width="1rem" class="animate-spin" />
			{:else}
				<Icon icon="ph:clock-counter-clockwise" color="#000" width="1rem" />
			{/if}
			Load from last plan
		</button>
	</div>

	<form
		method="post"
		action="?/planday"
		use:enhance={() => {
			return async ({ update }) => {
				planDaySubmitting = true;
				await update();
				planDaySubmitting = false;
			};
		}}
	>
		<input type="hidden" name="date" value={data.date.toISOString()} />

		{#each planDayMealTypes as _, i}
			<div class="border rounded-sm p-4 mb-4">
				<div class="flex items-start gap-3">
					<div class="flex-1 flex flex-col gap-4">
						<div>
							<label for={`mealType${i}`} class="font-semibold pb-1.5 block text-sm"
								>Meal type</label
							>
							<input
								type="text"
								id={`mealType${i}`}
								name={`mealType${i}`}
								bind:value={planDayMealTypes[i].mealType}
								placeholder="e.g. Breakfast, Lunch, Dinner"
								class="block border-2 border-slate-200 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-slate-300"
							/>
							{#if form?.errors && form.errors[`planDayMealType${i}`]}
								<div class="text-sm pt-1 text-red-500">{form.errors[`planDayMealType${i}`]}</div>
							{/if}
						</div>

						<div>
							<div class="font-semibold text-sm mb-1.5">Categories</div>
							<input
								type="hidden"
								name={`categoryUuids${i}`}
								bind:value={planDayMealTypes[i].categoryUuids}
							/>
							<div class="flex gap-2 flex-wrap">
								{#each data.categories as category}
									<button
										class={`text-sm px-2.5 py-1 border rounded-full ${planDayMealTypes[i].categoryUuids.includes(category.uuid) ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100 border-gray-200'}`}
										type="button"
										onclick={() => {
											if (planDayMealTypes[i].categoryUuids.includes(category.uuid)) {
												planDayMealTypes[i].categoryUuids = planDayMealTypes[
													i
												].categoryUuids.filter((c) => c !== category.uuid);
											} else {
												planDayMealTypes[i].categoryUuids = [
													...planDayMealTypes[i].categoryUuids,
													category.uuid
												];
											}
										}}>{category.name}</button
									>
								{/each}
							</div>
						</div>

						<div>
							<div class="font-semibold text-sm mb-1.5">Tags</div>
							<input
								type="hidden"
								name={`tagUuids${i}`}
								bind:value={planDayMealTypes[i].tagUuids}
							/>
							<div class="flex gap-2 flex-wrap">
								{#each data.tags as tag}
									<button
										class={`text-sm px-2.5 py-1 border rounded-full ${planDayMealTypes[i].tagUuids.includes(tag.uuid) ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100 border-gray-200'}`}
										type="button"
										onclick={() => {
											if (planDayMealTypes[i].tagUuids.includes(tag.uuid)) {
												planDayMealTypes[i].tagUuids = planDayMealTypes[i].tagUuids.filter(
													(c) => c !== tag.uuid
												);
											} else {
												planDayMealTypes[i].tagUuids = [...planDayMealTypes[i].tagUuids, tag.uuid];
											}
										}}>{tag.name}</button
									>
								{/each}
							</div>
						</div>
					</div>
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded-sm shrink-0"
						title="Remove meal type"
						onclick={() => {
							planDayMealTypes = planDayMealTypes.filter((_, j) => i !== j);
						}}
					>
						<Icon icon="ph:x" color="#000" width="1.4rem" />
					</button>
				</div>
			</div>
		{/each}

		<div class="mb-5">
			<button
				type="button"
				class="p-2 border border-gray-200 rounded-sm flex gap-2 items-center hover:bg-gray-100 text-sm"
				onclick={() => {
					planDayMealTypes = [...planDayMealTypes, newMealType()];
				}}
			>
				<Icon icon="ph:plus" color="#000" width="1.2rem" />
				<span>Add meal type</span>
			</button>
		</div>

		<button
			type="submit"
			disabled={planDaySubmitting || !planDayMealTypes.length}
			class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
		>
			Save
		</button>
	</form>
</Modal>

<!-- ─── Plan Week Modal ─────────────────────────────────────────── -->
<Modal bind:show={showPlanWeekModal}>
	<h4 class="text-xl font-bold mb-1">Plan Week</h4>
	<p class="text-sm text-gray-500 mb-4">
		{format(data.firstDateOfWeek, 'EEE d MMM')} – {format(data.lastDateOfWeek, 'EEE d MMM yyyy')}
	</p>

	{#if form?.planWeekMessage}
		<div class="pb-4">
			<Alert variant={form?.planWeekMessageType || 'error'}>{form?.planWeekMessage}</Alert>
		</div>
	{/if}

	<div class="mb-5">
		<button
			type="button"
			class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-sm disabled:opacity-50"
			disabled={isLoadingPlanLatestMealTypes}
			onclick={handlePlanLatestMealTypes}
		>
			{#if isLoadingPlanLatestMealTypes}
				<Icon icon="ph:circle-notch" color="#000" width="1rem" class="animate-spin" />
			{:else}
				<Icon icon="ph:clock-counter-clockwise" color="#000" width="1rem" />
			{/if}
			Load from last plan
		</button>
	</div>

	<form
		method="post"
		action="?/planweek"
		use:enhance={() => {
			return async ({ update }) => {
				planWeekSubmitting = true;
				await update();
				planWeekSubmitting = false;
			};
		}}
	>
		<input type="hidden" name="dateFrom" value={data.firstDateOfWeek.toISOString()} />
		<input type="hidden" name="dateTo" value={data.lastDateOfWeek.toISOString()} />

		<!-- Day tabs with count badges -->
		<div class="flex border-b mb-1 overflow-x-auto">
			{#each WEEKDAYS_LOWER as weekday}
				{@const count = planWeekMealTypes[weekday].length}
				{@const hasError =
					form?.errors &&
					Object.keys(form.errors).some((k) => k.startsWith(`planWeekMealType${weekday}`))}
				<button
					type="button"
					class={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px capitalize shrink-0
						${weekday === planWeekSelectedDay ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:border-gray-300'}
						${hasError ? 'text-red-500' : ''}`}
					onclick={() => (planWeekSelectedDay = weekday)}
				>
					{weekday}
					{#if count > 0}
						<span
							class={`text-xs px-1.5 py-0.5 rounded-full ${weekday === planWeekSelectedDay ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}
							>{count}</span
						>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Copy to all days button -->
		<div class="flex justify-end mb-4 pt-1">
			<button
				type="button"
				class="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-sm disabled:opacity-40"
				disabled={!planWeekMealTypes[planWeekSelectedDay]?.length}
				onclick={handleCopyDay}
			>
				<Icon icon="ph:copy" color="#000" width="1rem" />
				Copy to all days
			</button>
		</div>

		<!-- Per-day meal type cards -->
		{#each WEEKDAYS_LOWER as dayKey}
			<div class:hidden={dayKey !== planWeekSelectedDay}>
				{#each planWeekMealTypes[dayKey] as _, i}
					<div class="border rounded-sm p-4 mb-4">
						<div class="flex items-start gap-3">
							<div class="flex-1 flex flex-col gap-4">
								<div>
									<label for={`mealType${dayKey}${i}`} class="font-semibold pb-1.5 block text-sm"
										>Meal type</label
									>
									<input
										type="text"
										id={`mealType${dayKey}${i}`}
										name={`mealType${dayKey}${i}`}
										bind:value={planWeekMealTypes[dayKey][i].mealType}
										placeholder="e.g. Breakfast, Lunch, Dinner"
										class="block border-2 border-slate-200 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-slate-300"
									/>
									{#if form?.errors && form.errors[`planWeekMealType${dayKey}${i}`]}
										<div class="text-sm pt-1 text-red-500">
											{form.errors[`planWeekMealType${dayKey}${i}`]}
										</div>
									{/if}
								</div>

								<div>
									<div class="font-semibold text-sm mb-1.5">Categories</div>
									<input
										type="hidden"
										name={`categoryUuids${dayKey}${i}`}
										bind:value={planWeekMealTypes[dayKey][i].categoryUuids}
									/>
									<div class="flex gap-2 flex-wrap">
										{#each data.categories as category}
											<button
												class={`text-sm px-2.5 py-1 border rounded-full ${planWeekMealTypes[dayKey][i].categoryUuids.includes(category.uuid) ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100 border-gray-200'}`}
												type="button"
												onclick={() => {
													if (planWeekMealTypes[dayKey][i].categoryUuids.includes(category.uuid)) {
														planWeekMealTypes[dayKey][i].categoryUuids = planWeekMealTypes[dayKey][
															i
														].categoryUuids.filter((c) => c !== category.uuid);
													} else {
														planWeekMealTypes[dayKey][i].categoryUuids = [
															...planWeekMealTypes[dayKey][i].categoryUuids,
															category.uuid
														];
													}
												}}>{category.name}</button
											>
										{/each}
									</div>
								</div>

								<div>
									<div class="font-semibold text-sm mb-1.5">Tags</div>
									<input
										type="hidden"
										name={`tagUuids${dayKey}${i}`}
										bind:value={planWeekMealTypes[dayKey][i].tagUuids}
									/>
									<div class="flex gap-2 flex-wrap">
										{#each data.tags as tag}
											<button
												class={`text-sm px-2.5 py-1 border rounded-full ${planWeekMealTypes[dayKey][i].tagUuids.includes(tag.uuid) ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100 border-gray-200'}`}
												type="button"
												onclick={() => {
													if (planWeekMealTypes[dayKey][i].tagUuids.includes(tag.uuid)) {
														planWeekMealTypes[dayKey][i].tagUuids = planWeekMealTypes[dayKey][
															i
														].tagUuids.filter((c) => c !== tag.uuid);
													} else {
														planWeekMealTypes[dayKey][i].tagUuids = [
															...planWeekMealTypes[dayKey][i].tagUuids,
															tag.uuid
														];
													}
												}}>{tag.name}</button
											>
										{/each}
									</div>
								</div>
							</div>
							<button
								type="button"
								class="hover:bg-gray-200 p-1 rounded-sm shrink-0"
								title="Remove meal type"
								onclick={() => {
									planWeekMealTypes[dayKey] = planWeekMealTypes[dayKey].filter((_, j) => i !== j);
								}}
							>
								<Icon icon="ph:x" color="#000" width="1.4rem" />
							</button>
						</div>
					</div>
				{/each}

				<div class="mb-5">
					<button
						type="button"
						class="p-2 border border-gray-200 rounded-sm flex gap-2 items-center hover:bg-gray-100 text-sm"
						onclick={() => {
							planWeekMealTypes[dayKey] = [...planWeekMealTypes[dayKey], newMealType()];
						}}
					>
						<Icon icon="ph:plus" color="#000" width="1.2rem" />
						<span>Add meal type</span>
					</button>
				</div>
			</div>
		{/each}

		<button
			type="submit"
			disabled={planWeekSubmitting}
			class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
		>
			Save week
		</button>
	</form>
</Modal>

<!-- ─── Refresh error modal ─────────────────────────────────────── -->
<Modal bind:show={showFormMessageModal}>
	<Alert variant={formMessageType}>{formMessage}</Alert>
</Modal>

<!-- ─── Delete Day Modal ────────────────────────────────────────── -->
<Modal bind:show={showDeleteDayModal}>
	<div class="text-xl font-semibold mb-3">Delete Meal Plan</div>
	{#if form?.deleteDayMessage}
		<div class="pb-3">
			<Alert variant={form?.deleteDayMessageType || 'error'}>{form?.deleteDayMessage}</Alert>
		</div>
	{/if}
	<p class="pb-5 text-gray-600">
		Permanently delete the meal plan for <span class="font-semibold text-gray-900"
			>{format(data.date, 'EEE d MMMM yyyy')}</span
		>?
	</p>
	<form method="post" action="?/deleteday" use:enhance>
		<input type="hidden" name="uuid" value={data.dateMealPlan?.uuid} />
		<button
			type="submit"
			class="p-3 bg-red-500 text-white rounded-sm hover:bg-red-600 disabled:bg-red-200"
			disabled={!data.dateMealPlan?.uuid}
		>
			Delete
		</button>
	</form>
</Modal>

<!-- ─── Shopping List — Day ─────────────────────────────────────── -->
<Modal bind:show={showShoppingListDayModal}>
	<h4 class="text-xl font-bold mb-1">Create Shopping List</h4>
	<p class="text-sm text-gray-500 mb-3">
		For <span class="font-semibold text-gray-700">{format(data.date, 'EEE d MMMM yyyy')}</span>
	</p>
	{#if data.dateMealPlanRecipes.length}
		<ul class="list-disc list-inside mb-5 text-sm text-gray-700">
			{#each data.dateMealPlanRecipes as r}
				<li>{r.data.title}</li>
			{/each}
		</ul>
	{:else}
		<p class="italic text-gray-500 mb-5">No recipes for this day.</p>
	{/if}
	{#if form?.shoppingListDayMessage}
		<div class="pb-4">
			<Alert variant={form?.shoppingListDayMessageType || 'error'}
				>{form?.shoppingListDayMessage}</Alert
			>
		</div>
	{/if}
	<form method="post" action="?/shoppinglistday" use:enhance>
		<input type="hidden" name="title" value={format(data.date, 'EEE d MMMM yyyy')} />
		<input type="hidden" name="recipeUuids" value={data.dateMealPlanRecipes.map((r) => r.uuid)} />
		<input
			type="hidden"
			name="ingredients"
			value={data.dateMealPlanRecipes
				.map((r) => r.data.ingredients)
				.flat(1)
				.join('|||')}
		/>
		<button
			type="submit"
			class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			disabled={!data.dateMealPlanRecipes.length}
		>
			Create
		</button>
	</form>
</Modal>

<!-- ─── Shopping List — Week ────────────────────────────────────── -->
<Modal bind:show={showShoppingListWeekModal}>
	<h4 class="text-xl font-bold mb-1">Create Shopping List</h4>
	<p class="text-sm text-gray-500 mb-3">
		For <span class="font-semibold text-gray-700"
			>{format(data.firstDateOfWeek, 'EEE d MMM')} – {format(
				data.lastDateOfWeek,
				'EEE d MMM yyyy'
			)}</span
		>
	</p>
	{#if data.weekMealPlansRecipes.length}
		<ul class="list-disc list-inside mb-5 text-sm text-gray-700">
			{#each data.weekMealPlansRecipes as r}
				<li>{r.data.title}</li>
			{/each}
		</ul>
	{:else}
		<p class="italic text-gray-500 mb-5">No recipes for this week.</p>
	{/if}
	{#if form?.shoppingListWeekMessage}
		<div class="pb-4">
			<Alert variant={form?.shoppingListWeekMessageType || 'error'}
				>{form?.shoppingListWeekMessage}</Alert
			>
		</div>
	{/if}
	<form method="post" action="?/shoppinglistweek" use:enhance>
		<input
			type="hidden"
			name="title"
			value={`${format(data.firstDateOfWeek, 'EEE d MMM')} – ${format(data.lastDateOfWeek, 'EEE d MMM yyyy')}`}
		/>
		<input type="hidden" name="recipeUuids" value={data.weekMealPlansRecipes.map((r) => r.uuid)} />
		<input
			type="hidden"
			name="ingredients"
			value={data.weekMealPlansRecipes
				.map((r) => r.data.ingredients)
				.flat(1)
				.join('|||')}
		/>
		<button
			type="submit"
			class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			disabled={!data.weekMealPlansRecipes.length}
		>
			Create
		</button>
	</form>
</Modal>
