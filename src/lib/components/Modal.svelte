<script lang="ts">
	import Icon from '@iconify/svelte';

	export let show = false;
	export let disableOutsideClickClose = false;

	let dialog: HTMLDialogElement;

	const handleShow = (d: HTMLDialogElement, s: boolean) => {
		if (dialog && show) {
			dialog.showModal();
		} else if (dialog && !show) {
			dialog.close();
		}
	};

	$: handleShow(dialog, show);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => {
		show = false;
	}}
	on:click|self={() => {
		if (!disableOutsideClickClose) {
			dialog.close();
		}
	}}
	class="rounded shadow max-w-3xl w-full"
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
				<span class="sr-only">Close</span>
				<Icon icon="ph:x" color="#000" width="1.4rem" />
			</button>
			<slot />
		</div>
	</div>
</dialog>
