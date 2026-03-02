<script lang="ts">
	import type { IRecipe } from '$lib/types';
	import RecipeCategoryTag from '$lib/components/RecipeCategoryTag.svelte';

	interface Props {
		recipe: IRecipe;
		urlPrefix?: string;
		nonClickableCategoriesTags?: boolean;
		hideCategoriesTags?: boolean;
	}

	let {
		recipe,
		urlPrefix = '',
		nonClickableCategoriesTags = false,
		hideCategoriesTags = false
	}: Props = $props();
</script>

<div class="border hover:shadow rounded">
	<a href={`${urlPrefix}/recipes/${recipe.slug}`}>
		<div
			style={`background-image: url("${recipe.data.image}")`}
			class="bg-center bg-no-repeat bg-cover w-full h-48"
		></div>
		<div class="p-3">
			<h3>{recipe.data.title}</h3>
		</div>
	</a>
	{#if !hideCategoriesTags}
		<div class="p-3 pt-0">
			<RecipeCategoryTag {recipe} nonClickable={nonClickableCategoriesTags} />
		</div>
	{/if}
</div>
