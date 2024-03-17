<script lang="ts">
	export let title: string;
	export let x: number;
	export let y: number;
</script>

<div style={`top: ${y}px; left: ${x}px`} class="absolute bg-red-300 p-5 rounded border z-50">
	{title}
</div>
