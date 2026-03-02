<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

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

{@render children?.()}
