<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';
	import RecipeCard from '$lib/components/RecipeCard.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Popular - Recipes - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Popular Recipes</h1>

	{#if !data.popularRecipes.length}
		<p class="italic">No recipes</p>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
		{#each data.popularRecipes as popularRecipe}
			<RecipeCard recipe={popularRecipe.recipe} urlPrefix="/charts" hideCategoriesTags />
		{/each}
	</div>
</div>
