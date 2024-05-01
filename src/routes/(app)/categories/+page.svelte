<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { page as storePage } from '$app/stores';

	export let data: PageData;

	let categoriesBtnEl: HTMLButtonElement;
	let tagsBtnEl: HTMLButtonElement;

	let showCategoriesDropdown = false;
	let showTagsDropdown = false;
</script>

<svelte:head>
	<title>Categories - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex flex-col xl:flex-row gap-3 mb-5">
		<div class="flex items-center gap-3">
			<h1 class="text-2xl font-bold">All Categories</h1>
			<div class="text-sm text-gray-500">{data.recipes.total} recipes</div>
		</div>

		<div class="flex flex-col md:flex-row gap-3">
			<div class="relative">
				<button
					bind:this={categoriesBtnEl}
					on:click={() => (showCategoriesDropdown = !showCategoriesDropdown)}
					class="p-2 border rounded hover:bg-gray-100 flex items-center gap-2 justify-between w-full md:w-auto"
				>
					<div class="whitespace-nowrap overflow-hidden text-left w-full md:w-60 2xl:w-72">
						{data.selectedCategories.join(', ')}
					</div>
					<Icon icon="ph:caret-down" color="#000" width="1.2rem" />
				</button>
				{#if categoriesBtnEl}
					<div
						class="absolute left-0 right-0 w-full top-full bg-white shadow-lg flex flex-col rounded border z-10 max-h-96 overflow-auto"
						class:hidden={!showCategoriesDropdown}
						use:clickOutside={[categoriesBtnEl]}
						on:clickoutside={() => {
							showCategoriesDropdown = false;
						}}
					>
						{#each data.categories as category}
							<a
								on:click={() => {
									showCategoriesDropdown = false;
								}}
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
								class={`flex justify-between items-center w-full p-3 hover:bg-gray-100 first:rounded-t last:rounded-b${data.selectedCategoriesSlugs.includes(category.slug) ? ' bg-gray-100' : ''}`}
							>
								<span>{category.name}</span>
								<span class:hidden={!data.selectedCategoriesSlugs.includes(category.slug)}>
									<Icon icon="ph:x" color="#000" width="1.1rem" />
								</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="relative">
				<button
					bind:this={tagsBtnEl}
					on:click={() => (showTagsDropdown = !showTagsDropdown)}
					class="p-2 border rounded hover:bg-gray-100 flex items-center gap-2 justify-between w-full md:w-auto"
				>
					<div class="whitespace-nowrap overflow-hidden text-left w-full md:w-60 2xl:w-72">
						{data.selectedTags.join(', ')}
					</div>
					<Icon icon="ph:caret-down" color="#000" width="1.2rem" />
				</button>
				{#if tagsBtnEl}
					<div
						class="absolute left-0 right-0 w-full top-full bg-white shadow-lg flex flex-col rounded border z-10 max-h-96 overflow-auto"
						class:hidden={!showTagsDropdown}
						use:clickOutside={[tagsBtnEl]}
						on:clickoutside={() => {
							showTagsDropdown = false;
						}}
					>
						{#each data.tags as tag}
							<a
								on:click={() => {
									showTagsDropdown = false;
								}}
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
								class={`flex justify-between items-center w-full p-3 hover:bg-gray-100 first:rounded-t last:rounded-b${data.selectedTagsSlugs.includes(tag.slug) ? ' bg-gray-100' : ''}`}
							>
								<span>{tag.name}</span>
								<span class:hidden={!data.selectedTagsSlugs.includes(tag.slug)}>
									<Icon icon="ph:x" color="#000" width="1.1rem" />
								</span>
							</a>
						{/each}
					</div>
				{/if}
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
