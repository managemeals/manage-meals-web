<script lang="ts">
	import { env } from '$env/dynamic/public';
	import '../app.css';
	import '../custom.css';
	import '../print.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
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
