<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let color: string | undefined = undefined;
	export let width: number = 1;
</script>

<Icon icon={`ph:${icon}`} {color} width={`${width}rem`} />
