<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="text-center p-10">
	<h2 class="font-bold text-xl">{$page.status}</h2>
	<h3 class="pt-2">
		{$page.error?.message || ''}
	</h3>
</div>
