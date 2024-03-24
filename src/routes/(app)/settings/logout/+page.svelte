<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
</script>

<svelte:head>
	<title>Logout - Settings - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-xl font-bold mb-5">Logout</h1>
	<div>
		<a
			data-sveltekit-preload-data="off"
			href="/logout"
			class="p-3 bg-orange-500 rounded text-white font-semibold hover:bg-orange-600 inline-block"
		>
			Click here to logout
		</a>
	</div>
</div>
