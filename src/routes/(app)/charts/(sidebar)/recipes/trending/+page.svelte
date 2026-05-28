<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';
	import RecipeCard from '$lib/components/RecipeCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Trending - Recipes - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-2">Trending This Month</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-5">
		Recipes imported by multiple people in the last 30 days.
	</p>

	{#if !data.trendingRecipes.length}
		<p class="italic">Nothing trending yet — check back soon.</p>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
		{#each data.trendingRecipes as trendingRecipe}
			<RecipeCard
				recipe={trendingRecipe.recipe}
				hideCategoriesTags
				badge={`${trendingRecipe.count} imports`}
				href={`/charts/recipes/trending/${trendingRecipe.recipe.slug}`}
			/>
		{/each}
	</div>
</div>
