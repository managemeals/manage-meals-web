<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav>nav</nav>

{#if data.user}
	<div>{data.user.name}</div>
{/if}

<main>
	<slot />
</main>

<footer>footer</footer>
