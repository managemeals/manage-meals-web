<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { sidebarLinks } from '$lib/stores';
	import { page } from '$app/stores';
	import type { IIconHelpLink, IIconLink } from '$lib/types';
	import NavbarSearch from '$lib/components/NavbarSearch.svelte';
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const LG_BREAKPOINT = 1024;
	const SM_BREAKPOINT = 640;

	let sidebarBtnEl: HTMLButtonElement;
	let createBtnEl: HTMLButtonElement;

	let clientW: number;
	let showSidebar = true;

	let showCreateDropdown = false;

	const handleWidthChange = (w: number) => {
		if (w && w < LG_BREAKPOINT) {
			showSidebar = false;
		} else {
			showSidebar = true;
		}
	};

	$: handleWidthChange(clientW);

	const handleCloseSidebar = () => {
		if (clientW >= LG_BREAKPOINT) {
			return;
		}
		showSidebar = false;
	};

	const handleToggleSidebar = () => {
		if (!$sidebarLinks.length && clientW >= SM_BREAKPOINT) {
			return;
		}
		showSidebar = !showSidebar;
	};

	const leftNavLinks: IIconLink[] = [
		{
			href: '/categories',
			icon: 'ph:folder',
			title: 'Categories'
		},
		{
			href: '/tags',
			icon: 'ph:tag',
			title: 'Tags'
		},
		{
			href: '/search',
			icon: 'ph:magnifying-glass',
			title: 'Search'
		},
		{
			href: '/meal-plans',
			icon: 'ph:calendar-dots',
			title: 'Meal Plans'
		},
		{
			href: '/shopping-lists',
			icon: 'ph:shopping-cart',
			title: 'Shopping Lists'
		},
		{
			href: '/charts/recipes/popular',
			icon: 'ph:chart-bar',
			title: 'Charts'
		},
		{
			href: '/recipes/random',
			icon: 'ph:shuffle',
			title: 'Random'
		},
		{
			href: '/settings/user',
			icon: 'ph:gear',
			title: 'Settings'
		},
		{
			href: '/help/faq',
			icon: 'ph:question',
			title: 'Help'
		}
	];

	if (data.user?.isAdmin) {
		leftNavLinks.push({
			href: '/admin/status',
			icon: 'ph:database',
			title: 'Admin'
		});
	}

	const createLinks: IIconHelpLink[] = [
		{
			href: '/recipes/import',
			title: 'Import',
			icon: 'ph:link',
			help: 'Import a recipe by URL'
		},
		{
			href: '/recipes/create',
			title: 'Create',
			icon: 'ph:pencil',
			help: 'Create a recipe manually'
		}
	];
</script>

<div class="w-screen z-10" bind:clientWidth={clientW}></div>
<nav
	class="bg-orange-500 h-16 shadow flex justify-between items-center fixed top-0 w-full z-40 px-3 gap-3 md:gap-1"
