<script lang="ts">
	import { env } from '$env/dynamic/public';
	import '../app.css';
	import '../print.css';
</script>

<svelte:head>
	{#if env.PUBLIC_UMAMI_ANALYTICS_ENABLED === 'true'}
		<script
			async
			src="https://umami.leafbread.io/script.js"
			data-website-id={env.PUBLIC_MOCK_INSTANCE === 'yes'
				? 'd3c116ad-89be-4a80-b709-39e0841a18af'
				: 'fde31535-d434-4ffe-9cf1-3fb25980af95'}
		></script>
	{/if}
</svelte:head>

<slot />
