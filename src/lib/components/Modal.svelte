<script lang="ts">
	import { run, self, createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import Icon from '@iconify/svelte';

	interface Props {
		show?: boolean;
		disableOutsideClickClose?: boolean;
		children?: import('svelte').Snippet;
	}

	let { show = $bindable(false), disableOutsideClickClose = false, children }: Props = $props();

	let dialog: HTMLDialogElement;

	const handleShow = (d: HTMLDialogElement, s: boolean) => {
		if (dialog && show) {
			dialog.showModal();
		} else if (dialog && !show) {
			dialog.close();
		}
	};

	run(() => {
		handleShow(dialog, show);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => {
		show = false;
	}}
	onclick={self(() => {
		if (!disableOutsideClickClose) {
			dialog.close();
		}
	})}
	class="rounded-sm shadow-sm max-w-3xl w-full"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={stopPropagation(bubble('click'))}>
		<div class="p-5 pr-10 relative">
			<button
				type="button"
				title="Close"
				class="absolute top-2 right-2 hover:bg-gray-200 p-1 rounded-sm"
				onclick={() => {
					dialog.close();
				}}
			>
				<Icon icon="ph:x" color="#000" width="1.4rem" />
			</button>
			{@render children?.()}
		</div>
	</div>
</dialog>
