<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Reset Password - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5">Reset Password</h1>
<p class="text-center pb-5">Please choose a new password.</p>
{#if form?.message}
	<div class="py-4">
		<Alert variant={form?.messageType || 'error'}>
			{form?.message}
		</Alert>
	</div>
{/if}
<form method="post" use:enhance>
	<input type="hidden" id="token" name="token" value={$page.url.searchParams.get('token')} />
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
			>Reset</button
		>
	</div>
</form>
<p class="pt-5" class:hidden={!form?.message || form?.messageType !== 'success'}>
	Please <a href="/auth/login" class="hover:underline text-blue-500">click here</a> to login.
</p>
