<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import type { ActionData, PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import Icon from '@iconify/svelte';
	import type { ICategory, ITag } from '$lib/types';

	export let form: ActionData;

	export let data: PageData;

	let submitting = false;

	let selectedCategories: string[] = [];
	let selectedTags: string[] = [];

	$: selectedCategoriesValue = selectedCategories.join(',');
	$: selectedTagsValue = selectedTags.join(',');

	const handleAddCategory = (category: ICategory) => {
		if (selectedCategories.includes(category.uuid)) {
			selectedCategories = selectedCategories.filter((c) => c !== category.uuid);
		} else {
			selectedCategories = [...selectedCategories, category.uuid];
		}
	};

	const handleAddTag = (tag: ITag) => {
		if (selectedTags.includes(tag.uuid)) {
			selectedTags = selectedTags.filter((c) => c !== tag.uuid);
		} else {
			selectedTags = [...selectedTags, tag.uuid];
		}
	};
</script>

<svelte:head>
	<title>Add Recipe - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 container">
	<h1 class="text-2xl font-bold mb-5">Add Recipe</h1>
	<p class="mb-3">
		Enter the URL of the recipe you want to save. <em>ManageMeals</em> will then attempt to retrieve
		the recipe from the site and add it to your collection. It works with all popular recipe
		websites, and many smaller ones. If it's not working for your URL, please
		<a href="/help/contact" class="hover:underline text-blue-500">contact us</a> and we will add support
		for it.
	</p>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form
		method="post"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
	>
		<div class="pb-5 last:pb-0">
			<label for="url" class="font-semibold pb-2 block">URL</label>
			<input
				type="text"
				id="url"
				name="url"
				value={form?.inputs?.url ?? ''}
				placeholder="https://www.bbcgoodfood.com/recipes/chicken-leek-brown-rice-stir-fry"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
			/>
			{#if form?.errors?.url}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.url}</div>
			{/if}
		</div>
		<div class="pb-5 last:pb-0">
			<label for="categories" class="font-semibold block">Categories</label>
			<p class="text-sm text-gray-500">Optionally choose any categories to add the recipe to</p>
			<input type="hidden" id="categories" name="categories" bind:value={selectedCategoriesValue} />
			<div class="flex gap-2 flex-wrap pt-3">
				{#each data.categories as category}
					<div>
						<button
							class={`p-2 border rounded ${selectedCategories.includes(category.uuid) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
							type="button"
							on:click={() => {
								handleAddCategory(category);
							}}>{category.name}</button
						>
					</div>
				{/each}
			</div>
		</div>
		<div class="pb-5 last:pb-0">
			<label for="tags" class="font-semibold block">Tags</label>
			<p class="text-sm text-gray-500">Optionally choose any tags to tag the recipe with</p>
			<input type="hidden" id="tags" name="tags" bind:value={selectedTagsValue} />
			<div class="flex gap-2 flex-wrap pt-3">
				{#each data.tags as tag}
					<div>
						<button
							class={`p-2 border rounded ${selectedTags.includes(tag.uuid) ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}
							type="button"
							on:click={() => {
								handleAddTag(tag);
							}}>{tag.name}</button
						>
					</div>
				{/each}
			</div>
		</div>
		<div class="pb-5 last:pb-0">
			<button
				type="submit"
				disabled={submitting}
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>
				<span class:hidden={!submitting}>
					<Icon icon="ph:circle-notch" color="#fff" width="1.5rem" class="animate-spin" />
				</span>
				<span class:hidden={submitting}>Add</span>
			</button>
		</div>
	</form>
</div>
