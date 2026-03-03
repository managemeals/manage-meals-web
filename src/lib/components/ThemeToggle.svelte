<script lang="ts">
	import Icon from '@iconify/svelte';
	import { isDark } from '$lib/stores';
</script>

<button
	onclick={() => isDark.update((d) => !d)}
	class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 my-1"
	title={$isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if $isDark}
		<Icon icon="ph:sun" color="#f97316" width="2rem" />
	{:else}
		<Icon icon="ph:moon" color="#f97316" width="2rem" />
	{/if}
</button>
