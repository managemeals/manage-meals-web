<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<title>FAQ - Help - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">FAQ</h1>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">Does it work with any recipe website?</h3>
		<p>
			It can import recipe data from all the most popular recipe websites, for example BBC Good Food
			and Allrecipes. There is also support for hundreds more, and if there is not direct support it
			will try to guess the structure of the recipe data. If that doesn't work it will result in an
			error. However, an error doesn't mean we can't support it. If you'd like to request support
			for a recipe website, please
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

	{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
		<div class="mb-5 last:mb-0">
			<h3 class="font-semibold text-lg mb-1">Do I have to have the Premium subscription?</h3>
			<p>
				No, Premium is only to unlock more advanced features like Meal Planning and importing
				recipes from YouTube. All the basic features, like importing and organizing recipes, is
				available on the free plan.
			</p>
		</div>
	{/if}

	{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
		<div class="mb-5 last:mb-0">
			<h3 class="font-semibold text-lg mb-1">How do I cancel my subscription?</h3>
			<p>
				You are completely in control of the subscription, and can cancel at any time. Either go to
				the <a href="/settings/subscription" class="hover:underline text-blue-500"
					>subscription settings</a
				> page or cancel the Direct Debit in your banking app.
			</p>
		</div>
	{/if}

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">Can I share recipes with others?</h3>
		<p>
			Yes. Open any recipe and click the Share button to get a public link. Anyone with the link can
			view the recipe — no account required.
		</p>
	</div>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">
			Is there a quick way to import recipes while browsing?
		</h3>
		<p>
			Yes, there is a bookmarklet you can install in your browser toolbar. Once installed, clicking
			it on any recipe page will import it into {env.PUBLIC_MAIN_TITLE} in one click. You can find the
			bookmarklet in Settings.
		</p>
	</div>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">What is Cooking Mode?</h3>
		<p>
			Cooking Mode keeps your screen on while you're following a recipe, so it doesn't dim or lock
			while your hands are busy. You can enable it from any recipe page.
		</p>
	</div>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">Can I print recipes?</h3>
		<p>
			Yes. Open a recipe and press Cmd+P (Mac) or Ctrl+P (Windows/Linux). {env.PUBLIC_MAIN_TITLE}
			includes print-friendly styles for a clean output.
		</p>
	</div>

	<div class="mb-5 last:mb-0">
		<h3 class="font-semibold text-lg mb-1">Can I self-host {env.PUBLIC_MAIN_TITLE}?</h3>
		<p>
			Yes, {env.PUBLIC_MAIN_TITLE} is open source and can be self-hosted. Visit our GitHub page for setup
			instructions, or <a href="/help/contact" class="hover:underline text-blue-500">contact us</a> if
			you need help getting started.
		</p>
	</div>
</div>
