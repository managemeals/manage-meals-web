<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/settings/user',
				icon: 'ph:user',
				title: 'User'
			},
			// {
			// 	href: '/settings/subscription',
			// 	icon: 'ph:credit-card',
			// 	title: 'Subscription'
			// },
			{
				href: '/settings/logout',
				icon: 'ph:sign-out',
				title: 'Logout'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
