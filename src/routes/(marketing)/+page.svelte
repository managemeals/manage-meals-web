<script lang="ts">
	import { PUBLIC_MAIN_TITLE } from '$env/static/public';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>{PUBLIC_MAIN_TITLE} - Recipe Manager</title>
</svelte:head>

<header
	class={`
		relative px-3 py-20 pb-40 before:absolute before:bg-slate-100 before:top-[-45rem] md:before:top-[-40rem]
		lg:before:top-[-55rem] xl:before:top-[-50rem]
		before:-right-60 overflow-hidden before:-left-60 before:h-[90rem]
		before:-rotate-6 before:border-b before:-z-10
	`.trim()}
>
	<div class="container mx-auto relative">
		<div class="flex flex-col lg:flex-row items-center gap-10">
			<div class="basis-2/5">
				<h1 class="font-bold text-4xl">Recipe Manager</h1>
				<h2 class="pt-5 text-lg">
					ManageMeals is a simple, easy-to-use platform to manage recipes. Import recipes by URL and
					organize them without any ads or unnecessary text.
				</h2>
				<div class="flex gap-5 pt-8">
					<a
						href="/auth/register"
						class="bg-orange-500 rounded p-3 text-white hover:bg-orange-600 shadow"
					>
						Register
					</a>
					<a
						href="https://demo.managemeals.com/auth/login"
						target="_blank"
						class="bg-green-500 rounded p-3 text-white hover:bg-green-600 shadow"
					>
						Demo
					</a>
				</div>
			</div>
			<div class="basis-3/5">
				<img
					src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/images/mmscreenshot3.png"
					alt="Screenshot"
					class="transition-transform shadow scale-100 hover:lg:scale-105"
				/>
			</div>
		</div>
	</div>
</header>

<section class="px-3 py-20 pt-0">
	<div class="container mx-auto">
		<h3 class="text-3xl font-bold text-center pb-10">Features</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:money" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Free</h4>
				</div>
				<p class="pt-3">
					ManageMeals is completely free. Simply register and start organizing your favorite
					recipes.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:layout" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Easy, Simple Interface</h4>
				</div>
				<p class="pt-3">
					Recipe websites can be overwhelming with ads and unnecessary text. Simplicity is a top
					priority for ManageMeals. Recipes are quick to browse through, and the recipe detail page
					shows all the relevant recipe information in an easy-to-use interface.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:magnifying-glass" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Searchable</h4>
				</div>
				<p class="pt-3">
					Powerful and fast search that finds what you're looking for almost instantly. Can handle
					spelling mistakes.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:device-mobile" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Responsive</h4>
				</div>
				<p class="pt-3">
					People use all kinds of devices to look at recipes in the kitchen; phones, tablets,
					laptops, etc. ManageMeals works on any screen size. It's set up so that all closely
					related information, such as ingredients and directions, stay close together even on small
					screen sizes.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:speedometer" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Fast</h4>
				</div>
				<p class="pt-3">
					ManageMeals strives to be as fast as possible when navigating the app. No waiting around,
					only recipes.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:question" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Support</h4>
				</div>
				<p class="pt-3">
					If you're having any problems, found a recipe website that's not currently supported, have
					a feature request, or anything else, then please send an email to <a
						href="mailto:support@managemeals.com"
						class="hover:underline text-blue-500">support@managemeals.com</a
					>. We reply quickly.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:browser" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Recipe Websites</h4>
				</div>
				<p class="pt-3">
					Recipes are imported by URL. ManageMeals supports hundreds of recipe websites, all of the
					most popular ones and many smaller ones. If you find a recipe website that's not
					supported, then please contact us and we'll add support for it.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:robot" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">AI</h4>
				</div>
				<p class="pt-3">
					While there is direct support for hundreds of recipe websites, not all websites have a
					predefined structure. This is where AI comes in. It will attempt to retrieve recipes from
					any website, for example blogs.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:calendar-blank" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Meal Planner (coming soon)</h4>
				</div>
				<p class="pt-3">
					<span class="italic">Work in progress</span>. Create a weekly/monthly meal plan from your
					recipes. Choose how many times you'd like to include specific categories and tags. For
					example 2x times a week fish, 3x times a week vegan and 2x times a week meat.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:shopping-cart" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Shopping List (coming soon)</h4>
				</div>
				<p class="pt-3">
					<span class="italic">Work in progress</span>. Create shopping lists from specific recipes
					and meals plans. Takes the recipe ingredients and turns them into a shopping list.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:plugs" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Browser Extension (coming soon)</h4>
				</div>
				<p class="pt-3">
					<span class="italic">Work in progress</span>. Browser extension to easily import recipes
					while browsing the web.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:share-network" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Sharing (coming soon)</h4>
				</div>
				<p class="pt-3">
					<span class="italic">Work in progress</span>. Share recipes with friends and family, or
					share a whole meal plan. Ideal for personal trainers or nutritionists who want to share a
					meal plan with their clients.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="px-3 py-20 bg-slate-100">
	<div class="container mx-auto">
		<h3 class="text-3xl font-bold text-center pb-10">How it works</h3>
		<div class="flex flex-col lg:flex-row gap-5">
			<div class="basis-2/5">
				<div class="pt-5">
					<ol class="list-decimal list-inside">
						<li class="mb-3 last:mb-0">Copy the URL of a recipe you want to save.</li>
						<li class="mb-3 last:mb-0">
							Paste the URL into the <span class="font-semibold">Add Recipe</span> form.
						</li>
						<li class="mb-3 last:mb-0">
							Optionally choose any categories or tags to apply to the recipe. This can also be done
							later.
						</li>
						<li class="mb-3 last:mb-0">Click <span class="font-semibold">Add</span>.</li>
						<li class="mb-3 last:mb-0">
							ManageMeals fetches the recipe data from the URL and saves it.
						</li>
					</ol>
				</div>
			</div>
			<div class="basis-3/5">
				<video controls muted>
					<source
						src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/videos/mmrecording.mov"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
	</div>
</section>

<section class="px-3 py-20">
	<div class="container mx-auto">
		<h3 class="text-3xl font-bold text-center pb-10">Demo</h3>
		<div class="flex flex-col lg:flex-row gap-5">
			<div class="grow">
				<div class="pt-5">
					<p>
						You can try out ManageMeals on the <a
							href="https://demo.managemeals.com/auth/login"
							class="hover:underline text-blue-500"
							target="_blank">demo website</a
						>. The demo has a collection of a 1000 fake recipes.
					</p>
					<p class="mt-1 italic">
						Create actions are disabled in the demo, such as creating recipes, categories and tags.
						The demo might also be a bit slow at times, depending on traffic. It's not running on
						the same powerful hardware as the main platform, so it's not a good indicator of how
						fast the platform is.
					</p>
				</div>
			</div>
			<div>
				<div class="bg-white p-5 shadow border rounded">
					<div class="font-semibold">Demo website URL</div>
					<div>
						<a
							href="https://demo.managemeals.com/auth/login"
							class="hover:underline text-blue-500 md:whitespace-nowrap"
							target="_blank">https://demo.managemeals.com</a
						>
					</div>
					<div class="font-semibold mt-2">Login email</div>
					<div>demo@example.com</div>
					<div class="font-semibold mt-2">Login password</div>
					<div>secret</div>
				</div>
			</div>
		</div>
	</div>
</section>
