<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/settings/user',
				icon: 'user',
				title: 'User'
			},
			// {
			// 	href: '/settings/subscription',
			// 	icon: 'credit-card',
			// 	title: 'Subscription'
			// },
			{
				href: '/settings/logout',
				icon: 'sign-out',
				title: 'Logout'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
