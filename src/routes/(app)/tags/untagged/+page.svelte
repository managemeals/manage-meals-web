<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Untagged - Tags - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-3">
	<h1>Untagged</h1>

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
