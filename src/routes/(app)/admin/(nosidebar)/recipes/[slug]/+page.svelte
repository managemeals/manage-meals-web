<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { format } from 'date-fns';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.recipe.data.title} - Recipes - Admin - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div>
	<div class="sm:px-5">
		<div
			style={`background-image: url("${data.recipe.data.image}")`}
			class="bg-center bg-no-repeat bg-cover w-full h-64 lg:h-96 relative"
		>
			<div
				class="absolute right-0 bottom-0 left-0 md:left-auto overflow-auto bg-slate-100 opacity-90"
				class:hidden={!data.recipe.data.prep_time &&
					!data.recipe.data.cook_time &&
					!data.recipe.data.total_time}
			>
				<div class="flex items-center h-14">
					<div class="border-r-2 border-gray-300 h-full px-3 flex flex-col justify-center">
						<Icon icon="ph:clock" width="1.8rem" color="#4b5563" />
					</div>
					{#if data.recipe.data.prep_time}
						<div class="border-r-2 border-gray-300 h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 whitespace-nowrap">Prep time</div>
							<div class="whitespace-nowrap">{data.recipe.data.prep_time} minutes</div>
						</div>
					{/if}
					{#if data.recipe.data.cook_time}
						<div class="border-r-2 border-gray-300 h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 whitespace-nowrap">Cook time</div>
							<div class="whitespace-nowrap">{data.recipe.data.cook_time} minutes</div>
						</div>
					{/if}
					{#if data.recipe.data.total_time}
						<div class="h-full px-3 flex flex-col justify-center">
							<div class="uppercase text-sm text-gray-600 whitespace-nowrap">Total time</div>
							<div class="whitespace-nowrap">{data.recipe.data.total_time} minutes</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="p-5">
		<div class="mb-5">
			<div>
				<h1 class="font-semibold text-orange-500 text-2xl mb-3">{data.recipe.data.title}</h1>
				<div class="flex flex-col gap-3 lg:flex-row lg:gap-5">
					<div class="flex items-center gap-1">
						<div title="Categories">
							<Icon icon="ph:folder" color="#f97316" width="1.4rem" />
						</div>
						<div class="flex gap-1 flex-wrap">
							{#if data.recipe.categories && data.recipe.categories.length}
								{#each data.recipe.categories as category}
									<span class="after:content-[','] last:after:content-[''] italic"
										>{category.name}</span
									>
								{/each}
							{:else}
								<span class="after:content-[','] last:after:content-[''] italic">Uncategorized</span
								>
							{/if}
						</div>
					</div>
					<div class="flex items-center gap-1">
						<div title="Tags">
							<Icon icon="ph:tag" color="#f97316" width="1.4rem" />
						</div>
						<div class="flex gap-1 flex-wrap">
							{#if data.recipe.tags && data.recipe.tags.length}
								{#each data.recipe.tags as tag}
									<span class="after:content-[','] last:after:content-[''] italic">{tag.name}</span>
								{/each}
							{:else}
								<span class="after:content-[','] last:after:content-[''] italic">Untagged</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		{#if data.recipe.data.description}
			<p class="mb-5">{data.recipe.data.description}</p>
		{/if}

		{#if data.recipe.data.yields}
			<div class="mb-5">
				<span class="font-semibold text-orange-500 uppercase">Yield:</span>
				{data.recipe.data.yields}
			</div>
		{/if}

		<div class="flex flex-col md:flex-row gap-5 mb-5">
			<div class="basis-1/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Ingredients</h3>
				<ul class="list-disc list-inside">
					{#each data.recipe.data.ingredients || [] as ingredient}
						<li class="mb-3 last:mb-0">{ingredient}</li>
					{/each}
				</ul>
			</div>
			<div class="basis-2/3">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Directions</h3>
				<ol class="list-decimal list-inside">
					{#each data.recipe.data.instructions_list || [] as instruction}
						<li class="mb-3 last:mb-0">{instruction}</li>
					{/each}
				</ol>
			</div>
		</div>

		{#if data.recipe.data.nutrients && Object.keys(data.recipe.data.nutrients).length && !Object.values(data.recipe.data.nutrients).every((k) => k === '')}
			<div class="mb-5">
				<h3 class="text-orange-500 text-lg uppercase font-semibold mb-3">Nutrition</h3>
				<div class="overflow-auto">
					<table>
						<tbody>
							{#if data.recipe.data.nutrients?.calories}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Calories</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.calories}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.carbohydrateContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Carbohydrate</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.carbohydrateContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.cholesterolContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Cholesterol</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.cholesterolContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.fatContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Fat</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.fatContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.fiberContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Fiber</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.fiberContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.proteinContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Protein</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.proteinContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.saturatedFatContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Saturated fat</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.saturatedFatContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.sodiumContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Sodium</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.sodiumContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.sugarContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Sugar</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.sugarContent}</td>
								</tr>
							{/if}
							{#if data.recipe.data.nutrients?.unsaturatedFatContent}
								<tr class="border-b last:border-b-0">
									<td class="px-5 py-1 pl-0">Unsaturated fat</td>
									<td class="px-5 py-1 pl-0">{data.recipe.data.nutrients.unsaturatedFatContent}</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<div class="flex flex-col gap-3 md:flex-row md:gap-5 justify-end pt-5 text-sm">
			<div class="flex items-center gap-1">
				<Icon icon="ph:calendar-blank" width="1.4rem" />
				<div title={data.recipe.createdAt}>{format(data.recipe.createdAt, 'd MMM yyyy')}</div>
			</div>
			{#if data.recipe.data.canonical_url}
				<div class="flex items-center gap-1">
					<Icon icon="ph:arrow-square-out" width="1.4rem" color="#3b82f6" />
					<a
						href={data.recipe.data.canonical_url}
						target="_blank"
						class="text-blue-500 hover:underline"
					>
						{data.recipe.data.host ? data.recipe.data.host : data.recipe.data.canonical_url}
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
