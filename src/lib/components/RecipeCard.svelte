<script lang="ts">
	import type { IRecipe } from '$lib/types';
	import Icon from '@iconify/svelte';

	export let recipe: IRecipe;
</script>

<a href={`/recipes/${recipe.slug}`} class="border hover:shadow rounded">
	<div
		style={`background-image: url("${recipe.data.image}")`}
		class="bg-center bg-no-repeat bg-cover w-full h-48"
	></div>
	<div class="p-3">
		<h3 class="mb-3">{recipe.data.title}</h3>
		<div class="flex items-start gap-2 mb-3">
			<div title="Categories">
				<Icon icon="ph:folder" color="#f97316" width="1.2rem" />
			</div>
			<div class="flex flex-wrap gap-1 text-sm italic">
				{#if recipe.categories && recipe.categories.length}
					{#each recipe.categories as category}
						<div class="after:content-[','] last:after:content-['']">{category.name}</div>
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
				{#if recipe.tags && recipe.tags.length}
					{#each recipe.tags as tag}
						<div class="after:content-[','] last:after:content-['']">{tag.name}</div>
					{/each}
				{:else}
					<div>Untagged</div>
				{/if}
			</div>
		</div>
	</div>
</a>
