<script lang="ts">
	import { run } from 'svelte/legacy';

	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		return () => {
			mounted = false;
			$sidebarLinks = [];
		};
	});

	run(() => {
		if (!mounted) return;
		$sidebarLinks = [
			{ href: '/cookbooks', icon: 'ph:house', title: 'All Cookbooks', isCustom: false },
			{ href: '/cookbooks/create', icon: 'ph:plus', title: 'Create', isCustom: false },
			...data.cookbooks.map((cookbook) => ({
				href: `/cookbooks/${cookbook.slug}`,
				icon: 'ph:book-bookmark',
				title: cookbook.title,
				isCustom: true
			}))
		];
	});
</script>

{@render children?.()}
