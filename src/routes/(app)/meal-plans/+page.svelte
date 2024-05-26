<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
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
		TAlert,
		TDayMealPlanTypes,
		TShortDayLower
	} from '$lib/types';
	import { WEEKDAYS_LOWER } from '$lib/constants';

	export let data: PageData;

	export let form: ActionData;

	// States
	let showSelectRecipeModal = false;
	let refreshDaySubmitting = false;
	let showFormMessageModal = false;
	let formMessageType: TAlert = 'error';
	let formMessage = '';
	let showPlanDayModal = false;
	let isLoadingPlanDayLatestMealTypes = false;
	let showDeleteDayModal = false;
	let showPlanWeekModal = false;
	let planDaySubmitting = false;
	let planWeekSubmitting = false;

	// Plan day
	let planDayMealTypes: IMealPlanType[] = [];

	const handlePlanDayLatestMealTypes = async () => {
		isLoadingPlanDayLatestMealTypes = true;
		try {
			const res = await fetch('/api/meal-plans/latest');
			const obj = (await res.json()) as IMealPlan;
			planDayMealTypes = obj.mealTypes.map((mt) => ({
				mealType: mt.mealType,
				categoryUuids: mt.categoryUuids || [],
				tagUuids: mt.tagUuids || []
			}));
		} catch (e) {
			planDayMealTypes = [];
		} finally {
			isLoadingPlanDayLatestMealTypes = false;
		}
	};

	$: if (showPlanDayModal) {
		handlePlanDayLatestMealTypes();
	}

	$: if (form?.planDayUuid) {
		showPlanDayModal = false;
	}

	// Plan week
	let planWeekSelectedDay: TShortDayLower = 'mon';
	let planWeekMealTypes: TDayMealPlanTypes = {
		mon: [
			{
				mealType: 'Dinner',
				categoryUuids: ['c246af91-9338-4ef9-a422-04bc077f8c06'],
				tagUuids: ['f0b5da1c-ff66-457e-a72b-165da3aa6c8f']
			}
		],
		tue: [],
		wed: [],
		thu: [],
		fri: [],
		sat: [],
		sun: []
	};

	$: if (form?.planWeekUuids) {
		showPlanWeekModal = false;
	}

	// Refresh day
	$: if (form?.refreshDayMessage) {
		formMessage = form.refreshDayMessage as string;
		formMessageType = form.refreshDayMessageType as TAlert;
		showFormMessageModal = true;
		form.refreshDayMessage = '';
	}

	// Delete day
	$: if (form?.deleteDayUuid) {
		showDeleteDayModal = false;
	}
</script>

<svelte:head>
	<title>Meal Plans - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

