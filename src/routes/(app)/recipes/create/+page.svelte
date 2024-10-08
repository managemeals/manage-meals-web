<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { ActionData, PageData } from './$types';
	import type { ICategory, ITag } from '$lib/types';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	export let form: ActionData;

	let showCreateCategoryModal = false;
	let showCreateTagModal = false;

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

	$: if (form?.createCategorySlug) {
		showCreateCategoryModal = false;
	}

	$: if (form?.createTagSlug) {
		showCreateTagModal = false;
	}
</script>

<svelte:head>
	<title>Create Recipe - Recipes - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pb-20">
	<h1 class="text-2xl font-bold mb-5">Create Recipe</h1>

	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}

	<form method="post" action="?/create" use:enhance>
		<div class="pb-5 last:pb-0">
			<label for="data.title" class="font-semibold pb-2 block">Title</label>
			<input
				type="text"
				id="data.title"
				name="data.title"
				value={form?.inputs?.data?.title ?? ''}
				placeholder="Title"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
			/>
			{#if form?.errors?.data?.title}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.title}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0 -mt-1">
			<label for="categories" class="font-semibold flex items-center gap-2">
				<span>Categories</span>
				<button
					type="button"
					title="Create Category"
					class="hover:bg-gray-200 p-1 rounded"
					on:click={() => {
						showCreateCategoryModal = true;
					}}
				>
					<Icon icon="ph:plus" color="#000" width="1.5rem" />
				</button>
			</label>
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

		<div class="pb-5 last:pb-0 -mt-1">
			<label for="tags" class="font-semibold flex items-center gap-2">
				<span>Tags</span>
				<button
					type="button"
					title="Create Tag"
					class="hover:bg-gray-200 p-1 rounded"
					on:click={() => {
						showCreateTagModal = true;
					}}
				>
					<Icon icon="ph:plus" color="#000" width="1.5rem" />
				</button>
			</label>
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
			<label for="data.description" class="font-semibold pb-2 block">Description</label>
			<textarea
				name="data.description"
				id="data.description"
				placeholder="Description"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
				value={form?.inputs?.data?.description ?? ''}
				rows="6"
			></textarea>
			{#if form?.errors?.data?.description}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.description}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0">
			<label for="data.canonical_url" class="font-semibold pb-2 block">Canonical URL</label>
			<input
				type="text"
				id="data.canonical_url"
				name="data.canonical_url"
				value={form?.inputs?.data?.canonical_url ?? ''}
				placeholder="Canonical URL"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
			/>
			<p class="text-sm text-gray-500 pt-1">Where the recipe was imported from</p>
			{#if form?.errors?.data?.canonical_url}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.canonical_url}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0">
			<div class="flex flex-col sm:flex-row gap-5">
				<div class="grow">
					<label for="data.cook_time" class="font-semibold pb-2 block">Cook time (minutes)</label>
					<input
						type="text"
						id="data.cook_time"
						name="data.cook_time"
						value={form?.inputs?.data?.cook_time ?? ''}
						placeholder="Cook time"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.cook_time}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.cook_time}</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.prep_time" class="font-semibold pb-2 block">Prep time (minutes)</label>
					<input
						type="text"
						id="data.prep_time"
						name="data.prep_time"
						value={form?.inputs?.data?.prep_time ?? ''}
						placeholder="Prep time"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.prep_time}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.prep_time}</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<div class="flex flex-col sm:flex-row gap-5">
				<div class="grow">
					<label for="data.total_time" class="font-semibold pb-2 block">Total time (minutes)</label>
					<input
						type="text"
						id="data.total_time"
						name="data.total_time"
						value={form?.inputs?.data?.total_time ?? ''}
						placeholder="Total time"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.total_time}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.total_time}</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.yields" class="font-semibold pb-2 block">Yields</label>
					<input
						type="text"
						id="data.yields"
						name="data.yields"
						value={form?.inputs?.data?.yields ?? ''}
						placeholder="Yields"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.yields}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.yields}</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<label for="data.ingredients" class="font-semibold pb-2 block">Ingredients</label>
			<textarea
				name="data.ingredients"
				id="data.ingredients"
				placeholder="Ingredients"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
				value={form?.inputs?.data?.ingredients ?? ''}
				rows="12"
			></textarea>
			<p class="text-sm text-gray-500 pt-1">
				Split up the ingredients by putting an empty line in between. To make the text input bigger,
				drag down in the bottom right.
			</p>
			{#if form?.errors?.data?.ingredients}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.ingredients}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0">
			<label for="data.instructions_list" class="font-semibold pb-2 block">Instructions</label>
			<textarea
				name="data.instructions_list"
				id="data.instructions_list"
				placeholder="Instructions"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
				value={form?.inputs?.data?.instructions_list ?? ''}
				rows="12"
			></textarea>
			<p class="text-sm text-gray-500 pt-1">
				Split up the steps by putting an empty line in between. To make the text input bigger, drag
				down in the bottom right.
			</p>
			{#if form?.errors?.data?.instructions_list}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.instructions_list}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0">
			<div class="flex flex-col sm:flex-row gap-5">
				<div class="grow">
					<label for="data.nutrients.calories" class="font-semibold pb-2 block">Calories</label>
					<input
						type="text"
						id="data.nutrients.calories"
						name="data.nutrients.calories"
						value={form?.inputs?.data?.nutrients?.calories ?? ''}
						placeholder="Calories"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.calories}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.nutrients?.calories}</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.nutrients.carbohydrateContent" class="font-semibold pb-2 block"
						>Carbohydrate</label
					>
					<input
						type="text"
						id="data.nutrients.carbohydrateContent"
						name="data.nutrients.carbohydrateContent"
						value={form?.inputs?.data?.nutrients?.carbohydrateContent ?? ''}
						placeholder="Carbohydrate"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.carbohydrateContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.carbohydrateContent}
						</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.nutrients.cholesterolContent" class="font-semibold pb-2 block"
						>Cholesterol</label
					>
					<input
						type="text"
						id="data.nutrients.cholesterolContent"
						name="data.nutrients.cholesterolContent"
						value={form?.inputs?.data?.nutrients?.cholesterolContent ?? ''}
						placeholder="Cholesterol"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.cholesterolContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.cholesterolContent}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<div class="flex flex-col sm:flex-row gap-5">
				<div class="grow">
					<label for="data.nutrients.fatContent" class="font-semibold pb-2 block">Fat</label>
					<input
						type="text"
						id="data.nutrients.fatContent"
						name="data.nutrients.fatContent"
						value={form?.inputs?.data?.nutrients?.fatContent ?? ''}
						placeholder="Fat"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.fatContent}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.nutrients?.fatContent}</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.nutrients.fiberContent" class="font-semibold pb-2 block">Fiber</label>
					<input
						type="text"
						id="data.nutrients.fiberContent"
						name="data.nutrients.fiberContent"
						value={form?.inputs?.data?.nutrients?.fiberContent ?? ''}
						placeholder="Fiber"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.fiberContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.fiberContent}
						</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.nutrients.proteinContent" class="font-semibold pb-2 block">Protein</label
					>
					<input
						type="text"
						id="data.nutrients.proteinContent"
						name="data.nutrients.proteinContent"
						value={form?.inputs?.data?.nutrients?.proteinContent ?? ''}
						placeholder="Protein"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.proteinContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.proteinContent}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<div class="flex flex-col sm:flex-row gap-5">
				<div class="grow">
					<label for="data.nutrients.saturatedFatContent" class="font-semibold pb-2 block"
						>Saturated fat</label
					>
					<input
						type="text"
						id="data.nutrients.saturatedFatContent"
						name="data.nutrients.saturatedFatContent"
						value={form?.inputs?.data?.nutrients?.saturatedFatContent ?? ''}
						placeholder="Saturated fat"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.saturatedFatContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.saturatedFatContent}
						</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.nutrients.sodiumContent" class="font-semibold pb-2 block">Sodium</label>
					<input
						type="text"
						id="data.nutrients.sodiumContent"
						name="data.nutrients.sodiumContent"
						value={form?.inputs?.data?.nutrients?.sodiumContent ?? ''}
						placeholder="Sodium"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.sodiumContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.sodiumContent}
						</div>
					{/if}
				</div>
				<div class="grow">
					<label for="data.nutrients.sugarContent" class="font-semibold pb-2 block">Sugar</label>
					<input
						type="text"
						id="data.nutrients.sugarContent"
						name="data.nutrients.sugarContent"
						value={form?.inputs?.data?.nutrients?.sugarContent ?? ''}
						placeholder="Sugar"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.sugarContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.sugarContent}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<div class="flex flex-col sm:flex-row gap-5">
				<div class="basis-1/3 sm:pr-2.5">
					<label for="data.nutrients.unsaturatedFatContent" class="font-semibold pb-2 block"
						>Unsaturated fat</label
					>
					<input
						type="text"
						id="data.nutrients.unsaturatedFatContent"
						name="data.nutrients.unsaturatedFatContent"
						value={form?.inputs?.data?.nutrients?.unsaturatedFatContent ?? ''}
						placeholder="Unsaturated fat"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.data?.nutrients?.unsaturatedFatContent}
						<div class="text-sm pt-1 text-red-500">
							{form?.errors?.data?.nutrients?.unsaturatedFatContent}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Create</button
			>
		</div>
	</form>
