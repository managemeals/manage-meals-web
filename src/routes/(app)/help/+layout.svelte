<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/help/faq',
				icon: 'gear',
				title: 'FAQ'
			},
			{
				href: '/help/contact',
				icon: 'gear',
				title: 'Contact'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
