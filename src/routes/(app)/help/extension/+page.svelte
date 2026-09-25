<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Extension - Help - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Extension</h1>

	<div class="flex">
		<div class="basis-full xl:basis-3/4">
			<p class="pb-3">
				The ManageMeals browser extension lets you add recipes from anywhere while you browse. It adds
				a button to your browser that opens a popup, so you can quickly import the recipe you're
				looking at without leaving the page.
			</p>

			<p class="pb-5">
				Install the extension below, then click its button on any recipe website to add it to your
				recipe collection.
			</p>

			<div class="flex">
				<a
					href="https://addons.mozilla.org/en-GB/firefox/addon/managemeals/"
					target="_blank"
					class="border rounded-sm flex items-center gap-2 p-2 hover:shadow-sm"
				>
					<Icon icon="ph:puzzle-piece" width="1.5rem" color="#f97316" />
					<span>Get it for Firefox</span>
				</a>
			</div>
		</div>
	</div>
</div>
