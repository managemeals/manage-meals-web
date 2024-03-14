<script lang="ts">
	import { page } from '$app/stores';
	import { tooltip } from '$lib/actions/tooltip';
	import Icon from '$lib/components/Icon.svelte';
	import NavbarAdd from '$lib/components/NavbarAdd.svelte';
	import NavbarLeft from '$lib/components/NavbarLeft.svelte';
</script>

<nav
	class="bg-orange-500 h-16 shadow flex justify-between items-center fixed top-0 w-full z-30 px-3"
>
	<div class="flex items-center gap-4">
		<a
			href="/categories"
			class="text-white text-2xl font-semibold tracking-wide ml-1 flex gap-3 items-center group"
		>
			<div class="transition-transform translate-y-0 group-hover:-translate-y-1">
				<Icon icon="cooking-pot" color="#fff" width={2.2} />
			</div>
			<div>Manage<span class="text-white">Meals</span></div>
		</a>
	</div>
	<NavbarAdd />
</nav>
<NavbarLeft path={$page.url.pathname} />

<main class="relative pt-16 pl-16">
	<slot />
</main>
