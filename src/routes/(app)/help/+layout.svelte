<script lang="ts">
	import { sidebarLinks } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$sidebarLinks = [
			{
				href: '/help/faq',
				icon: 'question',
				title: 'FAQ'
			},
			{
				href: '/help/contact',
				icon: 'envelope',
				title: 'Contact'
			}
		];

		return () => {
			$sidebarLinks = [];
		};
	});
</script>

<slot />
