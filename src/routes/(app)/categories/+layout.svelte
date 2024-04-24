<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/categories',
				icon: 'ph:house',
				title: 'All Categories',
				isCustom: false
			},
			{
				href: '/categories/recent',
				icon: 'ph:clock',
				title: 'Most Recent',
				isCustom: false
			},
			{
				href: '/categories/uncategorized',
				icon: 'ph:tray',
				title: 'Uncategorized',
				isCustom: false
			},
			...data.categories.map((category) => ({
				href: `/categories/${category.slug}`,
				icon: 'ph:folder',
				title: category.name,
				isCustom: true
			}))
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
