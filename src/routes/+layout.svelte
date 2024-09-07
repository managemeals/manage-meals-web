<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { PUBLIC_UMAMI_ANALYTICS_ENABLED } from '$env/static/public';
	import '../app.css';
	import '../print.css';
</script>

<svelte:head>
	{#if PUBLIC_UMAMI_ANALYTICS_ENABLED === 'true'}
		<script
			async
			src="https://umami.meganice.online/script.js"
			data-website-id={env.PUBLIC_MOCK_INSTANCE === 'yes'
				? 'bfe1bea5-5243-4965-a619-dd2ed703e9b7'
				: 'd8293365-5239-4532-97cd-a3eaf328de48'}
		></script>
	{/if}
</svelte:head>

<slot />
