<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';

	export let form: ActionData;

	let verifyForm: HTMLFormElement;
</script>

<svelte:head>
	<title>Login - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5">Login</h1>
{#if env.PUBLIC_MOCK_INSTANCE === 'yes'}
	<div class="mb-5 border-2 border-indigo-700 p-2">
		For the demo, please login using the email <strong>demo@example.com</strong> with the password
		<strong>secret</strong>.
	</div>
{/if}
{#if form?.message}
	<div class="py-4">
		<Alert variant={form?.messageType || 'error'}>
			{#if form?.message.startsWith('Email not verified')}
				Email not verified, please check your email for a link to verify. Didn't receive a verify
				email? Please
				<button
					on:click={() => {
						verifyForm.requestSubmit();
					}}
					class="hover:underline text-blue-500 disabled:no-underline disabled:opacity-60"
					>click here</button
				> to resend.
			{:else}
				{form?.message}
			{/if}
		</Alert>
	</div>
{/if}
<form method="post" action="?/login" use:enhance>
	<input type="hidden" id="goto" name="goto" value={$page.url.searchParams.get('goto')} />
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
			class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
		>
			Login
		</button>
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
