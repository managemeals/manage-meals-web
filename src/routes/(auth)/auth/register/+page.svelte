<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	let submitting = false;
</script>

<svelte:head>
	<title>Register - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5">Register</h1>

{#if env.PUBLIC_ENABLE_GOOGLE_OAUTH === 'true'}
	<div class="flex pb-5">
		<a
			href={env.PUBLIC_GOOGLE_OAUTH_URL}
			class="border rounded flex items-center gap-2 p-2 hover:shadow"
		>
			<Icon icon="logos:google-icon" width="1.5rem" />
			<span>Login with Google</span>
		</a>
	</div>
{/if}

{#if form?.message}
	<div class="py-4">
		<Alert variant={form?.messageType || 'error'}>
			{form?.message}
		</Alert>
	</div>
{/if}

<form
	method="post"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}}
>
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
		<label for="email" class="font-semibold pb-2 block">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			value={form?.inputs?.email ?? ''}
			placeholder="Email"
			class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
		/>
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
			class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
		/>
		{#if form?.errors?.password}
			<div class="text-sm pt-1 text-red-500">{form?.errors?.password}</div>
		{/if}
	</div>
	<div class="pb-5 last:pb-0">
		<button
			type="submit"
			disabled={submitting}
			class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>Register</button
		>
	</div>
</form>
<p class="pt-5">
	Already registered? Please <a href="/auth/login" class="hover:underline text-blue-500"
		>click here</a
	> to login.
</p>
