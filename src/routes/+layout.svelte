<script lang="ts">
	import { PUBLIC_MOCK_INSTANCE } from '$env/static/public';
	import '../app.css';
	import '../print.css';
</script>

<svelte:head>
	<script
		async
		src="https://umami.meganice.online/script.js"
		data-website-id={PUBLIC_MOCK_INSTANCE === 'yes'
			? 'bfe1bea5-5243-4965-a619-dd2ed703e9b7'
			: 'd8293365-5239-4532-97cd-a3eaf328de48'}
	></script>
</svelte:head>

<slot />
