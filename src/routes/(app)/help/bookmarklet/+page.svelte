<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';

	const bookmarkletCode =
		'javascript:void%20function(){const%20a=encodeURIComponent(window.location.href);window.location.href=`${%22https://managemeals.com/recipes/import%22}%3Furl=${a}`}();';
</script>

<svelte:head>
	<title>Bookmarklet - Help - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Bookmarklet</h1>

	<div class="flex">
		<div class="basis-full xl:basis-3/4">
			<p class="pb-3">
				Bookmarklets are special browser bookmarks that can do more than just open websites. The
				bookmarklet below will take the current URL, of the recipe website you're on, and open the
				recipe import form with the URL input already filled in with that URL.
			</p>

			<p class="pb-5">
				Simply drag the link below onto the browser bookmark toolbar and use it when browser recipe
				websites.
			</p>

			<div class="flex">
				<a href={bookmarkletCode} class="border rounded flex items-center gap-2 p-2 hover:shadow">
					<Icon icon="ph:bookmark-simple" width="1.5rem" color="#f97316" />
					<span>Drag to toolbar</span>
				</a>
			</div>
		</div>
	</div>
</div>
