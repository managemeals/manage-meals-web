<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
</script>

<div
	class="flex rounded border border-gray-200 bg-slate-100 items-center w-full ring ring-transparent focus-within:ring-orange-500 focus-within:border-transparent"
>
	<div class="p-2">
		<Icon icon="magnifying-glass" width={1.4} />
	</div>
	<input type="text" placeholder="Search" class="bg-slate-100 py-4 block w-full outline-none" />
	<button class="bg-orange-500 rounded py-2 px-3 hover:bg-orange-600 text-white mx-2">Search</button
	>
</div>
