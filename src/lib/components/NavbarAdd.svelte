<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import Icon from '$lib/components/Icon.svelte';

	let btnEl: HTMLButtonElement;

	let showDropdown = false;
</script>

<div class="relative">
	<button
		on:click={() => (showDropdown = !showDropdown)}
		class="p-1 rounded hover:bg-red-600"
		bind:this={btnEl}
	>
		<Icon icon="plus" color="#fff" width={2} />
	</button>
	{#if btnEl}
		<div
			class="absolute border right-0 top-full bg-white shadow w-60 flex flex-col"
			class:hidden={!showDropdown}
			use:clickOutside={[btnEl]}
			on:clickoutside={() => {
				showDropdown = false;
			}}
		>
			<a href="/recipes/add" class="block w-full p-3 hover:bg-gray-100">Add Recipe</a>
			<a href="/categories/add" class="block w-full p-3 hover:bg-gray-100">Add Category</a>
			<a href="/tags/add" class="block w-full p-3 hover:bg-gray-100">Add Tag</a>
		</div>
	{/if}
</div>
