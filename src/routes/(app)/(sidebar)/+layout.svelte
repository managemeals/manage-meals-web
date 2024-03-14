<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import Icon from '$lib/components/Icon.svelte';
	import { sidebarLinks } from '$lib/stores';
	import { page } from '$app/stores';
	import NavbarLeft from '$lib/components/NavbarLeft.svelte';
	import NavbarAdd from '$lib/components/NavbarAdd.svelte';

	const LG_BREAKPOINT = 1024;

	let sidebarBtnEl: HTMLButtonElement;

	let clientW: number;
	let showSidebar = true;

	$: if (clientW && clientW < LG_BREAKPOINT) {
		showSidebar = false;
	} else {
		showSidebar = true;
	}

	const closeSidebar = () => {
		if (clientW >= LG_BREAKPOINT) {
			return;
		}
		showSidebar = false;
	};
</script>

<nav
	class="bg-orange-500 h-16 shadow flex justify-between items-center fixed top-0 w-full z-30 px-3"
	bind:clientWidth={clientW}
>
	<div class="flex items-center gap-4">
		<button
			on:click={() => (showSidebar = !showSidebar)}
			class="p-1 rounded hover:bg-red-600"
			bind:this={sidebarBtnEl}
		>
			<Icon icon="list" color="#fff" width={1.5} />
		</button>
		<a
			href="/categories"
			class="text-white text-2xl font-semibold tracking-wide flex gap-3 items-center group"
		>
			<div class="transition-transform translate-y-0 group-hover:-translate-y-1">
				<Icon icon="cooking-pot" color="#fff" width={2.2} />
			</div>
			<div>Manage<span class="text-white">Meals</span></div>
		</a>
	</div>
	<NavbarAdd />
</nav>

<NavbarLeft path={$page.url.pathname} on:mmnavbarleftclick={closeSidebar} />

{#if sidebarBtnEl}
	<nav
		use:clickOutside={[sidebarBtnEl]}
		on:clickoutside={() => {
			if (clientW >= LG_BREAKPOINT) {
				return;
			}
			showSidebar = false;
		}}
		class={`fixed h-[calc(100vh-4rem)] top-16 w-80 border-r-2 left-16 z-10 overflow-y-auto bg-white transition-transform${showSidebar ? ' translate-x-0' : ' -translate-x-full'}`}
	>
		{#each $sidebarLinks as sidebarLink}
			<a
				href={sidebarLink.href}
				class={`flex items-center gap-2 border-b last:border-b-0 hover:bg-gray-100 p-1${$page.url.pathname === sidebarLink.href ? ' bg-gray-100' : ''}`}
				on:click={closeSidebar}
			>
				<Icon icon="house" />
				<span>{sidebarLink.title}</span>
			</a>
		{/each}
	</nav>
{/if}

<main class={`relative pt-16 pl-16 transition-all${showSidebar ? ' lg:pl-96' : ''}`}>
	<div
		class={`absolute top-0 right-0 bottom-0 left-0 bg-gray-800 opacity-75${showSidebar && clientW < LG_BREAKPOINT ? '' : ' hidden'}`}
	></div>
	<slot />
</main>
