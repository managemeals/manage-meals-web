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
</div>
