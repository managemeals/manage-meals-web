<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<title>Logout - Settings - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Logout</h1>
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
