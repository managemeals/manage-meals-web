<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Most Recent - Categories - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-3">
	<!-- <div class="flex gap-5 items-center">
		<h1 class="text-lg font-semibold">All Recipes</h1>
		<SearchInput />
	</div> -->

	{#if !data.recipes.total}
		<h2>Nothing here</h2>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
		{#each data.recipes.data as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>

	{#if data.recipes.total}
		<div class="flex justify-center py-5">
			<Pagination
				total={data.recipes.total}
				page={data.recipes.page}
				perPage={data.recipes.perPage}
			/>
		</div>
	{/if}
</div>
