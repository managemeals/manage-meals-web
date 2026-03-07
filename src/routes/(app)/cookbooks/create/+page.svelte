<script lang="ts">
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>Create Cookbook - Cookbooks - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Create Cookbook</h1>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form method="post" use:enhance>
		<div class="pb-5">
			<label for="title" class="font-semibold pb-2 block">Title</label>
			<input
				type="text"
				id="title"
				name="title"
				value={form?.inputs?.title ?? ''}
				placeholder="Title"
				class="block border-2 border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-slate-300"
			/>
			{#if form?.errors?.title}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.title}</div>
			{/if}
		</div>
		<div class="pb-5">
			<label for="description" class="font-semibold pb-2 block">Description (optional)</label>
			<textarea
				id="description"
				name="description"
				placeholder="Description"
				rows="3"
				class="block border-2 border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-slate-300"
				>{form?.inputs?.description ?? ''}</textarea
			>
		</div>
		<div class="pb-5">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Create</button
			>
		</div>
	</form>
</div>
