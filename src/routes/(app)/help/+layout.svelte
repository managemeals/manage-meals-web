<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/help/faq',
				icon: 'ph:question',
				title: 'FAQ'
			},
			{
				href: '/help/bookmarklet',
				icon: 'ph:bookmark-simple',
				title: 'Bookmarklet'
			},
			{
				href: '/help/contact',
				icon: 'ph:envelope',
				title: 'Contact'
			},
			{
				href: '/help/donate',
				icon: 'ph:tip-jar',
				title: 'Donate'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