{#if data.date}
	<div class="p-5 pb-20">
		<h1 class="text-2xl font-bold mb-5">Meal Plans</h1>
		<p class="mb-5">
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam totam saepe esse provident
			accusamus sapiente magnam porro iure accusantium quidem. Quasi quos nulla tenetur! Iure
			distinctio aut accusantium sapiente numquam?
		</p>
		<div class="flex justify-between mb-5 gap-3 items-center">
			<h2 class="text-xl font-bold">{format(data.date, 'MMMM yyyy')}</h2>
			<div class="flex gap-3 items-center">
				<a
					href={`?date=${data.firstDayOfPreviousMonth}`}
					title="Previous"
					class="hover:bg-gray-200 p-1 rounded"
				>
					<span class="sr-only">Previous</span>
					<Icon icon="ph:caret-left" color="#000" width="1.2rem" />
				</a>
				<a href={`?date=${format(data.today, 'yyyy-MM-dd')}`} class="hover:bg-gray-200 p-1 rounded"
					>Today</a
				>
				<a
					href={`?date=${data.firstDayOfNextMonth}`}
					title="Next"
					class="hover:bg-gray-200 p-1 rounded"
				>
					<span class="sr-only">Next</span>
					<Icon icon="ph:caret-right" color="#000" width="1.2rem" />
				</a>
			</div>
		</div>
		<div class="border mb-5">
			<div class="grid grid-cols-7">
				{#each data.days as day}
					<div class="p-3 text-center font-semibold border-r last:border-r-0 text-sm sm:text-base">
						{#each day.split('') as dayLetter, i}
							<span class={`${i !== 0 ? 'hidden sm:inline' : ''}`}>{dayLetter}</span>
						{/each}
					</div>
				{/each}
			</div>
			<div class="grid grid-cols-7">
				{#each data.mealPlans as mealPlan}
					<a
						href={`?date=${format(mealPlan.calendarDate.fullDate, 'yyyy-MM-dd')}`}
						class={`
              flex flex-col justify-start text-left p-3 border-r hover:bg-slate-50
							min-h-24
              border-t ${mealPlan.calendarDate.day === 'Sun' ? 'border-r-0' : ''}
              ${!mealPlan.calendarDate.activeMonth ? 'bg-gray-50' : ''}
              ${isSameDay(mealPlan.calendarDate.fullDate, data.date) ? 'bg-slate-50' : ''}
            `.trim()}
					>
						<div class="mb-3">
							<div
								class={`text-sm flex h-7 w-7${mealPlan.calendarDate.isToday ? ' items-center justify-center bg-orange-500 rounded-full text-white' : ''}`}
							>
								{mealPlan.calendarDate.dateNum}
							</div>
						</div>
						<div class="flex flex-col gap-3">
							{#each mealPlan.mealTypes as mealType}
								<div>
									<div class="text-sm text-gray-500">{mealType.mealType}</div>
									<div>{mealType.recipe?.data.title || ''}</div>
								</div>
							{/each}
						</div>
					</a>
				{/each}
			</div>
		</div>
		<div>
			<h3 class="text-lg mb-3 flex gap-5 items-center">
				<span class="font-bold">{format(data.date, 'd MMMM yyyy')}</span>
				<span class="text-sm">
					<span>Week</span>
					<span>{format(data.firstDateOfWeek, 'd MMMM yyyy')}</span>
					<span> - </span>
					<span>{format(data.lastDateOfWeek, 'd MMMM yyyy')}</span>
				</span>
			</h3>
			<div class="mb-1">
				<button
					type="button"
					class="hover:bg-gray-200 p-1 rounded flex gap-2 mb-1"
					on:click={() => {
						showPlanDayModal = true;
					}}
				>
					<Icon icon="ph:arrows-clockwise" color="#000" width="1.5rem" />
					<span>Plan the day</span>
				</button>
			</div>
			<div class="mb-1">
				<button
					type="button"
					class="hover:bg-gray-200 p-1 rounded flex gap-2 mb-1"
					on:click={() => {
						showPlanWeekModal = true;
					}}
				>
					<Icon icon="ph:arrows-clockwise" color="#000" width="1.5rem" />
					<span>Plan the whole week</span>
				</button>
			</div>
			<div class="mb-5">
				<button
					type="button"
					class="hover:bg-gray-200 p-1 rounded flex gap-2 mb-1"
					on:click={() => {
						showDeleteDayModal = true;
					}}
				>
					<Icon icon="ph:arrows-clockwise" color="#000" width="1.5rem" />
					<span>Delete meal plan for the day</span>
				</button>
			</div>
			<div class="flex flex-col gap-5">
				{#each data.dateMealPlan?.mealTypes || [] as mealType}
					<div class="flex gap-5 border rounded p-3">
						<div>
							<div class="flex flex-col mb-3">
								<div class="text-sm text-gray-600">Meal type</div>
								<div class="font-semibold">{mealType.mealType}</div>
							</div>
							<div class="flex flex-col mb-3">
								<div class="text-sm text-gray-600">Meal type categories</div>
								<ul class="flex gap-1 flex-wrap">
									{#each mealType.categories || [] as category}
										<li class="after:content-[','] last:after:content-['']">
											<a href={`/categories/${category.slug}`} class="hover:underline">
												{category.name}
											</a>
										</li>
									{/each}
								</ul>
							</div>
							<div class="flex flex-col mb-3">
								<div class="text-sm text-gray-600">Meal type tags</div>
								<ul class="flex gap-1 flex-wrap">
									{#each mealType.tags || [] as tag}
										<li class="after:content-[','] last:after:content-['']">
											<a href={`/tags/${tag.slug}`} class="hover:underline">
												{tag.name}
											</a>
										</li>
									{/each}
								</ul>
							</div>
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
									class="hover:bg-gray-200 p-1 rounded flex gap-2 mb-1"
									disabled={refreshDaySubmitting}
								>
									<Icon icon="ph:arrows-clockwise" color="#000" width="1.5rem" />
									<span>Refresh recipe</span>
								</button>
							</form>
							<button
								type="button"
								class="hover:bg-gray-200 p-1 rounded flex gap-2"
								on:click={() => {
									showSelectRecipeModal = true;
								}}
							>
								<Icon icon="ph:pencil" color="#000" width="1.5rem" />
								<span>Select recipe</span>
							</button>
						</div>
						<div>
							<div class="flex gap-5">
								<a
									href={`/recipes/${mealType.recipe?.slug}`}
									style={`background-image: url("${mealType.recipe?.data.image}")`}
									class="bg-center bg-no-repeat bg-cover w-60 h-48 rounded"
								>
									<span class="sr-only">See recipe</span>
								</a>
								<div>
									<h4 class="mb-3 hover:underline">
										<a href={`/recipes/${mealType.recipe?.slug}`}>
											{mealType.recipe?.data.title}
										</a>
									</h4>
									{#if mealType.recipe}
										<RecipeCategoryTag recipe={mealType.recipe} />
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
				{#if !data.dateMealPlan?.mealTypes || !data.dateMealPlan?.mealTypes.length}
					<p class="italic">No meal plan for this day</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<Modal bind:show={showSelectRecipeModal}></Modal>

<Modal bind:show={showPlanDayModal}>
	<h4 class="text-xl font-bold mb-3">Plan the day</h4>
	<p class="mb-5">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum necessitatibus nisi voluptatem
		eligendi incidunt illo ea at consectetur.
	</p>
	{#if form?.planDayMessage}
		<div class="py-4">
			<Alert variant={form?.planDayMessageType || 'error'}>
				{form?.planDayMessage}
			</Alert>
		</div>
	{/if}
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
			<div class="border rounded p-3 mb-5">
				<div class="flex items-start gap-3">
					<div>
						<div class="pb-5 last:pb-0">
							<label for={`mealType${i}`} class="font-semibold pb-2 block">Meal Type</label>
							<input
								type="text"
								id={`mealType${i}`}
								name={`mealType${i}`}
								bind:value={planDayMealTypes[i].mealType}
								placeholder="Dinner"
								class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
							/>
							{#if form?.errors && form.errors[`planDayMealType${i}`]}
								<div class="text-sm pt-1 text-red-500">{form.errors[`planDayMealType${i}`]}</div>
							{/if}
						</div>

						<div class="pb-5 last:pb-0">
							<label for={`categoryUuids${i}`} class="font-semibold">Categories</label>
							<input
								type="hidden"
								id={`categoryUuids${i}`}
								name={`categoryUuids${i}`}
								bind:value={planDayMealTypes[i].categoryUuids}
							/>
							<div class="flex gap-2 flex-wrap pt-2">
								{#each data.categories as category}
									<div>
										<button
											class={`p-2 border rounded ${planDayMealTypes[i].categoryUuids.includes(category.uuid) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
											type="button"
											on:click={() => {
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
									</div>
								{/each}
							</div>
						</div>

						<div class="pb-5 last:pb-0 -mt-1">
							<label for={`tagUuids${i}`} class="font-semibold">Tags</label>
							<input
								type="hidden"
								id={`tagUuids${i}`}
								name={`tagUuids${i}`}
								bind:value={planDayMealTypes[i].tagUuids}
							/>
							<div class="flex gap-2 flex-wrap pt-2">
								{#each data.tags as tag}
									<div>
										<button
											class={`p-2 border rounded ${planDayMealTypes[i].tagUuids.includes(tag.uuid) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
											type="button"
											on:click={() => {
												if (planDayMealTypes[i].tagUuids.includes(tag.uuid)) {
													planDayMealTypes[i].tagUuids = planDayMealTypes[i].tagUuids.filter(
														(c) => c !== tag.uuid
													);
												} else {
													planDayMealTypes[i].tagUuids = [
														...planDayMealTypes[i].tagUuids,
														tag.uuid
													];
												}
											}}>{tag.name}</button
										>
									</div>
								{/each}
							</div>
						</div>
					</div>
					<button
						type="button"
						class="hover:bg-gray-200 p-1 rounded"
						title="Remove meal type"
						on:click={() => {
							planDayMealTypes = planDayMealTypes.filter((_, j) => i !== j);
						}}
					>
						<span class="sr-only">Remove meal type</span>
						<Icon icon="ph:x" color="#000" width="1.4rem" />
					</button>
				</div>
			</div>
		{/each}

		<div class="pb-5">
			<button
				type="button"
				class="p-2 border rounded flex gap-2 items-center hover:bg-gray-100"
				on:click={() => {
					planDayMealTypes = [
						...planDayMealTypes,
						{
							mealType: '',
							categoryUuids: [],
							tagUuids: []
						}
					];
				}}
			>
				<Icon icon="ph:plus" color="#000" width="1.2rem" />
				<span>Add meal type</span>
			</button>
		</div>

		<div>
			<button
				type="submit"
				disabled={isLoadingPlanDayLatestMealTypes || planDaySubmitting}
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>
				Create
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showPlanWeekModal}>
	<h4 class="text-xl font-bold mb-3">Plan the week</h4>
	<p class="mb-5">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum necessitatibus nisi voluptatem
		eligendi incidunt illo ea at consectetur.
	</p>
	{#if form?.planWeekMessage}
		<div class="py-4">
			<Alert variant={form?.planWeekMessageType || 'error'}>
				{form?.planWeekMessage}
			</Alert>
		</div>
	{/if}
	<button
		type="button"
		class="hover:bg-gray-200 p-1 rounded flex gap-2 mb-1"
		on:click={() => {
			for (const dayKey of WEEKDAYS_LOWER) {
				if (dayKey === planWeekSelectedDay) {
					continue;
				}
				const copiedMealTypes = [];
				for (const mealType of planWeekMealTypes[planWeekSelectedDay]) {
					copiedMealTypes.push({
						...mealType
					});
				}
				planWeekMealTypes[dayKey] = copiedMealTypes;
			}
		}}
	>
		<Icon icon="ph:copy" color="#000" width="1.5rem" />
		<span>Copy day</span>
	</button>
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
		<div class="grid grid-cols-7 mb-5">
			{#each WEEKDAYS_LOWER as weekday}
				<button
					type="button"
					class={`
						text-center p-3 border-b font-semibold capitalize
						${weekday === planWeekSelectedDay ? 'hover:border-b-orange-500 border-b-2 border-b-orange-500' : 'hover:border-b-gray-400'}
						${form?.errors && Object.keys(form.errors).filter((errorKey) => errorKey.startsWith(`planWeekMealType${weekday}`)).length ? 'text-red-500' : ''}
					`.trim()}
					on:click={() => {
						planWeekSelectedDay = weekday;
					}}
				>
					{weekday}
				</button>
			{/each}
		</div>
		{#each WEEKDAYS_LOWER as dayKey}
			<div class:hidden={dayKey !== planWeekSelectedDay}>
				{#each planWeekMealTypes[dayKey] as _, i}
					<div class="border rounded p-3 mb-5">
						<div class="flex items-start gap-3">
							<div>
								<div class="pb-5 last:pb-0">
									<label for={`mealType${dayKey}${i}`} class="font-semibold pb-2 block"
										>Meal Type</label
									>
									<input
										type="text"
										id={`mealType${dayKey}${i}`}
										name={`mealType${dayKey}${i}`}
										bind:value={planWeekMealTypes[dayKey][i].mealType}
										placeholder="Dinner"
										class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
									/>
									{#if form?.errors && form.errors[`planWeekMealType${dayKey}${i}`]}
										<div class="text-sm pt-1 text-red-500">
											{form.errors[`planWeekMealType${dayKey}${i}`]}
										</div>
									{/if}
								</div>

								<div class="pb-5 last:pb-0">
									<label for={`categoryUuids${dayKey}${i}`} class="font-semibold">Categories</label>
									<input
										type="hidden"
										id={`categoryUuids${dayKey}${i}`}
										name={`categoryUuids${dayKey}${i}`}
										bind:value={planWeekMealTypes[dayKey][i].categoryUuids}
									/>
									<div class="flex gap-2 flex-wrap pt-2">
										{#each data.categories as category}
											<div>
												<button
													class={`p-2 border rounded ${planWeekMealTypes[dayKey][i].categoryUuids.includes(category.uuid) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
													type="button"
													on:click={() => {
														if (
															planWeekMealTypes[dayKey][i].categoryUuids.includes(category.uuid)
														) {
															planWeekMealTypes[dayKey][i].categoryUuids = planWeekMealTypes[
																dayKey
															][i].categoryUuids.filter((c) => c !== category.uuid);
														} else {
															planWeekMealTypes[dayKey][i].categoryUuids = [
																...planWeekMealTypes[dayKey][i].categoryUuids,
																category.uuid
															];
														}
													}}>{category.name}</button
												>
											</div>
										{/each}
									</div>
								</div>

								<div class="pb-5 last:pb-0 -mt-1">
									<label for={`tagUuids${dayKey}${i}`} class="font-semibold">Tags</label>
									<input
										type="hidden"
										id={`tagUuids${dayKey}${i}`}
										name={`tagUuids${dayKey}${i}`}
										bind:value={planWeekMealTypes[dayKey][i].tagUuids}
									/>
									<div class="flex gap-2 flex-wrap pt-2">
										{#each data.tags as tag}
											<div>
												<button
													class={`p-2 border rounded ${planWeekMealTypes[dayKey][i].tagUuids.includes(tag.uuid) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
													type="button"
													on:click={() => {
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
											</div>
										{/each}
									</div>
								</div>
							</div>
							<button
								type="button"
								class="hover:bg-gray-200 p-1 rounded"
								title="Remove meal type"
								on:click={() => {
									planWeekMealTypes[dayKey] = planWeekMealTypes[dayKey].filter((_, j) => i !== j);
								}}
							>
								<span class="sr-only">Remove meal type</span>
								<Icon icon="ph:x" color="#000" width="1.4rem" />
							</button>
						</div>
					</div>
				{/each}

				<div class="pb-5">
					<button
						type="button"
						class="p-2 border rounded flex gap-2 items-center hover:bg-gray-100"
						on:click={() => {
							planWeekMealTypes[dayKey] = [
								...planWeekMealTypes[dayKey],
								{
									mealType: '',
									categoryUuids: [],
									tagUuids: []
								}
							];
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
			class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
		>
			Create
		</button>
	</form>
</Modal>

<Modal bind:show={showFormMessageModal}>
	<Alert variant={formMessageType || 'error'}>{formMessage}</Alert>
</Modal>

<Modal bind:show={showDeleteDayModal}>
	<div class="text-xl font-semibold">Delete Meal Plan</div>
	{#if form?.deleteDayMessage}
		<div class="py-2">
			<Alert variant={form?.deleteDayMessageType || 'error'}>
				{form?.deleteDayMessage}
			</Alert>
		</div>
	{/if}
	<p class="py-3 pb-5">Click the button below to permanently delete the meal plan.</p>
	<form method="post" action="?/deleteday" use:enhance>
		<input type="hidden" name="uuid" value={data.dateMealPlan?.uuid} />
		<button type="submit" class="p-3 bg-red-500 text-white rounded hover:bg-red-600">
			Delete
		</button>
	</form>
</Modal>
