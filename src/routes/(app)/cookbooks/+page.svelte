<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let confirmingDeleteSlug = $state<string | null>(null);
</script>

<svelte:head>
	<title>Cookbooks - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5 pb-20">
	<div class="flex items-center gap-3 mb-5">
		<h1 class="text-2xl font-bold">Cookbooks</h1>
		<a
			href="/cookbooks/create"
			title="Create Cookbook"
			class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
		>
			<Icon icon="ph:plus" color="#000" width="1.5rem" />
		</a>
	</div>

	{#if !data.cookbooks || !data.cookbooks.length}
		<p class="italic">No cookbooks yet. Create one to get started.</p>
	{/if}

	<div class="flex flex-col gap-3">
		{#each data.cookbooks as cookbook}
			<div class="border rounded-sm hover:shadow-sm">
				<div class="p-3 flex items-start gap-3">
					<div class="flex-1 min-w-0">
						<a href={`/cookbooks/${cookbook.slug}`} class="font-semibold hover:underline">
							{cookbook.title}
						</a>
						{#if cookbook.description}
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{cookbook.description}</p>
						{/if}
						<div class="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
							<span class="flex items-center gap-1">
								<Icon icon="ph:book-open" width="0.85rem" />
								{cookbook.recipeUuids?.length || 0}
								{(cookbook.recipeUuids?.length || 0) === 1 ? 'recipe' : 'recipes'}
							</span>
						</div>
					</div>

					<div class="flex items-center gap-1 shrink-0">
						<a
							href={`/cookbooks/${cookbook.slug}/edit`}
							title="Edit"
							class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
						>
							<Icon icon="ph:pencil" color="#3b82f6" width="1.2rem" />
						</a>
						<button
							type="button"
							title="Delete"
							class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
							onclick={() =>
								(confirmingDeleteSlug =
									confirmingDeleteSlug === cookbook.slug ? null : cookbook.slug)}
						>
							<Icon icon="ph:trash" color="#ef4444" width="1.2rem" />
						</button>
					</div>
				</div>

				{#if confirmingDeleteSlug === cookbook.slug}
					<div class="px-3 py-2 flex items-center gap-3 border-t bg-red-50 dark:bg-red-950">
						<span class="text-sm text-gray-700 dark:text-gray-300">Delete "{cookbook.title}"?</span>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="slug" value={cookbook.slug} />
							<button type="submit" class="text-sm text-red-600 hover:underline font-semibold">
								Confirm
							</button>
						</form>
						<button
							type="button"
							class="text-sm text-gray-500 dark:text-gray-400 hover:underline"
							onclick={() => (confirmingDeleteSlug = null)}
						>
							Cancel
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
