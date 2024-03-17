<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Add Category - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-3">
	<h1>Add Category</h1>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form method="post" use:enhance>
		<label for="name" class="block">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			value={form?.inputs?.name ?? ''}
			placeholder="Name"
			class="block border rounded w-full p-3"
		/>
		{#if form?.errors?.name}
			<div class="text-sm pt-1 text-red-500">{form?.errors?.name}</div>
		{/if}
		<button type="submit" class="border p-2"> Add </button>
	</form>
</div>
