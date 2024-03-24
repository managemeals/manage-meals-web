<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.recipe.data.title} - Recipes - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pt-0">
	<div
		style={`background-image: url("${data.recipe.data.image}")`}
		class="bg-center bg-no-repeat bg-cover w-full h-96 relative"
	>
		<div class="bg-slate-100 flex absolute bottom-0 right-0 opacity-90 items-center">
			<div class="border-r-2 border-gray-300">
				<Icon icon="ph:clock" width="1.8rem" />
			</div>
			{#if data.recipe.data.cook_time}
				<div class="border-r-2 border-gray-300">
					<div class="uppercase text-sm text-gray-600">Prep time</div>
					<div>{data.recipe.data.prep_time} minutes</div>
				</div>
			{/if}
			{#if data.recipe.data.cook_time}
				<div class="border-r-2 border-gray-300">
					<div class="uppercase text-sm text-gray-600">Cook time</div>
					<div>{data.recipe.data.cook_time} minutes</div>
				</div>
			{/if}
			{#if data.recipe.data.total_time}
				<div class="">
					<div class="uppercase text-sm text-gray-600">Total time</div>
					<div>{data.recipe.data.total_time} minutes</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="pt-5">
		<div class="flex items-center justify-between mb-5">
			<h1 class="font-semibold text-orange-500 text-2xl">{data.recipe.data.title}</h1>
			<a
				href={`/recipes/${data.recipe.slug}/edit`}
				title="Edit"
				class="hover:bg-gray-200 p-1 rounded"
			>
				<span class="sr-only">Edit</span>
				<Icon icon="ph:pencil" color="#3b82f6" width="1.4rem" />
			</a>
		</div>

		<h2 class="mb-4">{data.recipe.data.description}</h2>

		<div>
			<span class="font-semibold text-orange-500 uppercase">Yield:</span>
			{data.recipe.data.yields}
		</div>

		<div class="flex gap-5 mt-5">
			<div class="basis-1/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-2">Ingredients</h3>
				<ul class="list-disc list-inside">
					{#each data.recipe.data.ingredients as ingredient}
						<li class="mb-3 last:mb-0">{ingredient}</li>
					{/each}
				</ul>
			</div>
			<div class="basis-2/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-2">Directions</h3>
				<ol class="list-decimal list-inside">
					{#each data.recipe.data.instructions_list as instruction}
						<li class="mb-3 last:mb-0">{instruction}</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>
</div>
