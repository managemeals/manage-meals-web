<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/tags',
				icon: 'ph:house',
				title: 'All Tags',
				isCustom: false
			},
			{
				href: '/tags/recent',
				icon: 'ph:clock',
				title: 'Most Recent',
				isCustom: false
			},
			{
				href: '/tags/untagged',
				icon: 'ph:tray',
				title: 'Untagged',
				isCustom: false
			},
			{
				href: '/tags/create',
				icon: 'ph:plus',
				title: 'Create',
				isCustom: false
			},
			...data.tags.map((tag) => ({
				href: `/tags/${tag.slug}`,
				icon: 'ph:tag',
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
