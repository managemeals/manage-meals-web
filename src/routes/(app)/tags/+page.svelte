<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Tags - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-3">
	<div class="flex justify-between items-center mb-4">
		<h1 class="text-lg font-semibold">All Recipes</h1>
		<div class="text-sm text-gray-600">{data.recipes.total} recipes</div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
		{#each data.recipes.data as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>

	<div class="flex justify-center py-5">
		<Pagination
			total={data.recipes.total}
			page={data.recipes.page}
			perPage={data.recipes.perPage}
		/>
	</div>
</div>
