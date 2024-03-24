<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import { sidebarLinks } from '$lib/stores';
	import { goto } from '$app/navigation';

	export let form: ActionData;

	const updateSidebarLinks = (slug: string, name: string) => {
		if (!slug || !name) {
			return;
		}
		sidebarLinks.update((current) => {
			const nonCustom = current.filter((c) => !c.isCustom);
			const custom = current.filter((c) => c.isCustom);
			return [
				...nonCustom,
				...[
					...custom,
					{
						href: `/categories/${form?.slug}`,
						title: form?.name,
						icon: 'folder',
						isCustom: true
					}
				].sort((a, b) => a.title.localeCompare(b.title))
			];
		});
		goto(`/categories/${slug}`);
	};

	$: updateSidebarLinks(form?.slug, form?.name);
</script>

<svelte:head>
	<title>Add Category - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Add Category</h1>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form method="post" use:enhance>
		<div class="pb-5 last:pb-0">
			<label for="name" class="font-semibold pb-2 block">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				value={form?.inputs?.name ?? ''}
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
				>Add</button
			>
		</div>
	</form>
</div>
