<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const links = [
			{
				href: '/charts/recipes/popular',
				icon: 'ph:trend-up',
				title: 'Popular Recipes'
			}
		];

		$sidebarLinks = links;

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
