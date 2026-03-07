<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { page as storePage } from '$app/stores';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let categoriesBtnEl: HTMLButtonElement | undefined = $state();
	let tagsBtnEl: HTMLButtonElement | undefined = $state();

	let showCategoriesDropdown = $state(false);
	let showTagsDropdown = $state(false);

	const sortOptions = [
		{ label: 'Name (A-Z)', value: '' },
		{ label: 'Calories ↑', value: 'calories' },
		{ label: 'Calories ↓', value: '-calories' },
		{ label: 'Protein ↑', value: 'protein' },
		{ label: 'Protein ↓', value: '-protein' },
		{ label: 'Rating ↑', value: 'rating' },
		{ label: 'Rating ↓', value: '-rating' },
		{ label: 'Cook Time ↑', value: 'totalTime' },
		{ label: 'Cook Time ↓', value: '-totalTime' }
	];

	function onSortChange(e: Event) {
		const sort = (e.target as HTMLSelectElement).value;
		const params = new URLSearchParams($storePage.url.searchParams);
		params.set('page', '1');
		if (sort) {
			params.set('sort', sort);
		} else {
			params.delete('sort');
		}
		goto(`?${params.toString()}`);
	}

	function onNutritionChange(key: string, e: Event) {
		const value = (e.target as HTMLInputElement).value;
		const params = new URLSearchParams($storePage.url.searchParams);
		params.set('page', '1');
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		goto(`?${params.toString()}`);
	}
</script>

<svelte:head>
	<title>Categories - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex flex-col xl:flex-row gap-3 mb-5">
		<div class="flex items-center gap-3">
			<h1 class="text-2xl font-bold">All Categories</h1>
			<div class="text-sm text-gray-500 dark:text-gray-400">{data.recipes.total} recipes</div>
		</div>

		<div class="flex flex-col md:flex-row md:flex-wrap gap-3">
			<div class="relative">
				<button
					bind:this={categoriesBtnEl}
					onclick={() => (showCategoriesDropdown = !showCategoriesDropdown)}
					class="p-2 border rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 justify-between w-full md:w-auto"
				>
					<div class="whitespace-nowrap overflow-hidden text-left w-full md:w-60 2xl:w-72">
						{data.selectedCategories.join(', ')}
					</div>
					<Icon icon="ph:caret-down" color="#000" width="1.2rem" />
				</button>
				{#if categoriesBtnEl}
					<div
						class="absolute left-0 right-0 w-full top-full bg-white dark:bg-gray-900 shadow-lg flex flex-col rounded-sm border z-10 max-h-96 overflow-auto"
						class:hidden={!showCategoriesDropdown}
						use:clickOutside={[categoriesBtnEl]}
						onclickoutside={() => {
							showCategoriesDropdown = false;
						}}
					>
						{#each data.categories as category}
							<a
								href={`?${new URLSearchParams({
									...Object.fromEntries($storePage.url.searchParams),
									page: '1',
									categories: ($storePage.url.searchParams.get('categories') || '')
										.split(',')
										.includes(category.slug)
										? ($storePage.url.searchParams.get('categories') || '')
												.split(',')
												.filter((c) => c !== category.slug)
												.join(',')
										: [
												...($storePage.url.searchParams.get('categories') || '').split(','),
												category.slug
											]
												.filter((c) => c)
												.join(',')
								})
									.toString()
									.trim()}`}
								class={`flex justify-between items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 first:rounded-t last:rounded-b ${data.selectedCategoriesSlugs.includes(category.slug) ? ' bg-gray-100 dark:bg-gray-800' : ''}`}
							>
								<span>{category.name}</span>
								<input
									type="checkbox"
									class="w-4 h-4 hover:cursor-pointer pointer-events-none"
									checked={data.selectedCategoriesSlugs.includes(category.slug)}
								/>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="relative">
				<button
					bind:this={tagsBtnEl}
					onclick={() => (showTagsDropdown = !showTagsDropdown)}
					class="p-2 border rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 justify-between w-full md:w-auto"
				>
					<div class="whitespace-nowrap overflow-hidden text-left w-full md:w-60 2xl:w-72">
						{data.selectedTags.join(', ')}
					</div>
					<Icon icon="ph:caret-down" color="#000" width="1.2rem" />
				</button>
				{#if tagsBtnEl}
					<div
						class="absolute left-0 right-0 w-full top-full bg-white dark:bg-gray-900 shadow-lg flex flex-col rounded-sm border z-10 max-h-96 overflow-auto"
						class:hidden={!showTagsDropdown}
						use:clickOutside={[tagsBtnEl]}
						onclickoutside={() => {
							showTagsDropdown = false;
						}}
					>
						{#each data.tags as tag}
							<a
								href={`?${new URLSearchParams({
									...Object.fromEntries($storePage.url.searchParams),
									page: '1',
									tags: ($storePage.url.searchParams.get('tags') || '')
										.split(',')
										.includes(tag.slug)
										? ($storePage.url.searchParams.get('tags') || '')
												.split(',')
												.filter((c) => c !== tag.slug)
												.join(',')
										: [...($storePage.url.searchParams.get('tags') || '').split(','), tag.slug]
												.filter((c) => c)
												.join(',')
								})
									.toString()
									.trim()}`}
								class={`flex justify-between items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 first:rounded-t last:rounded-b ${data.selectedTagsSlugs.includes(tag.slug) ? ' bg-gray-100 dark:bg-gray-800' : ''}`}
							>
								<span>{tag.name}</span>
								<input
									type="checkbox"
									class="w-4 h-4 hover:cursor-pointer pointer-events-none"
									checked={data.selectedTagsSlugs.includes(tag.slug)}
								/>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<select
				value={data.selectedSort}
				onchange={onSortChange}
				class="p-2 border rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-900 bg-white"
			>
				{#each sortOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>

			<div class="flex items-center gap-2">
				<input
					type="number"
					placeholder="Min cal"
					value={data.minCalories}
					onchange={(e) => onNutritionChange('minCalories', e)}
					class="p-2 border rounded-sm w-24 dark:bg-gray-900 bg-white"
					min="0"
				/>
				<input
					type="number"
					placeholder="Max cal"
					value={data.maxCalories}
					onchange={(e) => onNutritionChange('maxCalories', e)}
					class="p-2 border rounded-sm w-24 dark:bg-gray-900 bg-white"
					min="0"
				/>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="number"
					placeholder="Min prot"
					value={data.minProtein}
					onchange={(e) => onNutritionChange('minProtein', e)}
					class="p-2 border rounded-sm w-24 dark:bg-gray-900 bg-white"
					min="0"
				/>
				<input
					type="number"
					placeholder="Max prot"
					value={data.maxProtein}
					onchange={(e) => onNutritionChange('maxProtein', e)}
					class="p-2 border rounded-sm w-24 dark:bg-gray-900 bg-white"
					min="0"
				/>
			</div>
		</div>
	</div>

	{#if !data.recipes.total}
		<p class="italic">No recipes</p>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
		{#each data.recipes.data as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>

	<div class="flex justify-center py-5">
		<Pagination
			total={data.recipes.total}
			page={data.recipes.page}
			perPage={data.recipes.perPage}
		/>
	</div>
</div>
