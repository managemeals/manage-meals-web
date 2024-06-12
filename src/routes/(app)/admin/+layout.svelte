<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/admin/status',
				icon: 'ph:chart-bar',
				title: 'Status'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
