<script lang="ts">
	import type { ISidebarLink } from '$lib/types';
	import Icon from '$lib/components/Icon.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let path: string;

	const leftNavLinks: ISidebarLink[] = [
		{
			href: '/categories',
			icon: 'folder',
			title: 'Categories'
		},
		{
			href: '/tags',
			icon: 'tag',
			title: 'Tags'
		},
		{
			href: '/settings',
			icon: 'gear',
			title: 'Settings'
		}
	];

	const clickNavItem = () => {
		dispatch('mmnavbarleftclick');
	};
</script>

<div
	class="fixed h-[calc(100vh-4rem)] top-16 w-16 flex flex-col justify-between items-center border-r-2 z-20 bg-white"
>
	<nav class="h-full flex flex-col items-center overflow-y-auto w-full">
		{#each leftNavLinks as leftNavLink}
			<a
				href={leftNavLink.href}
				class={`hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 rounded${path.startsWith(leftNavLink.href) ? ' bg-gray-200' : ''}`}
				title={leftNavLink.title}
				on:click={clickNavItem}
			>
				<Icon icon={leftNavLink.icon} color="#f97316" width={2} />
			</a>
		{/each}
	</nav>
	<nav class="flex flex-col items-center w-full">
		<a
			href="/help"
			class={`hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 rounded${path.startsWith('/help') ? ' bg-gray-200' : ''}`}
			title="Help"
			on:click={clickNavItem}
		>
			<Icon icon="question" color="#f97316" width={2} />
		</a>
	</nav>
</div>
