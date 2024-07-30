<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Recipes - Admin - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Latest Recipes</h1>

	<ul class="list-disc list-inside">
		{#each data.recipesLatest as recipe}
			<li>{recipe.data.title}</li>
		{/each}
	</ul>
</div>
