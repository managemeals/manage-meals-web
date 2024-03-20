<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/settings/user',
				icon: 'gear',
				title: 'User'
			},
			{
				href: '/settings/subscription',
				icon: 'gear',
				title: 'Subscription'
			},
			{
				href: '/settings/logout',
				icon: 'gear',
				title: 'Logout'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
