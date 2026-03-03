<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { isDark } from '$lib/stores';
	import '../app.css';
	import '../custom.css';
	import '../print.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		// Initialize store from DOM (already set by anti-FOUC inline script in app.html)
		isDark.set(document.documentElement.classList.contains('dark'));

		// Keep <html> class and localStorage in sync with store
		const unsubscribe = isDark.subscribe((dark) => {
			document.documentElement.classList.toggle('dark', dark);
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		});

		return unsubscribe;
	});
</script>

<svelte:head>
	{#if env.PUBLIC_UMAMI_ANALYTICS_ENABLED === 'true'}
		<script
			async
			src="https://umami.leafbread.io/script.js"
			data-website-id={env.PUBLIC_MOCK_INSTANCE === 'yes'
				? 'cf401ee6-82dc-4f00-a761-3680d7321f35'
				: 'cf401ee6-82dc-4f00-a761-3680d7321f35'}
		></script>
	{/if}
</svelte:head>

{@render children?.()}
