<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ActionData, PageData } from './$types';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Modal from '$lib/components/Modal.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { ISearch, ISearchRecipe } from '$lib/types';
	import { debounce } from 'lodash-es';

	export let data: PageData;

	export let form: ActionData;

	let showDeleteModal = false;
	let showAddLinkRecipeModal = false;

	let addedLinkRecipes: ISearchRecipe[] = [];
	let addedLinkRecipesUuids: string[] = [];
	let searchInput = '';
	let isSearching = false;
	let searchResults: ISearch<ISearchRecipe> | undefined;

	$: if (addedLinkRecipes) {
		addedLinkRecipesUuids = addedLinkRecipes.map((r) => r.id);
	}

	onMount(() => {
		addedLinkRecipes = (data.shoppingList.recipes || []).map((r) => ({
			categories: r.categories.map((c) => c.name),
			createdByUuid: '',
			description: r.data.description,
			id: r.uuid,
			imageUrl: r.data.image,
			ingredients: [],
			rating: 0,
			slug: r.slug,
			tags: r.tags.map((t) => t.name),
			title: r.data.title
		}));
	});

	const handleAddLinkRecipe = (searchDoc: ISearchRecipe) => {
		if (addedLinkRecipes.find((r) => r.id === searchDoc.id)) {
			showAddLinkRecipeModal = false;
			return;
		}
		addedLinkRecipes = [...addedLinkRecipes, { ...searchDoc }];
		showAddLinkRecipeModal = false;
	};

	const handleRemoveLinkRecipe = (id: string) => {
		addedLinkRecipes = addedLinkRecipes.filter((r) => r.id !== id);
	};

	const handleSearchInput = debounce(async () => {
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

	$: if (searchInput) {
		handleSearchInput();
	} else {
		searchResults = undefined;
	}
</script>

<svelte:head>
	<title>{data.shoppingList.title} - Edit - Shopping Lists - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex items-center justify-between mb-5">
		<h1 class="text-2xl font-bold">Edit Shopping List</h1>
		<button
			title="Delete"
			on:click={() => {
				showDeleteModal = true;
			}}
			class="hover:bg-gray-200 p-1 rounded"
		>
			<span class="sr-only">Delete</span>
			<Icon icon="ph:trash" color="#ef4444" width="1.5rem" />
		</button>
	</div>

	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}

	<form method="post" action="?/edit" use:enhance>
		<div class="pb-5 last:pb-0">
			<label for="title" class="font-semibold pb-2 block">Title</label>
			<input
				type="text"
				id="title"
				name="title"
				value={form?.inputs?.title ?? data.shoppingList.title}
				placeholder="Title"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
			/>
			{#if form?.errors?.title}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.title}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0">
			<label for="ingredients" class="font-semibold pb-2 block">Ingredients</label>
			<textarea
				name="ingredients"
				id="ingredients"
				placeholder="Ingredients"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
				value={form?.inputs?.ingredients ?? (data.shoppingList.ingredients || []).join('\n\n')}
				rows="20"
			></textarea>
			<p class="text-sm text-gray-500 pt-1">
				Split up the ingredients by putting an empty line in between. To make the text input bigger,
				drag down in the bottom right.
			</p>
			{#if form?.errors?.data?.ingredients}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.data?.ingredients}</div>
			{/if}
		</div>

		<div class="pb-5 last:pb-0 -mt-1">
			<label for="recipeUuids" class="font-semibold flex items-center gap-2 pb-2">
				<span>Linked Recipes</span>
				<button
					type="button"
					title="Link Recipe"
					class="hover:bg-gray-200 p-1 rounded"
					on:click={() => {
						showAddLinkRecipeModal = true;
					}}
				>
					<span class="sr-only">Link Recipe</span>
					<Icon icon="ph:plus" color="#000" width="1.5rem" />
				</button>
			</label>
			<input type="hidden" id="recipeUuids" name="recipeUuids" bind:value={addedLinkRecipesUuids} />
			{#if !(addedLinkRecipes || []).length}
				<p class="italic">No linked recipes</p>
			{/if}
			<div class="flex flex-col gap-3">
				{#each addedLinkRecipes as recipe}
					<div class="border rounded flex flex-col md:flex-row">
						<div
							style={`background-image: url("${recipe.imageUrl}")`}
							class="bg-center bg-no-repeat bg-cover w-full md:w-60 h-28"
						></div>
						<div class="p-3 flex-1">
							<h3 class="mb-3 flex items-center justify-between">
								<a href={`/recipes/${recipe.slug}`} class="hover:underline">{recipe.title}</a>
								<button
									type="button"
									title="Remove Recipe"
									class="hover:bg-gray-200 p-1 rounded"
									on:click={() => {
										handleRemoveLinkRecipe(recipe.id);
									}}
								>
									<span class="sr-only">Remove Recipe</span>
									<Icon icon="ph:x" color="#000" width="1.1rem" />
								</button>
							</h3>
							<div class="flex items-start gap-2 mb-3">
								<div title="Categories">
									<Icon icon="ph:folder" color="#f97316" width="1.2rem" />
								</div>
								<div class="flex flex-wrap gap-1 text-sm italic">
									{#if recipe.categories && recipe.categories.length}
										{#each recipe.categories as category}
											<div class="after:content-[','] last:after:content-['']">
												{category}
											</div>
										{/each}
									{:else}
										<div>Uncategorized</div>
									{/if}
								</div>
							</div>
							<div class="flex items-start gap-2">
								<div title="Tags">
									<Icon icon="ph:tag" color="#f97316" width="1.2rem" />
								</div>
								<div class="flex flex-wrap gap-1 text-sm italic">
									{#if recipe.tags && recipe.tags.length}
										{#each recipe.tags as tag}
											<div class="after:content-[','] last:after:content-['']">
												{tag}
											</div>
										{/each}
									{:else}
										<div>Untagged</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="pb-5 last:pb-0">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Save</button
			>
		</div>
	</form>
</div>

<Modal bind:show={showDeleteModal}>
	<div class="text-xl font-semibold">Delete Shopping List</div>
	{#if form?.deleteMessage}
		<div class="py-2">
			<Alert variant={form?.deleteMessageType || 'error'}>
				{form?.deleteMessage}
			</Alert>
		</div>
	{/if}
	<p class="py-3 pb-5">Click the button below to permanently delete the shopping list.</p>
	<form method="post" action="?/delete">
		<button type="submit" class="p-3 bg-red-500 text-white rounded hover:bg-red-600">
			Delete
		</button>
	</form>
</Modal>

<Modal bind:show={showAddLinkRecipeModal}>
	<h4 class="text-xl font-bold mb-3">Link Recipe</h4>
	<p class="mb-5">Search for a recipe and link it to the shopping list.</p>

	<div>
		<label for="search" class="font-semibold pb-2 block">Search</label>
		<div
			class="flex border-2 border-slate-200 rounded w-full focus:border-orange-500 outline-none hover:border-slate-300"
		>
			<input
				bind:value={searchInput}
				type="text"
				id="search"
				name="search"
				placeholder="Search"
				class="p-3 w-full rounded outline-none"
			/>
			<button type="button" class="rounded-r px-3 hover:bg-slate-100" on:click={handleSearchInput}>
				<span class="sr-only">Search</span>
				<span class:hidden={isSearching}>
					<Icon icon="ph:magnifying-glass" width="1.4rem" color="#000" />
				</span>
				<span class:hidden={!isSearching}>
					<Icon icon="ph:circle-notch" color="#000" width="1.4rem" class="animate-spin" />
				</span>
			</button>
		</div>
	</div>

	<div
		class="flex flex-col gap-3 mt-5 max-h-96 overflow-auto"
		class:hidden={!searchResults || !searchResults.found}
	>
		{#each searchResults?.hits || [] as hit}
			<button
				type="submit"
				class="flex flex-col sm:flex-row gap-5 border rounded p-3 hover:bg-gray-50 w-full"
				on:click={() => {
					handleAddLinkRecipe(hit.document);
				}}
			>
				<div
					style={`background-image: url("${hit.document.imageUrl}")`}
					class="bg-center bg-no-repeat bg-cover w-full h-24 rounded basis-32"
				></div>
				<div>
					<h4 class="mb-3 flex text-left gap-2">
						<span>{@html hit.highlight.title.snippet}</span>
						<a
							href={`/recipes/${hit.document.slug}`}
							target="_blank"
							class="hover:bg-gray-200 p-1 rounded"
							on:click={(e) => {
								e.stopPropagation();
							}}
						>
							<span class="sr-only">Open recipe</span>
							<Icon icon="ph:link" width="1rem" color="#000" />
						</a>
					</h4>
					<div class="flex items-start gap-2 mb-3">
						<div title="Categories">
							<Icon icon="ph:folder" color="#f97316" width="1.2rem" />
						</div>
						<div class="flex flex-wrap gap-1 text-sm italic">
							{#if hit.document.categories.length}
								{#each hit.document.categories as category}
									<div class="after:content-[','] last:after:content-['']">{category}</div>
								{/each}
							{:else}
								<div>Uncategorized</div>
							{/if}
						</div>
					</div>
					<div class="flex items-start gap-2">
						<div title="Tags">
							<Icon icon="ph:tag" color="#f97316" width="1.2rem" />
						</div>
						<div class="flex flex-wrap gap-1 text-sm italic">
							{#if hit.document.tags.length}
								{#each hit.document.tags as tag}
									<div class="after:content-[','] last:after:content-['']">{tag}</div>
								{/each}
							{:else}
								<div>Untagged</div>
							{/if}
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</Modal>
