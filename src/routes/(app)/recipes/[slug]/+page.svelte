<script lang="ts">
	import { run } from 'svelte/legacy';

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

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let toggleWakelock = $state(false);
	let hasWakeLock = $state(false);
	// eslint-disable-next-line no-undef
	let wakeLock: WakeLockSentinel | undefined;
	let showWakeLockModal = $state(false);
	let wakeLockError = $state('');
	let hasWakeLockListener = false;
	let showShoppingListModal = $state(false);
	let showShareModal = $state(false);
	let showCookbookModal = $state(false);
	let recipeShares: IShareRecipe[] = $state([]);
	let loadingRecipeShares = $state(false);
	let multiplier = $state(1);

	const UNICODE_FRACTIONS: Record<string, number> = {
		'¼': 0.25,
		'½': 0.5,
		'¾': 0.75,
		'⅓': 1 / 3,
		'⅔': 2 / 3,
		'⅛': 0.125,
		'⅜': 0.375,
		'⅝': 0.625,
		'⅞': 0.875,
		'⅕': 0.2,
		'⅖': 0.4,
		'⅗': 0.6,
		'⅘': 0.8,
		'⅙': 1 / 6,
		'⅚': 5 / 6
	};

	const SNAP_FRACTIONS: [number, string][] = [
		[1 / 8, '⅛'],
		[1 / 6, '⅙'],
		[1 / 5, '⅕'],
		[1 / 4, '¼'],
		[1 / 3, '⅓'],
		[3 / 8, '⅜'],
		[2 / 5, '⅖'],
		[1 / 2, '½'],
		[3 / 5, '⅗'],
		[2 / 3, '⅔'],
		[3 / 4, '¾'],
		[4 / 5, '⅘'],
		[5 / 6, '⅚'],
		[7 / 8, '⅞']
	];

	const UNICODE_FRAC_CHARS = Object.keys(UNICODE_FRACTIONS).join('');
	const QTY_RE = new RegExp(
		`^(\\d+\\s+\\d+\\/\\d+|\\d+[${UNICODE_FRAC_CHARS}]|\\d+\\/\\d+|[${UNICODE_FRAC_CHARS}]|\\d+(?:\\.\\d+)?)(?=\\s|$)`
	);

	function parseQuantityStr(q: string): number {
		const mixedAscii = q.match(/^(\d+)\s+(\d+)\/(\d+)$/);
		if (mixedAscii)
			return parseInt(mixedAscii[1]) + parseInt(mixedAscii[2]) / parseInt(mixedAscii[3]);
		const mixedUnicode = q.match(new RegExp(`^(\\d+)([${UNICODE_FRAC_CHARS}])$`));
		if (mixedUnicode) return parseInt(mixedUnicode[1]) + UNICODE_FRACTIONS[mixedUnicode[2]];
		const asciiFrac = q.match(/^(\d+)\/(\d+)$/);
		if (asciiFrac) return parseInt(asciiFrac[1]) / parseInt(asciiFrac[2]);
		if (UNICODE_FRACTIONS[q] !== undefined) return UNICODE_FRACTIONS[q];
		return parseFloat(q);
	}

	function formatQuantity(value: number): string {
		if (value <= 0) return '';
		const whole = Math.floor(value);
		const frac = value - whole;
		if (frac < 0.01) return whole.toString();
		for (const [fracVal, symbol] of SNAP_FRACTIONS) {
			if (Math.abs(frac - fracVal) < 0.05) {
				return whole > 0 ? `${whole}${symbol}` : symbol;
			}
		}
		return value % 1 === 0 ? value.toString() : value.toFixed(1);
	}

	function scaleIngredient(ingredient: string, scale: number): string {
		if (scale === 1) return ingredient;
		// Handle dual-unit format: "800g / 28 oz text" or "60g / 4 tbsp text"
		// Requires a unit letter between the first number and the "/" to avoid
		// matching ASCII fractions like "1/2 cup".
		const dualMatch = ingredient.match(
			/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)(\s*\/\s*)(\d+(?:\.\d+)?)(.*)/
		);
		if (dualMatch) {
			const [, num1, unit1, sep, num2, rest] = dualMatch;
			return `${formatQuantity(parseFloat(num1) * scale)}${unit1}${sep}${formatQuantity(parseFloat(num2) * scale)}${rest}`;
		}
		// Metric-only: "225ml chicken stock" or "85g cheese"
		// No \s* between number and unit — avoids matching "2 skinless chicken breasts"
		const metricMatch = ingredient.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)(.*)/);
		if (metricMatch) {
			const [, num, unit, rest] = metricMatch;
			return `${formatQuantity(parseFloat(num) * scale)}${unit}${rest}`;
		}
		const match = ingredient.match(QTY_RE);
		if (!match) return ingredient;
		const original = match[1];
		const scaled = parseQuantityStr(original) * scale;
		return formatQuantity(scaled) + ingredient.slice(original.length);
	}

	function formatMultiplier(m: number): string {
		const whole = Math.floor(m);
		const frac = m - whole;
		const fracStr = frac > 0.4 && frac < 0.6 ? '½' : '';
		return (whole > 0 ? `${whole}` : '') + fracStr + '×';
	}

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

	run(() => {
		handleWakeLockToggle(toggleWakelock);
	});

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

	run(() => {
		if (showShareModal || form?.shareSlug || form?.shareDeleteSlug) {
			loadRecipeShares();
		}
	});
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
				class="absolute right-0 bottom-0 left-0 md:left-auto overflow-auto bg-slate-100 dark:bg-gray-800 opacity-90"
				class:hidden={!data.recipe.data.prep_time &&
					!data.recipe.data.cook_time &&
					!data.recipe.data.total_time}
			>
				<div class="flex items-center h-14">
					<div
						class="border-r-2 border-gray-300 dark:border-gray-600 h-full px-3 flex flex-col justify-center"
					>
						<Icon icon="ph:clock" width="1.8rem" color="#4b5563" />
					</div>
					{#if data.recipe.data.prep_time}
						<div
							class="border-r-2 border-gray-300 dark:border-gray-600 h-full px-3 flex flex-col justify-center"
						>
							<div class="uppercase text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
								Prep time
							</div>
							<div class="whitespace-nowrap">{data.recipe.data.prep_time} minutes</div>
						</div>
					{/if}
					{#if data.recipe.data.cook_time}
						<div
							class="border-r-2 border-gray-300 dark:border-gray-600 h-full px-3 flex flex-col justify-center"
						>
							<div class="uppercase text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
								Cook time
							</div>
							<div class="whitespace-nowrap">{data.recipe.data.cook_time} minutes</div>
						</div>
					{/if}
					{#if data.recipe.data.total_time}
						<div class="h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
								Total time
							</div>
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
				<form
					method="post"
					action={data.recipe.favorite ? '?/unfavorite' : '?/favorite'}
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="slug" value={data.recipe.slug} />
					<button
						type="submit"
						title={data.recipe.favorite ? 'Unfavorite' : 'Favorite'}
						class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
					>
						<Icon
							icon={data.recipe.favorite ? 'ph:heart-fill' : 'ph:heart'}
							color="#ef4444"
							width="1.4rem"
						/>
					</button>
				</form>
				<button
					type="button"
					title="Share"
					class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
					onclick={() => {
						showShareModal = true;
					}}
				>
					<Icon icon="ph:share-network" color="#3b82f6" width="1.4rem" />
				</button>
				<button
					type="button"
					title="Shopping list"
					class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
					onclick={() => {
						showShoppingListModal = true;
					}}
				>
					<Icon icon="ph:shopping-cart" color="#3b82f6" width="1.4rem" />
				</button>
				<button
					type="button"
					title="Add to Cookbook"
					class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
					onclick={() => {
						showCookbookModal = true;
					}}
				>
					<Icon icon="ph:book-bookmark" color="#3b82f6" width="1.4rem" />
				</button>
				<a
					href={`/recipes/${data.recipe.slug}/edit`}
					title="Edit"
					class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
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
				<Toggle
					label="Cooking Mode"
					title="Prevents the screen from turning off"
					bind:checked={toggleWakelock}
				/>
			</div>
		{/if}

		<div class="flex flex-col md:flex-row gap-5 mb-5">
			<div class="basis-1/3">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-orange-500 text-lg uppercase font-semibold">Ingredients</h3>
					<div class="flex items-center gap-2 text-sm">
						<button
							type="button"
							onclick={() => {
								if (multiplier > 0.5) multiplier = Math.round((multiplier - 0.5) * 10) / 10;
							}}
							disabled={multiplier <= 0.5}
							class="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
							>−</button
						>
						<span class="w-8 text-center font-semibold">{formatMultiplier(multiplier)}</span>
						<button
							type="button"
							onclick={() => {
								multiplier = Math.round((multiplier + 0.5) * 10) / 10;
							}}
							class="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
							>+</button
						>
					</div>
				</div>
				{#if data.recipe.data.ingredient_groups?.some((g) => g.purpose)}
					{#each data.recipe.data.ingredient_groups as group, i}
						{#if group.purpose}
							<h4 class="font-semibold mb-1 {i > 0 ? 'mt-4' : ''}">{group.purpose}</h4>
						{/if}
						<ul class="list-disc list-inside">
							{#each group.ingredients as ingredient}
								<li class="mb-3 last:mb-0">{scaleIngredient(ingredient, multiplier)}</li>
							{/each}
						</ul>
					{/each}
				{:else}
					<ul class="list-disc list-inside">
						{#each data.recipe.data.ingredients || [] as ingredient}
							<li class="mb-3 last:mb-0">{scaleIngredient(ingredient, multiplier)}</li>
						{/each}
					</ul>
				{/if}
			</div>
			<div class="basis-2/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Instructions</h3>
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
				class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>
				Create
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showCookbookModal}>
	<h4 class="text-xl font-bold mb-3">Add to Cookbook</h4>
	<p class="mb-3">
		Add <span class="font-bold">{data.recipe.data.title}</span> to a cookbook.
	</p>
	{#if form?.cookbookMessage}
		<div class="py-4">
			<Alert variant={form?.cookbookMessageType || 'error'}>
				{form?.cookbookMessage}
			</Alert>
		</div>
	{/if}
	{#if !data.cookbooks || !data.cookbooks.length}
		<p class="italic text-gray-500">
			No cookbooks yet. <a href="/cookbooks/create" class="text-orange-500 hover:underline"
				>Create one first.</a
			>
		</p>
	{/if}
	<div class="flex flex-col gap-2">
		{#each data.cookbooks as cookbook}
			{@const alreadyAdded = cookbook.recipeUuids?.includes(data.recipe.uuid)}
			<div class="flex items-center justify-between border rounded-sm p-2">
				<span class="font-semibold">{cookbook.title}</span>
				{#if alreadyAdded}
					<span class="text-sm text-gray-400 italic">Already added</span>
				{:else}
					<form method="post" action="?/addtocookbook" use:enhance>
						<input type="hidden" name="cookbookSlug" value={cookbook.slug} />
						<input type="hidden" name="recipeUuid" value={data.recipe.uuid} />
						<button
							type="submit"
							class="py-1 px-3 bg-orange-500 rounded-sm text-white text-sm font-semibold hover:bg-orange-600"
						>
							Add
						</button>
					</form>
				{/if}
			</div>
		{/each}
	</div>
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
				class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
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
			<div class="flex items-center justify-between gap-2 border rounded-sm p-2">
				<div>https://managemeals.com/share/recipes/{recipeShare.slug}</div>
				<div class="flex items-center gap-2">
					<button
						class="flex items-center gap-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
						title="Copy"
						onclick={async () => {
							await window.navigator.clipboard.writeText(
								`https://managemeals.com/share/recipes/${recipeShare.slug}`
							);
						}}
					>
						<Icon icon="ph:copy" color="#000" width="1.5rem" />
					</button>
					<form method="post" action="?/deleteshare" use:enhance>
						<input type="hidden" id="slug" name="slug" value={recipeShare.slug} />
						<button class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm" title="Delete">
							<Icon icon="ph:x" color="#000" width="1.2rem" />
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</Modal>
