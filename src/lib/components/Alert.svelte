<script lang="ts">
	import type { TAlert } from '$lib/types';

	interface Props {
		variant: TAlert;
		children?: import('svelte').Snippet;
	}

	let { variant, children }: Props = $props();
</script>

{#if variant === 'success'}
	<div class="bg-green-500 text-white p-2 border border-green-600 rounded">
		{@render children?.()}
	</div>
{:else if variant === 'warning'}
	<div class="bg-amber-500 text-white p-2 border border-amber-600 rounded">
		{@render children?.()}
	</div>
{:else}
	<div class="bg-red-500 text-white p-2 border border-red-600 rounded">
		{@render children?.()}
	</div>
{/if}
