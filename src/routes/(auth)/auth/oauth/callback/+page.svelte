<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	let stateForm: HTMLFormElement;

	onMount(() => {
		stateForm.requestSubmit();
	});
</script>

<svelte:head>
	<title>OAuth Callback - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<h1 class="text-center font-bold text-2xl pb-5 opacity-0">OAuth Callback</h1>

{#if form?.message}
	<div class="py-4">
		<Alert variant={form?.messageType || 'error'}>
			{form?.message}
		</Alert>
	</div>
{/if}

<div class="flex justify-center items-center">
	<Icon icon="ph:circle-notch" width="2rem" class="animate-spin text-orange-500" />
</div>

<form bind:this={stateForm} method="post" use:enhance class="opacity-0">
	<input type="hidden" id="state" name="state" value={$page.url.searchParams.get('state')} />
	<button
		type="submit"
		class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
		class:hidden={form?.message && form?.messageType === 'success'}>Submit</button
	>
</form>
