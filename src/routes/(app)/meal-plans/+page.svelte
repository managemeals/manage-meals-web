<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import { format, isSameDay } from 'date-fns';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import RecipeCategoryTag from '$lib/components/RecipeCategoryTag.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { enhance } from '$app/forms';
	import { sleep } from '$lib/utils';

	export let data: PageData;

	let showSelectRecipeModal = false;
	let refreshSubmitting = false;
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
									<div>{mealType.recipe.data.title}</div>
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
			<div class="mb-5">
				<button type="button" class="hover:bg-gray-200 p-1 rounded flex gap-2 mb-1">
					<Icon icon="ph:arrows-clockwise" color="#000" width="1.5rem" />
					<span>Plan the whole week</span>
				</button>
			</div>
			<div class="flex flex-col gap-5">
				{#each data.dateMealPlan?.mealTypes || [] as mealType}
					<div class="flex gap-5 border rounded p-3">
						<div>
							<div class="flex flex-col mb-3">
								<div class="uppercase text-sm text-gray-600">Meal type</div>
								<div class="font-semibold">{mealType.mealType}</div>
							</div>
							<form
								method="post"
								action="?/refresh"
								use:enhance={() => {
									return async ({ update }) => {
										refreshSubmitting = true;
										await update();
										refreshSubmitting = false;
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
									disabled={refreshSubmitting}
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
									href={`/recipes/${mealType.recipe.slug}`}
									style={`background-image: url("${mealType.recipe.data.image}")`}
									class="bg-center bg-no-repeat bg-cover w-60 h-48 rounded"
								>
									<span class="sr-only">See recipe</span>
								</a>
								<div>
									<h4 class="mb-3 hover:underline">
										<a href={`/recipes/${mealType.recipe.slug}`}>
											{mealType.recipe.data.title}
										</a>
									</h4>
									<RecipeCategoryTag recipe={mealType.recipe} />
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
