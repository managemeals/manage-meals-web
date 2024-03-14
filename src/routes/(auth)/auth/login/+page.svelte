<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let verifyForm: HTMLFormElement;

	export let form: ActionData;
</script>

<svelte:head>
	<title>Login - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5">Login</h1>
{#if form?.message}
	<div class="py-4">
		<Alert variant={form?.messageType || 'error'}>
			{form?.message}
			{#if form?.messageTypeExtra?.emailVerifyWarning}
				Please
				<button
					on:click={() => {
						verifyForm.requestSubmit();
					}}
					class="hover:underline text-blue-500 disabled:no-underline disabled:opacity-60"
					>click here</button
				> to resend.
			{/if}
		</Alert>
	</div>
{/if}
<form method="post" action="?/login" use:enhance>
	<div class="pb-5 last:pb-0">
		<label for="email" class="font-semibold pb-2 block">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			value={form?.inputs?.email ?? ''}
			placeholder="Email"
			class="block border-2 border-gray-200 rounded w-full p-3 bg-slate-50 focus:border-red-400 outline-none hover:border-gray-300"
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
			class="block border-2 border-gray-200 rounded w-full p-3 bg-slate-50 focus:border-red-400 outline-none hover:border-gray-300"
		/>
		{#if form?.errors?.password}
			<div class="text-sm pt-1 text-red-500">{form?.errors?.password}</div>
		{/if}
	</div>
	<div class="pb-5 last:pb-0">
		<button
			type="submit"
			class="p-3 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
			>Login</button
		>
	</div>
</form>
<p class="pt-5">
	Not registered? Please <a href="/auth/register" class="hover:underline text-blue-500"
		>click here</a
	> register.
</p>
<p class="pt-1">
	Forgot password? Please <a href="/auth/forgot-password" class="hover:underline text-blue-500"
		>click here</a
	> to reset your password.
</p>

<form bind:this={verifyForm} method="post" action="?/verify" use:enhance>
	<input type="hidden" id="email" name="email" value={form?.inputs?.email ?? ''} />
</form>
