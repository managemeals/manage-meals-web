<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const maxCount = $derived(
		data.importHosts.length ? Math.max(...data.importHosts.map((h) => h.count)) : 1
	);
</script>

<svelte:head>
	<title>Recipe Sources - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-2">Recipe Sources</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-5">
		Websites people use most often when importing recipes.
	</p>

	{#if !data.importHosts.length}
		<p class="italic">No imported recipes yet.</p>
	{:else}
		<ol class="space-y-3 max-w-3xl">
			{#each data.importHosts as hostStat, index}
				<li class="flex items-center gap-3">
					<span class="w-6 shrink-0 text-sm text-gray-500 dark:text-gray-400 text-right">
						{index + 1}
					</span>
					<div class="flex-1 min-w-0">
						<a
							href={`https://${hostStat.host}`}
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium truncate block mb-1 text-orange-600 hover:underline dark:text-orange-400"
							title={hostStat.host}>{hostStat.host}</a
						>
						<div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
							<div
								class="h-full rounded-full bg-orange-500"
								style={`width: ${(hostStat.count / maxCount) * 100}%`}
							></div>
						</div>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</div>
