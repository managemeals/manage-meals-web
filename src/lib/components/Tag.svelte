<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="bg-gray-100 dark:bg-gray-700 rounded-sm p-1 text-sm">
	{@render children?.()}
</div>
