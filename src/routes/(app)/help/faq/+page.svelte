<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
</script>

<svelte:head>
	<title>FAQ - Help - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-xl font-bold mb-5">FAQ</h1>
	{#each { length: 10 } as _, i}
		<div class="mb-5 last:mb-0">
			<h3 class="font-semibold text-lg">What is this?</h3>
			<p>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, iste ipsa laboriosam laborum
				eos modi quasi soluta culpa? Aut, temporibus necessitatibus ducimus officia expedita
				suscipit blanditiis doloremque nulla dolores saepe.
			</p>
		</div>
	{/each}
</div>
