<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Uncategorized - Categories - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="mb-5">
		<div class="flex items-center gap-3">
			<h1 class="text-2xl font-bold">Uncategorized</h1>
			<div class="text-sm text-gray-500">{data.recipes.total} recipes</div>
		</div>
	</div>

	{#if !data.recipes.total}
		<p class="italic">No recipes</p>
	{/if}

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
