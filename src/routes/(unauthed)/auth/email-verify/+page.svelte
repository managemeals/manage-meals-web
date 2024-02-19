<script lang="ts">
	import SkilletIcon from '~icons/material-symbols/skillet-outline-rounded';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Alert from '$lib/components/Alert.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ApiRes } from '$lib/types';

	let tokenForm: HTMLFormElement;

	let submitting = false;
	let submitted = false;

	let token = $page.url.searchParams.get('token');

	let apiRes: ApiRes;

	onMount(() => {
		tokenForm.requestSubmit();
	});

	const handleSubmit = async () => {
		submitting = true;
		try {
			const response = await fetch('/api/auth/email-verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token
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
	<title>Verify Email - {PUBLIC_MAIN_TITLE}</title>
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
			<h1 class="text-center font-bold text-2xl pb-5">Verify Email</h1>
			{#if apiRes?.message || apiRes?.errors?.inputs?.token?.message}
				<div class="py-4">
					<Alert variant={apiRes?.messageType || 'error'}>
						{apiRes?.message || apiRes?.errors?.inputs?.token?.message}
					</Alert>
				</div>
			{/if}
			<form bind:this={tokenForm} on:submit|preventDefault={handleSubmit}>
				<input type="hidden" id="token" name="token" bind:value={token} />
				<button
					type="submit"
					disabled={submitting}
					class="p-3 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
					class:hidden={submitted}>Verify</button
				>
			</form>
			<p class="pt-2" class:hidden={!submitted}>
				Please <a href="/auth/login" class="hover:underline text-blue-500">click here</a> to login.
			</p>
		</div>
	</div>
</div>
