<script lang="ts">
	interface Props {
		title: string;
		x: number;
		y: number;
	}

	let { title, x, y }: Props = $props();
</script>

<div style={`top: ${y}px; left: ${x}px`} class="absolute bg-red-300 p-5 rounded border z-50">
	{title}
</div>
