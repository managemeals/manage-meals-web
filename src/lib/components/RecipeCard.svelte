<script lang="ts">
	import type { IRecipe } from '$lib/types';
	import RecipeCategoryTag from '$lib/components/RecipeCategoryTag.svelte';

	export let recipe: IRecipe;
</script>

<a href={`/recipes/${recipe.slug}`} class="border hover:shadow rounded">
	<div
		style={`background-image: url("${recipe.data.image}")`}
		class="bg-center bg-no-repeat bg-cover w-full h-48"
	></div>
	<div class="p-3">
		<h3 class="mb-3">{recipe.data.title}</h3>
		<RecipeCategoryTag {recipe} />
	</div>
</a>
