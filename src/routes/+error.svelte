<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>{$page.status} - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="flex justify-center items-center pt-20">
	<a href="/" class="flex justify-center items-center gap-4">
		<Icon icon="ph:cooking-pot" color="#f97316" width="3rem" />
		<div class="text-3xl font-bold">
			Manage<span class="text-orange-500">Meals</span>
		</div>
	</a>
</div>

<div class="text-center p-10">
	<h2 class="font-bold text-3xl">{$page.status}</h2>
	<h3 class="pt-2 text-lg">
		{$page.error?.message || ''}
	</h3>
</div>
