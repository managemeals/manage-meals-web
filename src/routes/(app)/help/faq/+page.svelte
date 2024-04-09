<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
</script>

<svelte:head>
	<title>FAQ - Help - {PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-xl font-bold mb-5">FAQ</h1>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">Does it work with any recipe website?</h3>
		<p>
			It can retrieve recipe data from all the most popular recipe websites, for example BBC Good
			Food and Allrecipes. There is also support for hundreds more, and if there is not direct
			support it will try to guess the structure of the recipe data. If that doesn't work it will
			result in an error. However, an error doesn't mean we can't support it. If you'd like to
			request support for a recipe website, please
			<a href="/help/contact" class="hover:underline text-blue-500">contact us</a> and we will add support
			for it.
		</p>
	</div>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">What's the difference between a category and a tag?</h3>
		<p>
			The idea is that categories are for top-level organization, usually meaning which course a
			recipe belongs to: Starter, Main, Side Dish, Dessert. Tags can then be used to attach more
			specific info to a recipe, for example: Vegan, BBQ, Steak, Gluten-free. It can then be used to
			find a Main which is Vegan.
		</p>
	</div>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">I have a feature request, can you add it?</h3>
		<p>
			Yes, most likely. We want to add the features that people ask for. Please
			<a href="/help/contact" class="hover:underline text-blue-500">contact us</a> and tell us about
			your idea.
		</p>
	</div>
</div>
