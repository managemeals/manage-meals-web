<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeSearchCard from '$lib/components/RecipeSearchCard.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.q ? `${data.q} - ` : ''}Search - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Search</h1>
	<form action="/search" method="get" class="mb-5">
		<div
			class="flex rounded border-2 [&:not(:focus-within)]:hover:border-gray-300 relative ring ring-transparent focus-within:ring-orange-500 focus-within:border-transparent"
		>
			<input
				type="text"
				id="q"
				name="q"
				placeholder="Search"
				value={data.q || ''}
				class="rounded-l p-4 outline-none w-full"
			/>
			<button type="submit" class="rounded-r px-4 hover:bg-gray-50" title="Search">
				<Icon icon="ph:magnifying-glass" width="1.8rem" color="#000" />
			</button>
		</div>
	</form>
	{#if data.q && (!data.search?.hits || !data.search?.hits.length)}
		<p class="italic">No results found</p>
	{/if}
	<div>
		{#each data.search?.hits || [] as hit}
			<div class="mb-4 last:mb-0">
				<RecipeSearchCard recipe={hit} />
			</div>
		{/each}
	</div>
	<div class="flex justify-center py-5">
		<Pagination
			total={data.search?.found || 0}
			page={data.search?.page || 1}
			perPage={data.search?.request_params.per_page || 10}
		/>
	</div>
</div>
