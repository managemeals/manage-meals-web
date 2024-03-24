<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	let submitting = false;
</script>

<svelte:head>
	<title>Register - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5">Register</h1>
<div class="flex flex-col items-center gap-2 md:flex-row md:gap-10 md:justify-center">
	<div class="flex items-end gap-1">
		<div class="font-bold text-3xl md:text-5xl">£2.90</div>
		<div class="text-gray-600">/month</div>
	</div>
	<ul class="pt-3">
		<li class="flex items-center gap-2 pb-1 last:pb-0">
			<Icon icon="ph:check-circle" color="#22c55e" width="1rem" />
			<div>All available features, and all future ones</div>
		</li>
		<li class="flex items-center gap-2 pb-1 last:pb-0">
			<Icon icon="ph:check-circle" color="#22c55e" width="1rem" />
			<div>Unlimited recipes</div>
		</li>
		<li class="flex items-center gap-2 pb-1 last:pb-0">
			<Icon icon="ph:check-circle" color="#22c55e" width="1rem" />
			<div>Unlimited support</div>
		</li>
		<li class="flex items-center gap-2 pb-1 last:pb-0">
			<Icon icon="ph:check-circle" color="#22c55e" width="1rem" />
			<div>First month is free</div>
		</li>
		<li class="flex items-center gap-2 pb-1 last:pb-0">
			<Icon icon="ph:check-circle" color="#22c55e" width="1rem" />
			<div>Cancel anytime</div>
		</li>
		<li class="flex items-center gap-2 pb-1 last:pb-0">
			<Icon icon="ph:check-circle" color="#22c55e" width="1rem" />
			<div>No ads</div>
		</li>
	</ul>
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
		<p class="pb-5">
			When you click <em>Register</em> you'll be taken to a payment website where you setup Direct
			debit. No payment is taken for the first month, and you'll be notified couple of days before
			the first payment is taken. You can keep track of upcoming payments in <em>Settings</em>.
		</p>
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
