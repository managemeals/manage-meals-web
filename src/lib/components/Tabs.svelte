<script lang="ts">
	import type { ITabItem } from '$lib/types';

	interface Props {
		items: ITabItem[];
	}

	let { items }: Props = $props();
</script>

<div class="border-b">
	<ul class="flex">
		{#each items as item}
			<li>
				<button class="p-4 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500">{item.title}</button
				>
			</li>
		{/each}
	</ul>
</div>
