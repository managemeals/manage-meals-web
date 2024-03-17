<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/categories',
				icon: 'house',
				title: 'All Recipes'
			},
			{
				href: '/categories/recent',
				icon: 'clock',
				title: 'Most Recent'
			},
			{
				href: '/categories/uncategorized',
				icon: 'clock',
				title: 'Uncategorized'
			},
			...data.categories.map((category) => ({
				href: `/categories/${category.slug}`,
				icon: 'gear',
				title: category.name
			}))
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
