<script lang="ts">
	import type { ActionData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="p-3">
	<h1>Contact</h1>
	{#if form?.message}
		<div class="py-4">
			<Alert variant={form?.messageType || 'error'}>
				{form?.message}
			</Alert>
		</div>
	{/if}
	<form method="post" use:enhance>
		<div>
			<label for="subject">Subject</label>
			<input
				type="text"
				id="subject"
				name="subject"
				value={form?.inputs?.subject ?? ''}
				placeholder="Subject"
				class="block border rounded w-full p-3"
			/>
			{#if form?.errors?.subject}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.subject}</div>
			{/if}
		</div>
		<div>
			<label for="Message">Message</label>
			<textarea
				name="message"
				id="message"
				placeholder="Message"
				class="border rounded w-full p-3"
				value={form?.inputs?.message ?? ''}
			></textarea>
			{#if form?.errors?.message}
				<div class="text-sm pt-1 text-red-500">{form?.errors?.message}</div>
			{/if}
		</div>
		<div>
			<button type="submit" class="border p-2">Send</button>
		</div>
	</form>
</div>
