<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import RecipeCardRow from '$lib/components/RecipeCardRow.svelte';
	import { env } from '$env/dynamic/public';
	import { browser } from '$app/environment';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let checked = $state<boolean[]>([]);

	$effect(() => {
		if (!browser) return;
		const stored = localStorage.getItem(`shopping-list-checked-${data.shoppingList.slug}`);
		if (stored) checked = JSON.parse(stored);
	});

	function toggleCheck(index: number) {
		checked[index] = !checked[index];
		localStorage.setItem(
			`shopping-list-checked-${data.shoppingList.slug}`,
			JSON.stringify([...checked])
		);
	}
</script>

<svelte:head>
	<title>{data.shoppingList.title} - Shopping Lists - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pb-20">
	<div class="flex justify-between items-start mb-5">
		<div class="flex items-start gap-1 flex-col md:flex-row md:gap-3 md:items-center">
			<h1 class="text-2xl font-bold">{data.shoppingList.title}</h1>
			<div class="text-sm text-gray-500 dark:text-gray-400">
				{data.shoppingList.ingredients?.length || 0}
				{(data.shoppingList.ingredients?.length || 0) === 1 ? 'item' : 'items'}
			</div>
		</div>
		<a
			href={`/shopping-lists/${data.shoppingList.slug}/edit`}
			title="Edit"
			class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
		>
			<Icon icon="ph:pencil" color="#3b82f6" width="1.4rem" />
		</a>
	</div>

	{#if !data.shoppingList.ingredients?.length}
		<p class="italic">No items in this shopping list</p>
	{/if}

	<div class="flex flex-col gap-3">
		{#each data.shoppingList.ingredients || [] as ingredient, i}
			<div class="flex items-start gap-3">
				<input
					type="checkbox"
					id={`ingredient${i}`}
					checked={checked[i] ?? false}
					onchange={() => toggleCheck(i)}
					class="w-4 h-4 mt-0.5 shrink-0"
				/>
				<label
					for={`ingredient${i}`}
					class={`cursor-pointer ${checked[i] ? 'line-through text-gray-400' : ''}`}
				>
					{ingredient}
				</label>
			</div>
		{/each}
	</div>

	<div class="mt-10">
		<h3 class="text-lg font-bold mb-5">Linked Recipes</h3>
		{#if !(data.shoppingList?.recipes || []).length}
			<p class="italic">No linked recipes</p>
		{/if}
		<div class="flex flex-col gap-3">
			{#each data.shoppingList.recipes || [] as recipe}
				<RecipeCardRow {recipe} imgSize="sm" />
			{/each}
		</div>
	</div>
</div>
