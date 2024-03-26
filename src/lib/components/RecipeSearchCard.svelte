<script lang="ts">
	import type { ISearchHits, ISearchRecipe } from '$lib/types';
	import Icon from '@iconify/svelte';

	export let recipe: ISearchHits<ISearchRecipe>;

	const descMaxLength = 100;
</script>

<a
	href={`/recipes/${recipe.document.slug}`}
	class="border rounded flex flex-col md:flex-row md:items-center hover:shadow"
>
	<div
		style={`background-image: url("${recipe.document.imageUrl}")`}
		class="bg-center bg-no-repeat bg-cover h-32 basis-44 shrink-0 w-full"
	></div>
	<div class="p-3">
		<h3 class="mb-1">{@html recipe.highlight.title.snippet}</h3>
		{#if recipe.document.description}
			<p class="mb-1">
				{recipe.document.description.length > descMaxLength
					? `${recipe.document.description.substring(0, descMaxLength)}...`
					: recipe.document.description}
			</p>
		{/if}
		<div class="flex items-start gap-2 mb-1 mt-2">
			<div title="Categories">
				<Icon icon="ph:folder" color="#f97316" width="1.2rem" />
			</div>
			<div class="flex flex-wrap gap-1 text-sm italic">
				{#if recipe.document.categories && recipe.document.categories.length}
					{#each recipe.document.categories as category}
						<div class="after:content-[','] last:after:content-['']">{category}</div>
					{/each}
				{:else}
					<div>Uncategorized</div>
				{/if}
			</div>
		</div>
		<div class="flex items-start gap-2">
			<div title="Tags">
				<Icon icon="ph:tag" color="#f97316" width="1.2rem" />
			</div>
			<div class="flex flex-wrap gap-1 text-sm italic">
				{#if recipe.document.tags && recipe.document.tags.length}
					{#each recipe.document.tags as tag}
						<div class="after:content-[','] last:after:content-['']">{tag}</div>
					{/each}
				{:else}
					<div>Untagged</div>
				{/if}
			</div>
		</div>
	</div>
</a>
