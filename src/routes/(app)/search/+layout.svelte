<script lang="ts">
	import { hasSidebar } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		$hasSidebar = false;

		return () => {
			$hasSidebar = true;
		};
	});
</script>

<slot />
