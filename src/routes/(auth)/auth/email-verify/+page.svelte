<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let tokenForm: HTMLFormElement;

	onMount(() => {
		tokenForm.requestSubmit();
	});
</script>

<svelte:head>
	<title>Verify Email - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5">Verify Email</h1>
{#if form?.message}
	<div class="py-4">
		<Alert variant={form?.messageType || 'error'}>
			{form?.message}
		</Alert>
	</div>
{/if}
<form bind:this={tokenForm} method="post" use:enhance>
	<input type="hidden" id="token" name="token" value={$page.url.searchParams.get('token')} />
	<button
		type="submit"
		class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
		class:hidden={form?.message && form?.messageType === 'success'}>Verify</button
	>
</form>
<p class="pt-5" class:hidden={!form?.message || form?.messageType !== 'success'}>
	Please <a href="/auth/login" class="hover:underline text-blue-500">click here</a> to login.
</p>
