<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<div class="relative">
	<button
		class="p-2 border border-slate-200 rounded hover:bg-slate-100 flex items-center gap-2 w-full justify-between"
	>
		<span>Categories</span>
		<Icon icon="ph:caret-down" color="#000" width="1.2rem" />
	</button>
	<div
		class="absolute left-0 top-full bg-white shadow-lg w-52 sm:w-60 flex flex-col rounded border border-slate-200"
	>
		{#each { length: 10 } as _, i}
			<a href="/" class="block w-full p-3 hover:bg-gray-100 first:rounded-t last:rounded-b">Link</a>
		{/each}
	</div>
</div>
