<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import { format } from 'date-fns';
	import type { ActionData, PageData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';

	export let data: PageData;

	export let form: ActionData;

	let showCancelModal = false;
</script>

<svelte:head>
	<title>Subscription - Settings - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold mb-5">Subscription</h1>
		<button
			type="button"
			class="p-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
			on:click={() => {
				showCancelModal = true;
			}}>Cancel subscription</button
		>
	</div>

	<h3 class="font-semibold text-lg mb-3">Upcoming Payments</h3>
	<div>
		{#each data.upcomingPayments as payment}
			<div class="mb-3 last:mb-0">
				<div>{format(payment.chargeDate, 'd MMM yyyy')}</div>
				<div class="font-semibold text-lg">
					{(payment.amount / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
				</div>
			</div>
		{/each}
	</div>
</div>

<Modal bind:show={showCancelModal}>
	<div class="text-xl font-semibold">Cancel subscription</div>
	{#if form?.message}
		<div class="py-2">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<p class="py-3 pb-5">Clicking the button below will cancel your subscription and logout.</p>
	<form method="post" action="?/cancel" use:enhance>
		<button type="submit" class="p-3 bg-red-500 text-white rounded hover:bg-red-600">
			Cancel subscription
		</button>
	</form>
</Modal>
