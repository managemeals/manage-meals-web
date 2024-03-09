<script lang="ts">
	import type { TAlert } from '$lib/types';

	export let variant: TAlert;
</script>

{#if variant === 'success'}
	<div class="bg-green-500 text-white p-2 border border-green-600 rounded">
		<slot />
	</div>
{:else if variant === 'warning'}
	<div class="bg-amber-500 text-white p-2 border border-amber-600 rounded">
		<slot />
	</div>
{:else}
	<div class="bg-red-500 text-white p-2 border border-red-600 rounded">
		<slot />
	</div>
{/if}
