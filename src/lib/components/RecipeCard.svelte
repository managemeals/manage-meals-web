<script lang="ts">
	import type { IRecipe } from '$lib/types';
	import RecipeCategoryTag from '$lib/components/RecipeCategoryTag.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		recipe: IRecipe;
		urlPrefix?: string;
		href?: string;
		nonClickableCategoriesTags?: boolean;
		hideCategoriesTags?: boolean;
		badge?: string;
	}

	let {
		recipe,
		urlPrefix = '',
		href,
		nonClickableCategoriesTags = false,
		hideCategoriesTags = false,
		badge
	}: Props = $props();

	const recipeHref = $derived(href ?? `${urlPrefix}/recipes/${recipe.slug}`);
</script>

<div class="border hover:shadow-sm rounded-sm dark:bg-gray-900">
	<a href={recipeHref}>
		<div
			style={`background-image: url("${recipe.data.image}")`}
			class="bg-center bg-no-repeat bg-cover w-full h-48"
		></div>
		<div class="p-3">
			<div class="flex items-start justify-between gap-2 mb-2">
				<h3>{recipe.data.title}</h3>
				{#if badge}
					<span
						class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
						>{badge}</span
					>
				{/if}
			</div>
			{#if recipe.data.total_time || recipe.data.nutrients?.calories}
				<div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
					{#if recipe.data.total_time}
						<div class="flex items-center gap-1">
							<Icon icon="ph:clock" width="0.9rem" />
							<span>{recipe.data.total_time} min</span>
						</div>
					{/if}
					{#if recipe.data.nutrients?.calories}
						<div class="flex items-center gap-1">
							<Icon icon="ph:fire" width="0.9rem" />
							<span>{recipe.data.nutrients.calories}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</a>
	{#if !hideCategoriesTags}
		<div class="p-3 pt-0">
			<RecipeCategoryTag {recipe} nonClickable={nonClickableCategoriesTags} />
		</div>
	{/if}
</div>
