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

<div class="p-5">
	<h1 class="font-semibold text-2xl mb-2">Add Recipe</h1>
	<p class="mb-2">
		Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe nostrum magni fugiat neque
		ducimus, quidem, accusantium ipsum enim amet numquam dolor natus expedita perferendis laborum
		animi. Quibusdam, odio beatae! Possimus!
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
		<div class="pb-4 last:pb-0">
			<label for="url" class="font-semibold pb-2 block">URL</label>
			<input
				type="text"
				id="url"
				name="url"
				value={form?.inputs?.url ?? ''}
				placeholder="URL"
				class="block border-2 border-gray-200 rounded w-full p-3 bg-slate-50 focus:border-red-400 outline-none hover:border-gray-300"
			/>
			{#if form?.errors?.url}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.url}</div>
			{/if}
		</div>
		<div class="pb-4 last:pb-0">
			<label for="categories" class="font-semibold pb-2 block">Categories</label>
			<input type="hidden" id="categories" name="categories" bind:value={selectedCategoriesValue} />
			<div class="flex gap-2">
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
		<div class="pb-4 last:pb-0">
			<label for="tags" class="font-semibold pb-2 block">Tags</label>
			<input type="hidden" id="tags" name="tags" bind:value={selectedTagsValue} />
			<div class="flex gap-2">
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
		<div class="pb-4 last:pb-0">
			<button
				type="submit"
				disabled={submitting}
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-300"
			>
				<span class:hidden={!submitting}>
					<Icon icon="ph:circle-notch" color="#fff" width="1.5rem" class="animate-spin" />
				</span>
				<span class:hidden={submitting}>Add</span>
			</button>
		</div>
	</form>
</div>
