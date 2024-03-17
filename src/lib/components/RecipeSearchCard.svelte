<script lang="ts">
	import type { ISearchHits, ISearchRecipe } from '$lib/types';
	import Tag from '$lib/components/Tag.svelte';

	export let recipe: ISearchHits<ISearchRecipe>;

	const descMaxLength = 100;
</script>

<a href={`/recipes/${recipe.document.slug}`} class="border rounded flex items-center hover:shadow">
	<div
		style={`background-image: url("${recipe.document.imageUrl}")`}
		class="bg-center bg-no-repeat bg-cover h-32 basis-44 shrink-0"
	></div>
	<div class="p-3">
		<h3>{@html recipe.highlight.title.snippet}</h3>
		<p>
			{recipe.document.description.length > descMaxLength
				? `${recipe.document.description.substring(0, descMaxLength)}...`
				: recipe.document.description}
		</p>
	</div>
</a>
