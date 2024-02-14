<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
</script>

<svelte:head>
	<title>{PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-3">
	<div class="flex gap-5 items-center">
		<h1 class="text-lg font-semibold">All Recipes</h1>
		<SearchInput />
	</div>

	<div class="flex flex-wrap gap-4">
		{#each { length: 200 } as _, i}
			<RecipeCard />
		{/each}
	</div>
</div>
