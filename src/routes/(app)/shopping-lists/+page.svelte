<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { format } from 'date-fns';

	export let data: PageData;
</script>

<svelte:head>
	<title>Shopping Lists - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pb-20">
	<div class="flex items-center gap-3 mb-5">
		<h1 class="text-2xl font-bold">Shopping Lists</h1>
		{#if data.user.subscriptionType !== 'PREMIUM'}
			<a href="/settings/subscription" class="text-base text-orange-500 hover:underline font-bold"
				>Premium</a
			>
		{/if}
		{#if data.user.subscriptionType === 'PREMIUM'}
			<a
				href="/shopping-lists/create"
				title="Create Shopping List"
				class="hover:bg-gray-200 p-1 rounded"
			>
				<span class="sr-only">Create Shopping List</span>
				<Icon icon="ph:plus" color="#000" width="1.5rem" />
			</a>
		{/if}
	</div>

	{#if !data.shoppingLists || !data.shoppingLists.length}
		<p class="italic">No shopping lists</p>
	{/if}

	<div class="flex flex-col gap-3">
		{#each data.shoppingLists as shoppingList}
			<a
				href={`/shopping-lists/${shoppingList.slug}`}
				class="border rounded p-3 hover:shadow flex justify-between flex-col md:flex-row gap-3"
			>
				<div>
					<h3 class="mb-1">{shoppingList.title}</h3>
					<div class="flex gap-3">
						<h4 class="text-sm">
							{shoppingList.ingredients?.length || 0}
							{(shoppingList.ingredients?.length || 0) === 1 ? 'item' : 'items'}
						</h4>
						<h4 class="text-sm">
							{shoppingList.recipeUuids?.length || 0}
							linked
							{(shoppingList.recipeUuids?.length || 0) === 1 ? 'recipe' : 'recipes'}
						</h4>
					</div>
				</div>
				<div class="self-end">
					<div class="text-xs text-gray-500" title={shoppingList.createdAt}>
						Created at: {format(shoppingList.createdAt, 'd MMMM yyyy')}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
