<script lang="ts">
	import { PUBLIC_MOCK_INSTANCE } from '$env/static/public';
	import '../app.css';
	import '../print.css';
</script>

<svelte:head>
	<script
		async
		src="https://umami.hilmarp.com/script.js"
		data-website-id={PUBLIC_MOCK_INSTANCE === 'yes'
			? '71d20502-c9f7-4b47-94ce-e580015c5f7b'
			: '200a0003-82fd-4134-81ae-0ada0b65750b'}
	></script>
</svelte:head>

<slot />
