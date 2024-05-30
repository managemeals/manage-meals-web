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
	<div class="flex items-center justify-between mb-5">
		<h1 class="text-2xl font-bold">Subscription</h1>
		<button
			type="button"
			class="p-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-20 disabled:hover:bg-red-500"
			disabled={data.user.subscriptionType === 'FREE'}
			on:click={() => {
				showCancelModal = true;
			}}>Cancel subscription</button
		>
	</div>

	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<p class="mb-5">
		Subscription type: <span class="font-semibold">{data.user.subscriptionType}</span>
	</p>
	<h3 class="font-semibold text-lg my-3">Upcoming Payments</h3>
	{#if data.upcomingPayments.length === 0}
		<div class="italic">No upcoming payments</div>
	{/if}
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

	{#if data.user.subscriptionType !== 'PREMIUM'}
		<p class="mt-5">
			Premium subscription is <span class="font-bold text-xl">£2.90</span> per month and gives you access
			to more advanced features:
		</p>

		<ul class="list-disc list-inside mt-3">
			<li>Meal Planner</li>
			<li>Import recipes from YouTube videos</li>
			<li>Import recipes from images (<span class="italic">coming soon</span>)</li>
			<li>Shopping lists (<span class="italic">coming soon</span>)</li>
			<li><span class="italic">And more features in the works</span></li>
		</ul>

		<div class="mt-10">
			<a
				data-sveltekit-preload-data="off"
				href="/settings/subscription/mandate"
				class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600"
				>Sign up for Premium</a
			>
		</div>
	{/if}
</div>

<Modal bind:show={showCancelModal}>
	<div class="text-xl font-semibold">Cancel subscription</div>
	<p class="py-3 pb-5">Clicking the button below will cancel your subscription.</p>
	<form
		method="post"
		action="?/cancel"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				showCancelModal = false;
			};
		}}
	>
		<button type="submit" class="p-3 bg-red-500 text-white rounded hover:bg-red-600">
			Cancel subscription
		</button>
	</form>
</Modal>
