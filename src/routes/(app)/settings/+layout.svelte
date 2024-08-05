<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const links = [
			{
				href: '/settings/user',
				icon: 'ph:user',
				title: 'User'
			},
			{
				href: '/settings/logout',
				icon: 'ph:sign-out',
				title: 'Logout'
			}
		];

		if (env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true') {
			links.splice(1, 0, {
				href: '/settings/subscription',
				icon: 'ph:credit-card',
				title: 'Subscription'
			});
		}

		$sidebarLinks = links;

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
