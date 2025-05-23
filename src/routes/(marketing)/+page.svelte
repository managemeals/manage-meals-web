<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>{env.PUBLIC_MAIN_TITLE} - Recipe Manager</title>
	<meta
		name="description"
		content="ManageMeals is a simple, easy-to-use platform to manage recipes. Import recipes by URL and organize them without any ads or unnecessary text."
	/>
	<meta property="og:title" content={`${env.PUBLIC_MAIN_TITLE} - Recipe Manager`} />
	<meta
		property="og:image"
		content="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/images/mmscreenshot7.webp"
	/>
	<meta property="og:image:width" content="1690" />
	<meta property="og:image:height" content="1280" />
	<meta
		property="og:description"
		content="ManageMeals is a simple, easy-to-use platform to manage recipes. Import recipes by URL and organize them without any ads or unnecessary text."
	/>
	<meta property="og:url" content="https://managemeals.com/" />
	<meta property="og:type" content="website" />
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
					src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/images/mmscreenshot7.webp"
					alt="Web app screenshot"
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
			{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
				<div>
					<div class="flex items-center gap-2">
						<Icon icon="ph:money" color="#f97316" width="2.2rem" />
						<h4 class="text-xl font-semibold">Free</h4>
					</div>
					<p class="pt-3">
						The basic features of ManageMeals are completely free. Such as importing and organizing
						recipes. Premium subscription is only for more advanced features, e.g. Meal Plans.
					</p>
				</div>

				<div>
					<div class="flex items-center gap-2">
						<Icon icon="ph:seal-check" color="#f97316" width="2.2rem" />
						<h4 class="text-xl font-semibold">Premium</h4>
					</div>
					<p class="pt-3">
						More advanced features are unlocked with a Premium subscription. For example Meal Plans,
						Shopping Lists, and importing recipes from YouTube. Premium subscription is <span
							class="font-bold">{env.PUBLIC_PREMIUM_PRICE}</span
						> per month.
					</p>
				</div>
			{:else}
				<div>
					<div class="flex items-center gap-2">
						<Icon icon="ph:money" color="#f97316" width="2.2rem" />
						<h4 class="text-xl font-semibold">Free</h4>
					</div>
					<p class="pt-3">
						ManageMeals is completely free. Save your favourite recipes, create meal plans, shopping
						lists and more.
					</p>
				</div>
			{/if}

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
					<Icon icon="ph:code" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Open Source</h4>
				</div>
				<p class="pt-3">
					ManageMeals is open source. All the code is viewable on <a
						href="https://github.com/managemeals"
						class="hover:underline text-blue-500"
						target="_blank">GitHub</a
					>. Everyone is welcome to participate in the project.
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

			{#if env.PUBLIC_SHOW_AI_PROMO === 'true'}
				<div>
					<div class="flex items-center gap-2">
						<Icon icon="ph:robot" color="#f97316" width="2.2rem" />
						<h4 class="text-xl font-semibold">AI</h4>
					</div>
					<p class="pt-3">
						While there is direct support for hundreds of recipe websites, not all websites have a
						predefined structure. This is where AI comes in. It will attempt to import recipes from
						any website, for example blogs.
					</p>
				</div>
			{/if}

			{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
				<div>
					<div class="flex items-center gap-2">
						<Icon icon="ph:youtube-logo" color="#f97316" width="2.2rem" />
						<h4 class="text-xl font-semibold flex gap-3 items-center">
							<span>YouTube</span>
							{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
								<span class="text-sm text-orange-500">Premium</span>
							{/if}
						</h4>
					</div>
					<p class="pt-3">
						Just like importing a recipe by URL. Simply paste the YouTube URL into the import form
						and ManageMeals will save the recipe as text.
					</p>
				</div>
			{/if}

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:printer" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Print</h4>
				</div>
				<p class="pt-3">
					Recipes have printer friendly styles. Hitting Ctrl+P (CMD+P) on a recipe will show a
					compact version of the recipe, with no images or colors, ready to be printed.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:calendar-dots" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold flex gap-3 items-center">
						<span>Meal Plans</span>
						{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
							<span class="text-sm text-orange-500">Premium</span>
						{/if}
					</h4>
				</div>
				<p class="pt-3">
					Create Meal Plans for a single day, or a whole week. Meal Types can be used to plan
					multiple courses per day. Auto-generated based on some criteria, or manually selected
					recipes.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:devices" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Cooking Mode</h4>
				</div>
				<p class="pt-3">
					Prevent the screen from turning off by checking a box on the recipe detail page. No more
					tapping the screen every couple of seconds.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:shopping-cart" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold flex gap-3 items-center">
						<span>Shopping Lists</span>
						{#if env.PUBLIC_SHOW_SUBSCRIPTION_PAGE === 'true'}
							<span class="text-sm text-orange-500">Premium</span>
						{/if}
					</h4>
				</div>
				<p class="pt-3">
					Create shopping lists from recipes and meal plans. It takes the recipe ingredients and
					turns them into a shopping list.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:share-network" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Sharing</h4>
				</div>
				<p class="pt-3">
					Share recipes with friends and family. Anyone with a share link can view, no need to
					register.
				</p>
			</div>

			{#if env.PUBLIC_SHOW_MOBILE_APPS === 'true'}
				<div>
					<div class="flex items-center gap-2">
						<Icon icon="ph:google-play-logo" color="#f97316" width="2.2rem" />
						<h4 class="text-xl font-semibold">Mobile Apps</h4>
					</div>
					<p class="pt-3">
						Android and iOS app versions of ManageMeals. <a
							href="#mobile-apps"
							class="hover:underline text-blue-500">See more</a
						> below.
					</p>
				</div>
			{/if}

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:cloud-slash" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Self Hosted</h4>
				</div>
				<p class="pt-3">
					A self hosted version of ManageMeals. You own all the data, and control where it's stored.
					See how on <a
						href="https://github.com/managemeals"
						class="hover:underline text-blue-500"
						target="_blank">GitHub</a
					>.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:tip-jar" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Donate</h4>
				</div>
				<p class="pt-3">
					To keep ManageMeals free, and to keep improving it, there is a donate button on the help
					page. You can also donate by <a
						target="_blank"
						class="hover:underline text-blue-500"
						href="https://www.paypal.com/donate/?hosted_button_id=AYX4RADAYPEXQ">clicking here</a
					>.
				</p>
			</div>

			<div>
				<div class="flex items-center gap-2">
					<Icon icon="ph:bookmark-simple" color="#f97316" width="2.2rem" />
					<h4 class="text-xl font-semibold">Bookmarklet</h4>
				</div>
				<p class="pt-3">
					Drag a bookmarklet to the browser's' bookmarks toolbar which will populate the URL input
					in the import form with the current recipe website's URL.
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
		</div>
	</div>
</section>

<section class="px-3 py-20 bg-slate-50">
	<div class="container mx-auto">
		<h3 class="text-3xl font-bold text-center pb-10">Screen Recordings</h3>
		<div class="flex flex-col lg:flex-row gap-10">
			<div class="basis-1/2 text-center">
				<h5 class="text-xl font-bold pb-8">Importing a Recipe</h5>
				<video controls muted>
					<source
						src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/videos/mmimport.mov"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			</div>

			<div class="basis-1/2 text-center">
				<h5 class="text-xl font-bold pb-8">Meal Planning</h5>
				<video controls muted>
					<source
						src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/videos/mmmealplans.mov"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
	</div>
</section>

{#if env.PUBLIC_SHOW_MOBILE_APPS === 'true'}
	<section class="px-3 py-20 bg-slate-100" id="mobile-apps">
		<div class="container mx-auto">
			<h3 class="text-3xl font-bold text-center pb-10">Mobile Apps</h3>
			<div class="flex flex-col lg:flex-row gap-10">
				<div class="basis-1/2 text-center">
					<h5 class="text-xl font-bold pb-8">Android</h5>
					<a
						href="https://play.google.com/store/apps/details?id=com.managemeals.app"
						class="inline-block"
						target="_blank"
					>
						<img
							src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/images/androidscrn.png"
							alt="Android app screenshot"
							class="w-96 transition-transform shadow scale-100 hover:lg:scale-105"
						/>
					</a>
				</div>

				<div class="basis-1/2 text-center">
					<h5 class="text-xl font-bold pb-8">iOS</h5>
					<a
						href="https://apps.apple.com/us/app/managemeals/id6578444875"
						class="inline-block"
						target="_blank"
					>
						<img
							src="https://whatacdn.fra1.cdn.digitaloceanspaces.com/mmeals/images/iphonescrn.png"
							alt="iOS app screenshot"
							class="w-96 transition-transform shadow scale-100 hover:lg:scale-105"
						/>
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}

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
