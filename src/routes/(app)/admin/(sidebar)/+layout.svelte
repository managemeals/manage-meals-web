<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/admin/status',
				icon: 'ph:chart-bar',
				title: 'Status'
			},
			{
				href: '/admin/users',
				icon: 'ph:users',
				title: 'Users'
			},
			{
				href: '/admin/recipes',
				icon: 'ph:hamburger',
				title: 'Recipes'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

{@render children?.()}
