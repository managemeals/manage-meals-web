<script lang="ts">
	import Icon from '@iconify/svelte';

	export let show = false;

	let dialog: HTMLDialogElement;

	$: if (dialog && show) {
		dialog.showModal();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => {
		show = false;
	}}
	on:click|self={() => {
		dialog.close();
	}}
	class="rounded shadow max-w-3xl"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<div class="p-5 pr-10 relative">
			<button
				type="button"
				class="absolute top-2 right-2 hover:bg-gray-200 p-1 rounded"
				on:click={() => {
					dialog.close();
				}}
			>
				<Icon icon="ph:x" color="#000" width="1.4rem" />
			</button>
			<slot />
		</div>
	</div>
</dialog>
