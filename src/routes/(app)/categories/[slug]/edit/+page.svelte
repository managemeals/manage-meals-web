<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import Icon from '@iconify/svelte';
	import { sidebarLinks } from '$lib/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';

	export let data: PageData;

	export let form: ActionData;

	const updateSidebarLinks = (slug: string, name: string) => {
		if (!slug || !name) {
			return;
		}
		sidebarLinks.update((current) => {
			return current.map((c) => {
				if (c.href === `/categories/${slug}`) {
					return {
						...c,
						title: name
					};
				}
				return c;
			});
		});
	};

	$: updateSidebarLinks(form?.slug, form?.name);

	let showDeleteModal = false;
</script>

<svelte:head>
	<title>{data.category.name} - Edit - Categories - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex items-center justify-between mb-5">
		<h1 class="text-2xl font-bold">Edit Category</h1>
		<button
			title="Delete"
			on:click={() => {
				showDeleteModal = true;
			}}
			class="hover:bg-gray-200 p-1 rounded"
		>
			<Icon icon="ph:trash" color="#ef4444" width="1.5rem" />
		</button>
	</div>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form
		method="post"
		action="?/edit"
		use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
	>
		<div class="pb-5 last:pb-0">
			<label for="name" class="font-semibold pb-2 block">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				value={form?.inputs?.name ?? data.category.name}
				placeholder="Name"
				class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
			/>
			{#if form?.errors?.name}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.name}</div>
			{/if}
		</div>
		<div class="pb-5 last:pb-0">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Save</button
			>
		</div>
	</form>
</div>

<Modal bind:show={showDeleteModal}>
	<div class="text-xl font-semibold">Delete Category</div>
	{#if form?.deleteMessage}
		<div class="py-2">
			<Alert variant={form?.deleteMessageType || 'error'}>
				{form?.deleteMessage}
			</Alert>
		</div>
	{/if}
	<p class="py-3 pb-5">
		Deleting a category will not delete any recipes. It will only remove the deleted category from
		the recipes.
	</p>
	<form method="post" action="?/delete">
		<button type="submit" class="p-3 bg-red-500 text-white rounded hover:bg-red-600">
			Delete
		</button>
	</form>
</Modal>
