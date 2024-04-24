<script lang="ts">
	import { page as storePage } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let page: number;
	export let total: number;
	export let perPage: number;

	let middleItems: number[] = [];
	const setMiddleItems = (currPage: number, totalPages: number) => {
		const items: number[] = [];
		if (currPage < 4) {
			items.push(2, 3, 4, 5, 6);
		} else if (currPage > totalPages - 3) {
			items.push(totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
		} else {
			for (let i = -2; i <= 2; i++) {
				items.push(page + i);
			}
		}
		middleItems = items;
	};

	$: pages = Math.ceil(total / perPage);

	$: setMiddleItems(page, pages);
</script>

<div class="overflow-auto" class:hidden={!total}>
	{#if pages <= 6}
		<div class="flex">
			<div class="border p-2 rounded-l flex justify-center items-center opacity-30">
				<span class="sr-only">Previous</span>
				<Icon icon="ph:caret-left" width="1rem" />
			</div>
			{#each { length: pages } as _, i}
				<a
					href={`?${new URLSearchParams({ ...Object.fromEntries($storePage.url.searchParams), page: (i + 1).toString() }).toString()}`}
					class={`border py-2 px-4 ${i + 1 === page ? 'bg-orange-500 hover:bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100'}`}
					>{i + 1}</a
				>
			{/each}
			<div class="border p-2 rounded-r flex justify-center items-center opacity-30">
				<span class="sr-only">Next</span>
				<Icon icon="ph:caret-right" width="1rem" />
			</div>
		</div>
	{:else}
		<div class="flex">
			{#if page < 2}
				<div class="border p-2 rounded-l flex justify-center items-center opacity-30">
					<span class="sr-only">Previous</span>
					<Icon icon="ph:caret-left" width="1rem" />
				</div>
			{:else}
				<a
					href={`?${new URLSearchParams({ ...Object.fromEntries($storePage.url.searchParams), page: (page - 1).toString() }).toString()}`}
					class="border p-2 rounded-l flex justify-center items-center hover:bg-gray-100"
				>
					<span class="sr-only">Previous</span>
					<Icon icon="ph:caret-left" width="1rem" />
				</a>
			{/if}
			<a
				href={`?${new URLSearchParams({ ...Object.fromEntries($storePage.url.searchParams), page: '1' }).toString()}`}
				class={`border py-2 px-4 ${page < 2 ? 'bg-orange-500 hover:bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100'}`}
				>1</a
			>
			<div class="border py-2 px-4">...</div>
			{#each middleItems as middleItem}
				<a
					href={`?${new URLSearchParams({ ...Object.fromEntries($storePage.url.searchParams), page: middleItem.toString() }).toString()}`}
					class={`border py-2 px-4 ${page === middleItem ? 'bg-orange-500 hover:bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100'}`}
					>{middleItem}</a
				>
			{/each}
			<div class="border py-2 px-4">...</div>
			<a
				href={`?${new URLSearchParams({ ...Object.fromEntries($storePage.url.searchParams), page: pages.toString() }).toString()}`}
				class={`border py-2 px-4 ${page >= pages ? 'bg-orange-500 hover:bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-100'}`}
				>{pages}</a
			>
			{#if page >= pages}
				<div class="border p-2 rounded-r flex justify-center items-center opacity-30">
					<span class="sr-only">Next</span>
					<Icon icon="ph:caret-right" width="1rem" />
				</div>
			{:else}
				<a
					href={`?${new URLSearchParams({ ...Object.fromEntries($storePage.url.searchParams), page: (page + 1).toString() }).toString()}`}
					class="border p-2 rounded-r flex justify-center items-center hover:bg-gray-100"
				>
					<span class="sr-only">Next</span>
					<Icon icon="ph:caret-right" width="1rem" />
				</a>
			{/if}
		</div>
	{/if}
</div>
