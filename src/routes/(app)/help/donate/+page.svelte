<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Bookmarklet - Help - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Donate</h1>

	<div class="flex">
		<div class="basis-full xl:basis-3/4">
			<p class="pb-3">
				ManageMeals started as a hobby project. I wanted a way to save recipes I found online,
				without the wall of text and all the ads. Just the recipe ingredients and directions. Then I
				decided to open it up for registration and make it fully <a
					href="https://github.com/managemeals"
					class="hover:underline text-blue-500">open source</a
				>
				and
				<a
					href="https://github.com/managemeals/manage-meals-api/wiki/Self%E2%80%90hosting"
					class="hover:underline text-blue-500">self hostable</a
				>, for other people to use.
			</p>

			<p class="pb-3">
				I want ManageMeals to stay free, and without ads, forever. There are some costs involved,
				mostly server costs, so any donations would be greatly appreciated.
			</p>

			<p class="pb-5">Thank you!</p>

			<div class="flex">
				<div class="flex pb-5">
					<a
						href="https://www.paypal.com/donate/?hosted_button_id=AYX4RADAYPEXQ"
						target="_blank"
						class="border rounded flex items-center gap-2 p-2 hover:shadow"
					>
						<Icon icon="logos:paypal" width="1.5rem" />
						<span>Donate with PayPal</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
