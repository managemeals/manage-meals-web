<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import Icon from '$lib/components/Icon.svelte';
	import { hasSidebar, sidebarLinks } from '$lib/stores';
	import { page } from '$app/stores';
	import type { IIconLink, ILink } from '$lib/types';
	import NavbarSearch from '$lib/components/NavbarSearch.svelte';
	import { PUBLIC_MOCK_INSTANCE } from '$env/static/public';

	const LG_BREAKPOINT = 1024;

	let sidebarBtnEl: HTMLButtonElement;
	let addBtnEl: HTMLButtonElement;

	let clientW: number;
	let showSidebar = true;

	let showAddDropdown = false;

	const handleWidthChange = (w: number) => {
		if (w && w < LG_BREAKPOINT) {
			showSidebar = false;
		} else {
			showSidebar = true;
		}
	};

	$: handleWidthChange(clientW);

	const closeSidebar = () => {
		if (clientW >= LG_BREAKPOINT) {
			return;
		}
		showSidebar = false;
	};

	const leftNavLinks: IIconLink[] = [
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
			href: '/search',
			icon: 'magnifying-glass',
			title: 'Search'
		},
		{
			href: '/settings/user',
			icon: 'gear',
			title: 'Settings'
		}
	];

	const addLinks: ILink[] = [
		{
			href: '/recipes/add',
			title: 'Add Recipe'
		},
		{
			href: '/categories/add',
			title: 'Add Category'
		},
		{
			href: '/tags/add',
			title: 'Add Tag'
		}
	];
</script>

<div class="w-screen z-10" bind:clientWidth={clientW}></div>
<nav
	class="bg-orange-500 h-16 shadow flex justify-between items-center fixed top-0 w-full z-30 px-3"
>
	<div class="flex items-center gap-3">
		<button
			on:click={() => (showSidebar = !showSidebar)}
			class="p-1 rounded hover:bg-orange-600"
			class:hidden={!$hasSidebar}
			bind:this={sidebarBtnEl}
		>
			<Icon icon="list" color="#fff" width={1.5} />
		</button>
		<a
			href="/categories"
			class="text-white text-2xl font-semibold tracking-wide flex gap-3 items-center group ml-1"
		>
			<div class="transition-transform translate-y-0 group-hover:-translate-y-1">
				<Icon icon="cooking-pot" color="#fff" width={2.2} />
			</div>
			<div>Manage<span class="text-white">Meals</span></div>
		</a>
		{#if PUBLIC_MOCK_INSTANCE === 'yes'}
			<div class="text-white bg-indigo-700 p-1 font-bold">
				DEMO MODE - <span class="text-sm">Create operations are disabled</span>
			</div>
		{/if}
	</div>
	<div class="flex items-center gap-4">
		<div class="hidden md:block">
			<NavbarSearch />
		</div>
		<div class="relative">
			<button
				on:click={() => (showAddDropdown = !showAddDropdown)}
				class="p-1 rounded hover:bg-orange-600"
				bind:this={addBtnEl}
				title="Add"
			>
				<Icon icon="plus" color="#fff" width={2} />
			</button>
			{#if addBtnEl}
				<div
					class="absolute right-0 top-full bg-white shadow-lg w-60 flex flex-col rounded"
					class:hidden={!showAddDropdown}
					use:clickOutside={[addBtnEl]}
					on:clickoutside={() => {
						showAddDropdown = false;
					}}
				>
					{#each addLinks as addLink}
						<a
							href={addLink.href}
							class="block w-full p-3 hover:bg-gray-100 first:rounded-t last:rounded-b"
							on:click={() => {
								showAddDropdown = false;
							}}>{addLink.title}</a
						>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</nav>

<div
	class="fixed h-[calc(100vh-4rem)] top-16 w-16 flex flex-col justify-between items-center border-r-2 z-20 bg-white"
>
	<nav class="h-full flex flex-col items-center overflow-y-auto w-full">
		{#each leftNavLinks as leftNavLink}
			<a
				href={leftNavLink.href}
				class={`hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 rounded${$page.url.pathname.startsWith('/' + leftNavLink.href.split('/')[1]) ? ' bg-gray-200' : ''}`}
				title={leftNavLink.title}
				on:click={closeSidebar}
			>
				<Icon icon={leftNavLink.icon} color="#f97316" width={2} />
			</a>
		{/each}
	</nav>
	<nav class="flex flex-col items-center w-full">
		<a
			href="/help/faq"
			class={`hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 rounded${$page.url.pathname.startsWith('/help') ? ' bg-gray-200' : ''}`}
			title="Help"
			on:click={closeSidebar}
		>
			<Icon icon="question" color="#f97316" width={2} />
		</a>
	</nav>
</div>

{#if sidebarBtnEl}
	<nav
		use:clickOutside={[sidebarBtnEl]}
		on:clickoutside={() => {
			if (clientW >= LG_BREAKPOINT) {
				return;
			}
			showSidebar = false;
		}}
		class={`fixed h-[calc(100vh-4rem)] top-16 w-80 border-r-2 left-16 z-10 overflow-y-auto bg-white transition-transform${showSidebar && $hasSidebar ? ' translate-x-0' : ' -translate-x-full'}`}
	>
		{#each $sidebarLinks as sidebarLink}
			<a
				href={sidebarLink.href}
				class={`flex items-center gap-2 border-b last:border-b-0 hover:bg-gray-100 py-3 px-2${$page.url.pathname === sidebarLink.href ? ' bg-gray-100' : ''}`}
				on:click={closeSidebar}
			>
				<Icon icon={sidebarLink.icon} width={1.5} color="#6b7280" />
				<span>{sidebarLink.title}</span>
			</a>
		{/each}
	</nav>
{/if}

<main class={`relative pt-16 pl-16 transition-all${showSidebar && $hasSidebar ? ' lg:pl-96' : ''}`}>
	<div
		class={`absolute h-screen top-0 right-0 bottom-0 left-0 bg-gray-800 opacity-75${showSidebar && $hasSidebar && clientW < LG_BREAKPOINT ? '' : ' hidden'}`}
	></div>
	<slot />
</main>
