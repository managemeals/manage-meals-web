<script lang="ts">
	import type { IRecipe } from '$lib/types';
	import Icon from '@iconify/svelte';

	export let recipe: IRecipe;
	export let nonClickable = false;
</script>

<div class="flex items-start gap-2 mb-3">
	<div title="Categories">
		<Icon icon="ph:folder" color="#f97316" width="1.2rem" />
	</div>
	<div class="flex flex-wrap gap-1 text-sm italic">
		{#if recipe.categories && recipe.categories.length}
			{#each recipe.categories as category}
				{#if nonClickable}
					<span class="after:content-[','] last:after:content-['']">
						{category.name}
					</span>
				{:else}
					<a
						href={`/categories/${category.slug}`}
						class="hover:underline after:content-[','] last:after:content-['']">{category.name}</a
					>
				{/if}
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
				{#if nonClickable}
					<span class="after:content-[','] last:after:content-['']">{tag.name}</span>
				{:else}
					<a
						href={`/tags/${tag.slug}`}
						class="hover:underline after:content-[','] last:after:content-['']">{tag.name}</a
					>
				{/if}
			{/each}
		{:else}
			<div>Untagged</div>
		{/if}
	</div>
</div>