>
	<div class="flex items-center gap-3">
		<button
			on:click={handleToggleSidebar}
			class={`
				p-1 rounded
				${!$sidebarLinks.length && clientW >= SM_BREAKPOINT ? 'hover:bg-orange-500 cursor-auto' : 'hover:bg-orange-600'}
			`.trim()}
			bind:this={sidebarBtnEl}
		>
			<Icon
				icon="ph:list"
				color={!$sidebarLinks.length && clientW >= SM_BREAKPOINT ? '#fb923c' : '#fff'}
				width="1.5rem"
			/>
		</button>
		<a
			href="/categories"
			class="text-white text-xl md:text-2xl font-semibold tracking-wide flex gap-3 items-center group ml-1"
		>
			<div class="transition-transform translate-y-0 group-hover:lg:-translate-y-1">
				<Icon icon="ph:cooking-pot" color="#fff" width="2.2rem" />
			</div>
			<div>Manage<span class="text-white">Meals</span></div>
		</a>
	</div>
	<div
		class="flex items-center gap-1 md:gap-4 flex-1 md:flex-none justify-between md:justify-start"
	>
		<a href="/help/donate" class="p-1 rounded hover:bg-orange-600" title="Donate">
			<Icon icon="ph:tip-jar" color="#fff" width="2rem" />
		</a>
		<div class="hidden md:block">
			<NavbarSearch />
		</div>
		<div class="relative">
			<button
				on:click={() => (showCreateDropdown = !showCreateDropdown)}
				class="p-1 rounded hover:bg-orange-600"
				bind:this={createBtnEl}
				title="Create"
			>
				<Icon icon="ph:plus" color="#fff" width="2rem" />
			</button>
			{#if createBtnEl}
				<div
					class="absolute right-0 top-full bg-white shadow-lg w-52 sm:w-64 flex flex-col rounded border border-slate-200"
					class:hidden={!showCreateDropdown}
					use:clickOutside={[createBtnEl]}
					on:clickoutside={() => {
						showCreateDropdown = false;
					}}
				>
					{#each createLinks as createLink}
						<a
							href={createLink.href}
							class="w-full p-3 hover:bg-gray-100 first:rounded-t last:rounded-b flex items-center gap-3"
							on:click={() => {
								showCreateDropdown = false;
							}}
						>
							<div class="hidden sm:block">
								<Icon icon={createLink.icon} color="#000" width="1.6rem" />
							</div>
							<div class="sm:hidden">
								<Icon icon={createLink.icon} color="#000" width="1.2rem" />
							</div>
							<div>
								<div>{createLink.title}</div>
								<div class="text-sm text-gray-500">{createLink.help}</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</nav>

<div
	class={`
		fixed h-[calc(100vh-4rem)] top-16 w-16 flex flex-col items-center border-r-2 z-30 bg-white transition-transform
		${showSidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
	`.trim()}
>
	<nav class="h-full flex flex-col items-center overflow-y-auto w-full">
		{#each leftNavLinks as leftNavLink}
			<a
				href={leftNavLink.href}
				class={`hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 rounded${$page.url.pathname.startsWith('/' + leftNavLink.href.split('/')[1]) && leftNavLink.href !== '/recipes/random' ? ' bg-gray-200' : ''}`}
				title={leftNavLink.title}
				on:click={handleCloseSidebar}
			>
				<Icon icon={leftNavLink.icon} color="#f97316" width="2rem" />
			</a>
		{/each}
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
		class={`
			fixed h-[calc(100vh-4rem)] top-16 w-60 sm:w-80 border-r-2 left-16 z-20
			overflow-y-auto bg-white transition-transform
			${showSidebar && $sidebarLinks.length ? 'translate-x-0' : '-translate-x-96 sm:-translate-x-80'}
		`.trim()}
	>
		{#each $sidebarLinks as sidebarLink}
			<a
				href={sidebarLink.href}
				class={`flex items-center gap-2 border-b last:border-b-0 hover:bg-gray-100 py-3 px-2${$page.url.pathname === sidebarLink.href ? ' bg-gray-100' : ''}`}
				on:click={handleCloseSidebar}
			>
				<Icon icon={sidebarLink.icon} width="1.5rem" color="#6b7280" />
				<span>{sidebarLink.title}</span>
			</a>
		{/each}
	</nav>
{/if}

<main
	class={`relative pt-16 pl-0 sm:pl-16 min-h-screen lg:min-h-0 transition-all${showSidebar && $sidebarLinks.length ? ' lg:pl-96' : ''}`}
>
	<div
		class={`absolute h-full z-10 top-0 right-0 bottom-0 left-0 bg-gray-800 opacity-75${showSidebar && clientW < LG_BREAKPOINT ? '' : ' hidden'}`}
	></div>
	{#if env.PUBLIC_MOCK_INSTANCE === 'yes'}
		<div class="text-white bg-indigo-700 p-1 font-bold">
			DEMO MODE - <span class="text-sm">Create operations are disabled</span>
		</div>
	{/if}
	<div class="container mx-auto">
		<slot />
	</div>
</main>
