<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Icon from '$lib/components/Icon.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import RecipeSearchCard from '$lib/components/RecipeSearchCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.q ? `${data.q} - ` : ''}Search - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pt-10">
	<div class="flex justify-center">
		<div class="basis-3/4">
			<form action="/search" method="get">
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
					<button type="submit" class="rounded-r px-4">
						<span class="sr-only">Search</span>
						<Icon icon="magnifying-glass" width={1.8} color="#000" />
					</button>
				</div>
			</form>
		</div>
	</div>
	<div class="mt-5">
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
