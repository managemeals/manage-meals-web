<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import type { ActionData, PageData } from './$types';
	import { format } from 'date-fns';
	import Toggle from '$lib/components/Toggle.svelte';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import type { IShareRecipe } from '$lib/types';

	export let data: PageData;

	export let form: ActionData;

	let toggleWakelock = false;
	let hasWakeLock = false;
	// eslint-disable-next-line no-undef
	let wakeLock: WakeLockSentinel | undefined;
	let showWakeLockModal = false;
	let wakeLockError = '';
	let hasWakeLockListener = false;
	let showShoppingListModal = false;
	let showShareModal = false;
	let recipeShares: IShareRecipe[] = [];
	let loadingRecipeShares = false;

	const handleWakeLockRelease = () => {
		toggleWakelock = false;
	};

	const handleWakeLockToggle = async (toggled: boolean) => {
		wakeLockError = '';
		if (toggled) {
			try {
				wakeLock = await navigator.wakeLock.request('screen');
				if (!hasWakeLockListener) {
					wakeLock.addEventListener('release', handleWakeLockRelease);
					hasWakeLockListener = true;
				}
			} catch (e) {
				wakeLockError = `${(e as Error).name}, ${(e as Error).message}`;
				showWakeLockModal = true;
				toggleWakelock = false;
			}
		} else {
			if (wakeLock) {
				try {
					wakeLock.removeEventListener('release', handleWakeLockRelease);
					hasWakeLockListener = false;
				} catch (e) {
					console.error(e);
				}
				try {
					await wakeLock.release();
					wakeLock = undefined;
				} catch (e) {
					console.error(e);
				}
			}
		}
	};

	onMount(() => {
		if ('wakeLock' in navigator) {
			hasWakeLock = true;
		}

		return async () => {
			await handleWakeLockToggle(false);
		};
	});

	$: handleWakeLockToggle(toggleWakelock);

	const loadRecipeShares = async () => {
		loadingRecipeShares = true;
		try {
			const res = await fetch(`/api/recipes/${data.recipe.slug}/shares`);
			const shareRecipes = await res.json();
			recipeShares = shareRecipes;
		} catch (e) {
			recipeShares = [];
		} finally {
			loadingRecipeShares = false;
		}
	};

	$: if (showShareModal || form?.shareSlug || form?.shareDeleteSlug) {
		loadRecipeShares();
	}
</script>

