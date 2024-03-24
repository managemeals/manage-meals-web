<script lang="ts">
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Contact - Help - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Contact</h1>
	<div class="flex">
		<div class="basis-full xl:basis-3/4">
			<p class="mb-5">
				If you got any questions, feedback, feature requests, or anything else, please send us a
				message. We reply as soon as possible, usually within a couple of hours.
			</p>
			{#if form?.message}
				<div class="py-4">
					<Alert variant={form?.messageType || 'error'}>
						{form?.message}
					</Alert>
				</div>
			{/if}
			<form method="post" use:enhance>
				<div class="pb-5 last:pb-0">
					<label for="subject" class="font-semibold pb-2 block">Subject</label>
					<input
						type="text"
						id="subject"
						name="subject"
						value={form?.inputs?.subject ?? ''}
						placeholder="Subject"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
					/>
					{#if form?.errors?.subject}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.subject}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<label for="message" class="font-semibold pb-2 block">Message</label>
					<textarea
						name="message"
						id="message"
						placeholder="Message"
						class="block border-2 border-slate-200 rounded w-full p-3 focus:border-orange-500 outline-none hover:border-slate-300"
						value={form?.inputs?.message ?? ''}
						rows="10"
					></textarea>
					{#if form?.errors?.message}
						<div class="text-sm pt-1 text-red-500">{form?.errors?.message}</div>
					{/if}
				</div>
				<div class="pb-5 last:pb-0">
					<button
						type="submit"
						class="py-3 px-5 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 disabled:bg-orange-200"
						>Send</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
