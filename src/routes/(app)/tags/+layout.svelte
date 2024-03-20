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
				title: 'All Recipes'
			},
			{
				href: '/tags/recent',
				icon: 'clock',
				title: 'Most Recent'
			},
			{
				href: '/tags/untagged',
				icon: 'clock',
				title: 'Untagged'
			},
			...data.tags.map((tag) => ({
				href: `/tags/${tag.slug}`,
				icon: 'tag',
				title: tag.name
			}))
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