<svelte:head>
	<title>{data.recipe.data.title} - Recipes - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div>
	<div class="sm:px-5">
		<div
			style={`background-image: url("${data.recipe.data.image}")`}
			class="bg-center bg-no-repeat bg-cover w-full h-64 lg:h-96 relative"
		>
			<div
				class="absolute right-0 bottom-0 left-0 md:left-auto overflow-auto bg-slate-100 opacity-90"
				class:hidden={!data.recipe.data.prep_time &&
					!data.recipe.data.cook_time &&
					!data.recipe.data.total_time}
			>
				<div class="flex items-center h-14">
					<div class="border-r-2 border-gray-300 h-full px-3 flex flex-col justify-center">
						<Icon icon="ph:clock" width="1.8rem" color="#4b5563" />
					</div>
					{#if data.recipe.data.prep_time}
						<div class="border-r-2 border-gray-300 h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 whitespace-nowrap">Prep time</div>
							<div class="whitespace-nowrap">{data.recipe.data.prep_time} minutes</div>
						</div>
					{/if}
					{#if data.recipe.data.cook_time}
						<div class="border-r-2 border-gray-300 h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 whitespace-nowrap">Cook time</div>
							<div class="whitespace-nowrap">{data.recipe.data.cook_time} minutes</div>
						</div>
					{/if}
					{#if data.recipe.data.total_time}
						<div class="h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 whitespace-nowrap">Total time</div>
							<div class="whitespace-nowrap">{data.recipe.data.total_time} minutes</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="p-5">
		<div class="flex justify-between mb-5 flex-col gap-3 md:flex-row">
			<div>
				<h1 class="font-semibold text-orange-500 text-2xl mb-3">{data.recipe.data.title}</h1>
				<div class="flex flex-col gap-3 lg:flex-row lg:gap-5">
					<div class="flex items-center gap-1">
						<div title="Categories">
							<Icon icon="ph:folder" color="#f97316" width="1.4rem" />
						</div>
						<div class="flex gap-1 flex-wrap">
							{#if data.recipe.categories && data.recipe.categories.length}
								{#each data.recipe.categories as category}
									<a
										href={`/categories/${category.slug}`}
										class="after:content-[','] last:after:content-[''] hover:underline italic"
										>{category.name}</a
									>
								{/each}
							{:else}
								<a
									href="/categories/uncategorized"
									class="after:content-[','] last:after:content-[''] hover:underline italic"
									>Uncategorized</a
								>
							{/if}
						</div>
					</div>
					<div class="flex items-center gap-1">
						<div title="Tags">
							<Icon icon="ph:tag" color="#f97316" width="1.4rem" />
						</div>
						<div class="flex gap-1 flex-wrap">
							{#if data.recipe.tags && data.recipe.tags.length}
								{#each data.recipe.tags as tag}
									<a
										href={`/tags/${tag.slug}`}
										class="after:content-[','] last:after:content-[''] hover:underline italic"
										>{tag.name}</a
									>
								{/each}
							{:else}
								<a
									href="/tags/untagged"
									class="after:content-[','] last:after:content-[''] hover:underline italic"
									>Untagged</a
								>
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div class="flex items-start gap-2">
				<button
					type="button"
					title="Share"
					class="hover:bg-gray-200 p-1 rounded"
					on:click={() => {
						showShareModal = true;
					}}
				>
					<Icon icon="ph:share-network" color="#3b82f6" width="1.4rem" />
				</button>
				<button
					type="button"
					title="Shopping list"
					class="hover:bg-gray-200 p-1 rounded"
					on:click={() => {
						showShoppingListModal = true;
					}}
				>
					<Icon icon="ph:shopping-cart" color="#3b82f6" width="1.4rem" />
				</button>
				<a
					href={`/recipes/${data.recipe.slug}/edit`}
					title="Edit"
					class="hover:bg-gray-200 p-1 rounded"
				>
					<Icon icon="ph:pencil" color="#3b82f6" width="1.4rem" />
				</a>
			</div>
		</div>

		{#if data.recipe.data.description}
			<p class="mb-5">{data.recipe.data.description}</p>
		{/if}

		{#if data.recipe.data.yields}
			<div class="mb-5">
				<span class="font-semibold text-orange-500 uppercase">Yield:</span>
				{data.recipe.data.yields}
			</div>
		{/if}

		{#if hasWakeLock}
			<div class="mb-3">
				<Toggle label="Prevent screen from turning off" bind:checked={toggleWakelock} />
			</div>
		{/if}

		<div class="flex flex-col md:flex-row gap-5 mb-5">
			<div class="basis-1/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Ingredients</h3>
				<ul class="list-disc list-inside">
					{#each data.recipe.data.ingredients || [] as ingredient}
						<li class="mb-3 last:mb-0">{ingredient}</li>
					{/each}
				</ul>
			</div>
			<div class="basis-2/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Directions</h3>
				<ol class="list-decimal list-inside">
					{#each data.recipe.data.instructions_list || [] as instruction}
						<li class="mb-3 last:mb-0">{instruction}</li>
					{/each}
				</ol>
			</div>
		</div>

		{#if data.recipe.data.nutrients && Object.keys(data.recipe.data.nutrients).length && !Object.values(data.recipe.data.nutrients).every((k) => k === '')}
			<div class="mb-5">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Nutrition</h3>
				<div class="overflow-auto">
					<table>
						<tbody>
							{#if data.recipe.data.nutrients?.calories}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Calories</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.calories}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.carbohydrateContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Carbohydrate</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.carbohydrateContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.cholesterolContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Cholesterol</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.cholesterolContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.fatContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Fat</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.fatContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.fiberContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Fiber</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.fiberContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.proteinContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Protein</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.proteinContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.saturatedFatContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Saturated fat</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.saturatedFatContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.sodiumContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Sodium</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.sodiumContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.sugarContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Sugar</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.sugarContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.unsaturatedFatContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Unsaturated fat</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.unsaturatedFatContent}</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<div class="flex flex-col gap-3 md:flex-row md:gap-5 justify-end pt-5 text-sm">
			<div class="flex items-center gap-1">
				<Icon icon="ph:calendar-blank" width="1.4rem" />
				<div title={data.recipe.createdAt}>{format(data.recipe.createdAt, 'd MMM yyyy')}</div>
			</div>
			{#if data.recipe.data.canonical_url}
				<div class="flex items-center gap-1">
					<Icon icon="ph:arrow-square-out" width="1.4rem" color="#3b82f6" />
					<a
						href={data.recipe.data.canonical_url}
						target="_blank"
						class="text-blue-500 hover:underline"
					>
						{data.recipe.data.host ? data.recipe.data.host : data.recipe.data.canonical_url}
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<Modal bind:show={showWakeLockModal}>
	<Alert variant="error">{wakeLockError}</Alert>
</Modal>

<Modal bind:show={showShoppingListModal}>
	<h4 class="text-xl font-bold mb-3">Create Shopping List</h4>
	<p class="mb-3">
		Create a shopping list from the recipe <span class="font-bold">{data.recipe.data.title}</span>.
	</p>
	{#if form?.shoppingListMessage}
		<div class="py-4">
			<Alert variant={form?.shoppingListMessageType || 'error'}>
				{form?.shoppingListMessage}
			</Alert>
		</div>
	{/if}
	<form method="post" action="?/shoppinglist" use:enhance>
		<input type="hidden" id="title" name="title" value={data.recipe.data.title} />
		<input type="hidden" id="recipeUuids" name="recipeUuids" value={data.recipe.uuid} />
		<input
			type="hidden"
			id="ingredients"
			name="ingredients"
			value={data.recipe.data.ingredients.join('|||')}
		/>
		<div>
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>
				Create
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showShareModal}>
	<h4 class="text-xl font-bold mb-3">Share Recipe</h4>
	<p class="mb-3">
		Get a sharable link to the recipe <span class="font-bold">{data.recipe.data.title}</span>.
		Anyone with the link can view the recipe, without having to register.
	</p>
	{#if form?.shareMessage}
		<div class="py-4">
			<Alert variant={form?.shareMessageType || 'error'}>
				{form?.shareMessage}
			</Alert>
		</div>
	{/if}
	<form method="post" action="?/share" use:enhance>
		<input type="hidden" id="recipeUuid" name="recipeUuid" value={data.recipe.uuid} />
		<div>
			<button
				type="submit"
				disabled={loadingRecipeShares || recipeShares.length > 0}
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>
				Share
			</button>
		</div>
	</form>
	<h5 class="font-bold mb-3 mt-3">Sharable Links</h5>
	{#if recipeShares.length < 1}
		<p class="italic">No sharable links have been created</p>
	{/if}
	<div class="flex flex-col gap-2">
		{#each recipeShares as recipeShare}
			<div class="flex items-center justify-between gap-2 border rounded p-2">
				<div>https://managemeals.com/share/recipes/{recipeShare.slug}</div>
				<div class="flex items-center gap-2">
					<button
						class="flex items-center gap-2 text-left hover:bg-gray-200 p-1 rounded"
						title="Copy"
						on:click={async () => {
							await window.navigator.clipboard.writeText(
								`https://managemeals.com/share/recipes/${recipeShare.slug}`
							);
						}}
					>
						<Icon icon="ph:copy" color="#000" width="1.5rem" />
					</button>
					<form method="post" action="?/deleteshare" use:enhance>
						<input type="hidden" id="slug" name="slug" value={recipeShare.slug} />
						<button class="hover:bg-gray-200 p-1 rounded" title="Delete">
							<Icon icon="ph:x" color="#000" width="1.2rem" />
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</Modal>
