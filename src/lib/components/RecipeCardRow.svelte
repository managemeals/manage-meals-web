<script lang="ts">
	import type { IRecipe } from '$lib/types';
	import RecipeCategoryTag from '$lib/components/RecipeCategoryTag.svelte';

	export let recipe: IRecipe;
	export let imgSize: 'sm' | 'md' | 'lg' = 'md';
	export let hasTitleLink = false;
</script>

{#if hasTitleLink}
	<div class="border rounded flex flex-col md:flex-row">
		<div
			style={`background-image: url("${recipe.data.image}")`}
			class={`
			bg-center bg-no-repeat bg-cover w-full
			${imgSize === 'sm' ? 'md:w-60 h-28' : ''}
			${imgSize === 'md' ? 'md:w-80 h-48' : ''}
			${imgSize === 'lg' ? 'md:w-80 h-48' : ''}
		`.trim()}
		></div>
		<div class="p-3">
			<h3 class="mb-3">
				<a href={`/recipes/${recipe.slug}`} class="hover:underline">{recipe.data.title}</a>
			</h3>
			<RecipeCategoryTag {recipe} />
		</div>
	</div>
{:else}
	<a href={`/recipes/${recipe.slug}`} class="border hover:shadow rounded flex flex-col md:flex-row">
		<div
			style={`background-image: url("${recipe.data.image}")`}
			class={`
			bg-center bg-no-repeat bg-cover w-full
			${imgSize === 'sm' ? 'md:w-60 h-28' : ''}
			${imgSize === 'md' ? 'md:w-80 h-48' : ''}
			${imgSize === 'lg' ? 'md:w-80 h-48' : ''}
		`.trim()}
		></div>
		<div class="p-3">
			<h3 class="mb-3">{recipe.data.title}</h3>
			<RecipeCategoryTag {recipe} />
		</div>
	</a>
{/if}
