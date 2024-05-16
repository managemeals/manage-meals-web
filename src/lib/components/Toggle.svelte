<script lang="ts">
	export let label: string;
	export let checked = false;
</script>

<label class="inline-flex items-center cursor-pointer">
	<input type="checkbox" value="" class="sr-only peer" bind:checked />
	<div
		class={`
      relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800
      rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
      peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white
      after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600
      peer-checked:bg-orange-500
    `.trim()}
	></div>
	<span class="ms-3">{label}</span>
</label>
