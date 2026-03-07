<script lang="ts">
	import { run } from 'svelte/legacy';

	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import Icon from '@iconify/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { env } from '$env/dynamic/public';
	import { sidebarLinks } from '$lib/stores';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let showDeleteModal = $state(false);

	const updateSidebarLinks = (slug: string, title: string) => {
		if (!slug || !title) return;
		sidebarLinks.update((current) => {
			return current.map((c) => {
				if (c.href === `/cookbooks/${slug}`) {
					return { ...c, title };
				}
				return c;
			});
		});
	};

	run(() => {
		updateSidebarLinks(form?.slug, form?.title);
	});
</script>

<svelte:head>
	<title>{data.cookbook.title} - Edit - Cookbooks - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex items-center justify-between mb-5">
		<h1 class="text-2xl font-bold">Edit Cookbook</h1>
		<button
			title="Delete"
			onclick={() => {
				showDeleteModal = true;
			}}
			class="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-sm"
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
		<div class="pb-5">
			<label for="title" class="font-semibold pb-2 block">Title</label>
			<input
				type="text"
				id="title"
				name="title"
				value={form?.inputs?.title ?? data.cookbook.title}
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
				>{form?.inputs?.description ?? data.cookbook.description ?? ''}</textarea
			>
		</div>
		<div class="pb-5">
			<button
				type="submit"
				class="py-3 px-5 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
				>Save</button
			>
		</div>
	</form>
</div>

<Modal bind:show={showDeleteModal}>
	<div class="text-xl font-semibold">Delete Cookbook</div>
	{#if form?.deleteMessage}
		<div class="py-2">
			<Alert variant={form?.deleteMessageType || 'error'}>
				{form?.deleteMessage}
			</Alert>
		</div>
	{/if}
	<p class="py-3 pb-5">
		Deleting a cookbook will not delete any recipes. It will only remove the cookbook itself.
	</p>
	<form method="post" action="?/delete">
		<button type="submit" class="p-3 bg-red-500 text-white rounded-sm hover:bg-red-600">
			Delete
		</button>
	</form>
</Modal>
