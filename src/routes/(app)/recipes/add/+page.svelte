<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import Icon from '@iconify/svelte';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Add Recipe - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-3">
	<h1>Add Recipe</h1>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form method="post" use:enhance>
		<label for="url" class="block">URL</label>
		<input
			type="text"
			id="url"
			name="url"
			value={form?.inputs?.url ?? ''}
			placeholder="URL"
			class="block border rounded w-full p-3"
		/>
		{#if form?.errors?.url}
			<div class="text-sm pt-1 text-red-500">{form?.errors?.url}</div>
		{/if}
		<button type="submit" class="border p-2">
			<Icon icon="ph:circle-notch" color="#000" width="1.5rem" class="animate-spin" />
		</button>
	</form>
</div>
