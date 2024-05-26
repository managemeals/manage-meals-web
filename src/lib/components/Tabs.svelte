<script lang="ts">
	import type { ITabItem } from '$lib/types';

	export let items: ITabItem[];
</script>

<div class="border-b">
	<ul class="flex">
		{#each items as item}
			<li>
				<button class="p-4 border-b-2 border-transparent hover:border-gray-300">{item.title}</button
				>
			</li>
		{/each}
	</ul>
</div>