</div>

<Modal bind:show={showCreateCategoryModal}>
	<div class="text-xl font-semibold mb-5">Create Category</div>
	{#if form?.createCategoryMessage}
		<div class="py-4">
			<Alert variant={form?.createCategoryMessageType || 'error'}>
				{form?.createCategoryMessage}
			</Alert>
		</div>
	{/if}
	<form method="post" action="?/createcategory" use:enhance>
		<div class="pb-5 last:pb-0">
			<label for="name" class="font-semibold pb-2 block">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				value={form?.inputs?.createCategoryName ?? ''}
				placeholder="Name"
				class={`
				block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500
				outline-none hover:border-slate-300
				`.trim()}
			/>
			{#if form?.errors?.createCategoryName}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.createCategoryName}</div>
			{/if}
		</div>
		<div class="pb-5 last:pb-0">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Create</button
			>
		</div>
	</form>
</Modal>

<Modal bind:show={showCreateTagModal}>
	<div class="text-xl font-semibold mb-5">Create Tag</div>
	{#if form?.createTagMessage}
		<div class="py-4">
			<Alert variant={form?.createTagMessageType || 'error'}>
				{form?.createTagMessage}
			</Alert>
		</div>
	{/if}
	<form method="post" action="?/createtag" use:enhance>
		<div class="pb-5 last:pb-0">
			<label for="name" class="font-semibold pb-2 block">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				value={form?.inputs?.createTagName ?? ''}
				placeholder="Name"
				class={`
				block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500
				outline-none hover:border-slate-300
				`.trim()}
			/>
			{#if form?.errors?.createTagName}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.createTagName}</div>
			{/if}
		</div>
		<div class="pb-5 last:pb-0">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Create</button
			>
		</div>
	</form>
</Modal>
