<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let confirmingRemoveUuid = $state<string | null>(null);
</script>

<svelte:head>
	<title>{data.cookbook.title} - Cookbooks - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex justify-between items-start mb-5">
		<div>
			<h1 class="text-2xl font-bold">{data.cookbook.title}</h1>
			{#if data.cookbook.description}
				<p class="text-gray-500 dark:text-gray-400 mt-1">{data.cookbook.description}</p>
			{/if}
			<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
				{data.cookbook.recipes?.length || 0} recipes
			</div>
		</div>
		<a
			href={`/cookbooks/${data.cookbook.slug}/edit`}
			title="Edit"
			class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
		>
			<Icon icon="ph:pencil" color="#3b82f6" width="1.4rem" />
		</a>
	</div>

	{#if !data.cookbook.recipes?.length}
		<p class="italic">No recipes in this cookbook. Add recipes from the recipe page.</p>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
		{#each data.cookbook.recipes || [] as recipe}
			<div class="relative">
				<RecipeCard {recipe} />
				<div class="absolute top-1 right-1">
					{#if confirmingRemoveUuid === recipe.uuid}
						<div
							class="flex items-center gap-1 bg-white dark:bg-gray-800 border rounded-sm p-1 shadow-sm"
						>
							<form method="POST" action="?/removerecipe" use:enhance>
								<input type="hidden" name="recipeUuid" value={recipe.uuid} />
								<button
									type="submit"
									class="text-xs text-red-600 hover:underline font-semibold px-1"
									title="Confirm remove"
								>
									Remove
								</button>
							</form>
							<button
								type="button"
								class="text-xs text-gray-500 dark:text-gray-400 hover:underline px-1"
								onclick={() => (confirmingRemoveUuid = null)}
							>
								Cancel
							</button>
						</div>
					{:else}
						<button
							type="button"
							title="Remove from cookbook"
							class="bg-white dark:bg-gray-800 border rounded-sm p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
							onclick={() => (confirmingRemoveUuid = recipe.uuid)}
						>
							<Icon icon="ph:x" color="#ef4444" width="1rem" />
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
