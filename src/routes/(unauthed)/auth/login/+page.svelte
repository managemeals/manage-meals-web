<script lang="ts">
	import SkilletIcon from '~icons/material-symbols/skillet-outline-rounded';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Alert from '$lib/components/Alert.svelte';
	import type { ApiRes } from '$lib/types';
	import { goto } from '$app/navigation';

	let verifyForm: HTMLFormElement;

	let loginSubmitting = false;
	let verifySubmitting = false;

	let email = '';
	let password = '';

	let apiRes: ApiRes;

	const handleLoginSubmit = async () => {
		loginSubmitting = true;
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			});
			apiRes = await response.json();
			if (response.ok) {
				goto('/');
			}
		} catch (error: any) {
			apiRes.message = error.message;
			apiRes.messageType = 'error';
		} finally {
			loginSubmitting = false;
		}
	};

	const handleVerifySubmit = async () => {
		verifySubmitting = true;
		try {
			const response = await fetch('/api/auth/email-verify-resend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email
				})
			});
			apiRes = await response.json();
		} catch (error: any) {
			apiRes.message = error.message;
			apiRes.messageType = 'error';
		} finally {
			verifySubmitting = false;
		}
	};
</script>

<svelte:head>
	<title>Login - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="flex justify-center items-center h-screen bg-slate-100 px-2">
	<div class="2xl:basis-1/2 xl:basis-3/4">
		<div class="flex justify-center items-center pb-10">
			<a href="/" class="flex justify-center items-center gap-4">
				<SkilletIcon style="font-size: 2.4rem; color: #f97316;" />
				<div class="text-2xl font-bold">
					Manage<span class="text-orange-500">Meals</span>
				</div></a
			>
		</div>
		<div class="shadow-lg p-5 rounded border bg-white">
			<h1 class="text-center font-bold text-2xl pb-5">Login</h1>
			{#if apiRes?.message}
				<div class="py-4">
					<Alert variant={apiRes?.messageType || 'error'}>
						{apiRes?.message}
						{#if apiRes?.messageTypeExtra?.emailVerifyWarning}
							Please
							<button
								disabled={verifySubmitting}
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
			<form on:submit|preventDefault={handleLoginSubmit}>
				<div class="pb-5 last:pb-0">
					<label for="email" class="font-semibold pb-2 block">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						bind:value={email}
						placeholder="Email"
						class="block border-2 border-gray-200 rounded w-full p-3 bg-slate-50 focus:border-red-400 outline-none hover:border-gray-300"
					/>
					{#if apiRes?.errors?.inputs?.email?.message}
						<div class="text-sm pt-1 text-red-500">{apiRes?.errors?.inputs?.email?.message}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<label for="password" class="font-semibold pb-2 block">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						bind:value={password}
						placeholder="Password"
						class="block border-2 border-gray-200 rounded w-full p-3 bg-slate-50 focus:border-red-400 outline-none hover:border-gray-300"
					/>
					{#if apiRes?.errors?.inputs?.password?.message}
						<div class="text-sm pt-1 text-red-500">{apiRes?.errors?.inputs?.password?.message}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<button
						type="submit"
						disabled={loginSubmitting}
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
				Forgot password? Please <a
					href="/auth/forgot-password"
					class="hover:underline text-blue-500">click here</a
				> to reset your password.
			</p>
		</div>
	</div>
</div>

<form bind:this={verifyForm} on:submit|preventDefault={handleVerifySubmit}>
	<input type="hidden" id="email" name="email" bind:value={email} />
</form>
