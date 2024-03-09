<script lang="ts">
	import AddIcon from '~icons/material-symbols/add';
	import LabelIcon from '~icons/material-symbols/label-important-outline-rounded';
	import MenuIcon from '~icons/material-symbols/menu-rounded';
	import SettingsIcon from '~icons/material-symbols/settings-outline-rounded';
	import CategoryIcon from '~icons/material-symbols/category-outline-rounded';
	import HelpIcon from '~icons/material-symbols/help-outline-rounded';
	import { clickOutside } from '$lib/actions/clickOutside';

	const LG_BREAKPOINT = 1024;

	let sidebarBtnEl: HTMLButtonElement;

	let clientW: number;
	let showSidebar = true;
	let renderSidebar = false;

	$: if (clientW && clientW < LG_BREAKPOINT) {
		showSidebar = false;
	} else {
		showSidebar = true;
	}

	$: if (sidebarBtnEl) {
		renderSidebar = true;
	}

	const handleFeatureClick = () => {
		if (clientW >= LG_BREAKPOINT) {
			return;
		}
		showSidebar = false;
	};
</script>

<nav
	class="bg-orange-500 h-16 shadow flex justify-between items-center fixed top-0 w-full z-10 px-2"
	bind:clientWidth={clientW}
>
	<div class="flex items-center gap-4">
		<button
			on:click={() => (showSidebar = !showSidebar)}
			class="p-1 rounded hover:bg-red-600"
			bind:this={sidebarBtnEl}
		>
			<MenuIcon style="font-size: 2rem; color: #fff;" />
		</button>
		<a
			href="/"
			class="text-white text-2xl font-semibold tracking-wide transition-transform translate-x-0 hover:translate-x-2"
			>Manage<span class="text-white">Meals</span>
		</a>
	</div>
	<button on:click={() => {}} class="p-1 rounded hover:bg-red-600">
		<AddIcon style="font-size: 2rem; color: #fff;" />
	</button>
</nav>

{#if renderSidebar}
	<div
		class={`fixed h-[calc(100vh-4rem)] flex bg-white z-10 top-16 w-96 transition-transform${showSidebar ? ' translate-x-0' : ' -translate-x-full'}`}
		use:clickOutside={[sidebarBtnEl]}
		on:clickoutside={() => {
			if (clientW >= LG_BREAKPOINT) {
				return;
			}
			showSidebar = false;
		}}
	>
		<div class="border-r-2 h-full flex flex-col justify-between items-center basis-16">
			<nav class="h-full flex flex-col items-center overflow-y-auto w-full">
				<a
					href="/categories"
					class="hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 bg-white rounded"
					on:click={handleFeatureClick}
				>
					<CategoryIcon style="font-size: 2rem; color: #f97316;" />
				</a>
				<a
					href="/tags"
					class="hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 bg-white rounded"
					on:click={handleFeatureClick}
				>
					<LabelIcon style="font-size: 2rem; color: #f97316;" />
				</a>
				<a
					href="/settings"
					class="hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 bg-white rounded"
					on:click={handleFeatureClick}
				>
					<SettingsIcon style="font-size: 2rem; color: #f97316;" />
				</a>
			</nav>
			<nav class="flex flex-col items-center w-full">
				<a
					href="/help"
					class="hover:bg-gray-200 my-1 p-1 first:mt-3 last:mb-3 bg-white rounded"
					on:click={handleFeatureClick}
				>
					<HelpIcon style="font-size: 2rem; color: #f97316;" />
				</a>
			</nav>
		</div>
		<nav class="border-r-2 h-full overflow-y-auto grow">
			{#each { length: 10 } as _, i}
				<a href="/" class="flex items-center gap-2 border-b last:border-b-0 hover:bg-gray-100 p-1">
					<LabelIcon style="font-size: 2.2rem; color: #9ca3af;" />
					<span>All Recipes</span>
				</a>
			{/each}
		</nav>
	</div>
{/if}

<main class={`relative pt-16 transition-all${showSidebar ? ' lg:pl-96' : ' pl-0'}`}>
	<div
		class={`absolute top-0 right-0 bottom-0 left-0 bg-gray-800 opacity-75${showSidebar && clientW < LG_BREAKPOINT ? '' : ' hidden'}`}
	></div>
	<slot />
</main>
