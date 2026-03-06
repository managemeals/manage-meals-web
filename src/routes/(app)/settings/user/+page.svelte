<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { isDark } from '$lib/stores';

	interface Props {
		form: ActionData;
		data: PageData;
	}

	let { form, data }: Props = $props();

	let showDeleteModal = $state(false);
</script>

<svelte:head>
	<title>User - Settings - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex items-center justify-between mb-5">
		<h1 class="text-2xl font-bold">User Settings</h1>
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
	<div class="flex">
		<div class="basis-full xl:basis-3/4">
			{#if form?.message}
				<div class="py-4">
					<Alert variant={form?.messageType || 'error'}>
						{form?.message}
					</Alert>
				</div>
			{/if}
			<form
				method="post"
				action="?/settings"
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
						value={form?.inputs?.name ?? data.user.name}
						placeholder="Name"
						class="block border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-gray-300"
					/>
					{#if form?.errors?.name}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.name}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<label for="email" class="font-semibold pb-2 block">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={form?.inputs?.email ?? data.user.email}
						placeholder="Email"
						class="block border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-gray-300"
					/>
					{#if env.PUBLIC_EMAIL_VERIFY_ENABLED === 'true'}
						<p class="text-sm text-gray-500 dark:text-gray-400 pt-1">
							Changing your email will send a verification email
						</p>
					{/if}
					{#if form?.errors?.email}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.email}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<label for="password" class="font-semibold pb-2 block">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Password"
						class="block border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-500 rounded-sm w-full p-3 focus:border-orange-500 outline-hidden hover:border-gray-300"
					/>
					<p class="text-sm text-gray-500 dark:text-gray-400 pt-1">
						Only fill this out if you want to change your password
					</p>
					{#if form?.errors?.password}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.password}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<button
						type="submit"
						class="p-3 bg-orange-500 rounded-sm text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
						>Save</button
					>
				</div>
			</form>
		</div>
	</div>
	<div class="mt-8">
		<h2 class="text-lg font-semibold mb-3">Appearance</h2>
		<div class="flex items-center gap-3">
			<ThemeToggle />
			<span>{$isDark ? 'Dark mode' : 'Light mode'}</span>
		</div>
	</div>
</div>

<Modal bind:show={showDeleteModal}>
	<div class="text-xl font-semibold">Delete User</div>
	{#if form?.deleteUser}
		<div class="py-2">
			<Alert variant={form?.deleteUserType || 'error'}>
				{form?.deleteUser}
			</Alert>
		</div>
	{/if}
	<p class="py-3 pb-5">
		Clicking the delete button below will delete your user and all data related to the user, such as
		recipes.
	</p>
	<form method="post" action="?/delete">
		<button type="submit" class="p-3 bg-red-500 text-white rounded-sm hover:bg-red-600">
			Delete
		</button>
	</form>
</Modal>
