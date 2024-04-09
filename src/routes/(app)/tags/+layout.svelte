<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/tags',
				icon: 'house',
				title: 'All Tags',
				isCustom: false
			},
			{
				href: '/tags/recent',
				icon: 'clock',
				title: 'Most Recent',
				isCustom: false
			},
			{
				href: '/tags/untagged',
				icon: 'tray',
				title: 'Untagged',
				isCustom: false
			},
			...data.tags.map((tag) => ({
				href: `/tags/${tag.slug}`,
				icon: 'tag',
				title: tag.name,
				isCustom: true
			}))
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
