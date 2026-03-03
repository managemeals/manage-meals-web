<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { format } from 'date-fns';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let expandedSlug = $state<string | null>(null);
	let confirmingDeleteSlug = $state<string | null>(null);
	let checkedItems = $state<Record<string, boolean[]>>({});

	function toggleExpand(slug: string, ingredientCount: number) {
		if (expandedSlug === slug) {
			expandedSlug = null;
		} else {
			expandedSlug = slug;
			if (!checkedItems[slug]) {
				const stored = browser ? localStorage.getItem(`shopping-list-checked-${slug}`) : null;
				checkedItems[slug] = stored ? JSON.parse(stored) : Array(ingredientCount).fill(false);
			}
		}
	}

	function toggleCheck(slug: string, index: number) {
		checkedItems[slug][index] = !checkedItems[slug][index];
		localStorage.setItem(`shopping-list-checked-${slug}`, JSON.stringify([...checkedItems[slug]]));
	}
</script>

<svelte:head>
	<title>Shopping Lists - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pb-20">
	<div class="flex items-center gap-3 mb-5">
		<h1 class="text-2xl font-bold">Shopping Lists</h1>
		{#if data.user.subscriptionType !== 'PREMIUM' && env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
			<a href="/settings/subscription" class="text-base text-orange-500 hover:underline font-bold"
				>Premium</a
			>
		{/if}
		{#if data.user.subscriptionType === 'PREMIUM'}
			<a
				href="/shopping-lists/create"
				title="Create Shopping List"
				class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
			>
				<Icon icon="ph:plus" color="#000" width="1.5rem" />
			</a>
		{/if}
	</div>

	{#if !data.shoppingLists || !data.shoppingLists.length}
		<p class="italic">No shopping lists</p>
	{/if}

	<div class="flex flex-col gap-3">
		{#each data.shoppingLists as shoppingList}
			<div class="border rounded-sm hover:shadow-sm">
				<!-- Card header -->
				<div class="p-3 flex items-start gap-3">
					<!-- Expand toggle button -->
					<button
						type="button"
						class="mt-0.5 shrink-0 p-0.5 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
						title={expandedSlug === shoppingList.slug ? 'Collapse' : 'Expand'}
						onclick={() => toggleExpand(shoppingList.slug, shoppingList.ingredients?.length || 0)}
					>
						<Icon
							icon={expandedSlug === shoppingList.slug ? 'ph:caret-down' : 'ph:caret-right'}
							width="0.9rem"
						/>
					</button>

					<!-- Title and meta -->
					<div class="flex-1 min-w-0">
						<a href={`/shopping-lists/${shoppingList.slug}`} class="font-semibold hover:underline">
							{shoppingList.title}
						</a>
						<div class="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
							<span class="flex items-center gap-1">
								<Icon icon="ph:list-bullets" width="0.85rem" />
								{shoppingList.ingredients?.length || 0}
								{(shoppingList.ingredients?.length || 0) === 1 ? 'item' : 'items'}
							</span>
							{#if shoppingList.recipeUuids?.length}
								<span class="flex items-center gap-1">
									<Icon icon="ph:book-open" width="0.85rem" />
									{shoppingList.recipeUuids.length}
									{shoppingList.recipeUuids.length === 1 ? 'recipe' : 'recipes'}
								</span>
							{/if}
							<span>{format(shoppingList.createdAt, 'd MMMM yyyy')}</span>
						</div>
					</div>

					<!-- Action buttons -->
					<div class="flex items-center gap-1 shrink-0">
						<a
							href={`/shopping-lists/${shoppingList.slug}/edit`}
							title="Edit"
							class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
						>
							<Icon icon="ph:pencil" color="#3b82f6" width="1.2rem" />
						</a>
						<button
							type="button"
							title="Delete"
							class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
							onclick={() =>
								(confirmingDeleteSlug =
									confirmingDeleteSlug === shoppingList.slug ? null : shoppingList.slug)}
						>
							<Icon icon="ph:trash" color="#ef4444" width="1.2rem" />
						</button>
					</div>
				</div>

				<!-- Delete confirmation -->
				{#if confirmingDeleteSlug === shoppingList.slug}
					<div class="px-3 py-2 flex items-center gap-3 border-t bg-red-50">
						<span class="text-sm text-gray-700 dark:text-gray-300">Delete "{shoppingList.title}"?</span>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="slug" value={shoppingList.slug} />
							<button type="submit" class="text-sm text-red-600 hover:underline font-semibold">
								Confirm
							</button>
						</form>
						<button
							type="button"
							class="text-sm text-gray-500 dark:text-gray-400 hover:underline"
							onclick={() => (confirmingDeleteSlug = null)}
						>
							Cancel
						</button>
					</div>
				{/if}

				<!-- Expanded ingredient list -->
				{#if expandedSlug === shoppingList.slug}
					<div class="border-t px-3 py-3 flex flex-col gap-2">
						{#if !shoppingList.ingredients?.length}
							<p class="text-sm italic text-gray-500 dark:text-gray-400">No items in this list</p>
						{:else}
							{#each shoppingList.ingredients as ingredient, i}
								<div class="flex items-start gap-3">
									<input
										type="checkbox"
										id={`${shoppingList.slug}-item-${i}`}
										checked={checkedItems[shoppingList.slug]?.[i] ?? false}
										onchange={() => toggleCheck(shoppingList.slug, i)}
										class="w-4 h-4 mt-0.5 shrink-0"
									/>
									<label
										for={`${shoppingList.slug}-item-${i}`}
										class={`cursor-pointer ${checkedItems[shoppingList.slug]?.[i] ? 'line-through text-gray-400' : ''}`}
									>
										{ingredient}
									</label>
								</div>
							{/each}
						{/if}
						{#if shoppingList.recipeUuids?.length}
							<a
								href={`/shopping-lists/${shoppingList.slug}`}
								class="mt-2 text-sm text-orange-500 hover:underline flex items-center gap-1 w-fit"
							>
								View linked recipes
								<Icon icon="ph:arrow-right" width="0.85rem" />
							</a>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
