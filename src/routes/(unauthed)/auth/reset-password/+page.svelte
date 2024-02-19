<script lang="ts">
	import SkilletIcon from '~icons/material-symbols/skillet-outline-rounded';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Alert from '$lib/components/Alert.svelte';
	import { page } from '$app/stores';
	import type { ApiRes } from '$lib/types';

	let submitting = false;
	let submitted = false;

	let token = $page.url.searchParams.get('token');
	let password = '';

	let apiRes: ApiRes;

	const handleSubmit = async () => {
		submitting = true;
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token,
					password
				})
			});
			apiRes = await response.json();
			if (response.ok) {
				submitted = true;
			}
		} catch (error: any) {
			apiRes.message = error.message;
			apiRes.messageType = 'error';
		} finally {
			submitting = false;
		}
	};
</script>

<svelte:head>
	<title>Reset Password - {PUBLIC_MAIN_TITLE}</title>
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
			<h1 class="text-center font-bold text-2xl pb-5">Reset Password</h1>
			<p class="text-center pb-5">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur nesciunt nihil quos
				illo, architecto magnam consequatur aspernatur, voluptas, ex provident commodi similique
				magni adipisci quasi dolorum eligendi esse corrupti a.
			</p>
			{#if apiRes?.message || apiRes?.errors?.inputs?.token?.message}
				<div class="py-4">
					<Alert variant={apiRes?.messageType || 'error'}>
						{apiRes?.message || apiRes?.errors?.inputs?.token?.message}
					</Alert>
				</div>
			{/if}
			<form on:submit|preventDefault={handleSubmit}>
				<input type="hidden" id="token" name="token" bind:value={token} />
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
						disabled={submitting}
						class="p-3 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
						>Reset</button
					>
				</div>
			</form>
			<p class="pt-2" class:hidden={!submitted}>
				Please <a href="/auth/login" class="hover:underline text-blue-500">click here</a> to login.
			</p>
		</div>
	</div>
</div>
