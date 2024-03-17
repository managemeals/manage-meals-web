<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Icon from '$lib/components/Icon.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.recipe.data.title} - Recipes - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-10 pt-0">
	<div
		style={`background-image: url("${data.recipe.data.image}")`}
		class="bg-center bg-no-repeat bg-cover w-full h-96 relative"
	>
		<div class="bg-slate-100 flex absolute bottom-0 right-0 opacity-90 items-center gap-4 p-1">
			<div class="border-r-2 border-gray-300 px-1">
				<Icon icon="house" />
			</div>
			<div class="border-r-2 border-gray-300 px-1">
				<div class="uppercase text-sm text-gray-600">Prep time</div>
				<div>20 minutes</div>
			</div>
			<div class="border-r-2 border-gray-300 px-1">
				<div>Prep time</div>
				<div>20 minutes</div>
			</div>
			<div class="px-1">
				<div>Prep time</div>
				<div>20 minutes</div>
			</div>
		</div>
	</div>

	<h1 class="font-semibold text-orange-500 text-2xl">{data.recipe.data.title}</h1>

	<h2>{data.recipe.data.description}</h2>

	<div class="flex">
		<div>
			<h3 class="text-orange-500 text-lg uppercase font-semibold">Ingredients</h3>
			<ul class="list-disc list-inside">
				{#each data.recipe.data.ingredients as ingredient}
					<li>{ingredient}</li>
				{/each}
			</ul>
		</div>
		<div>
			<h3 class="text-orange-500 text-lg uppercase font-semibold">Directions</h3>
			<ol class="list-decimal list-inside">
				{#each data.recipe.data.instructions_list as instruction}
					<li>{instruction}</li>
				{/each}
			</ol>
		</div>
	</div>
</div>
