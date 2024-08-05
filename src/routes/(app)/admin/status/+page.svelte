<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Status - Admin - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Status</h1>

	<div class="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Users</div>
			<div class="text-lg">{data.totalUsers}</div>
		</div>
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Recipes</div>
			<div class="text-lg">{data.totalRecipes}</div>
		</div>
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Categories</div>
			<div class="text-lg">{data.totalCategories}</div>
		</div>
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Tags</div>
			<div class="text-lg">{data.totalTags}</div>
		</div>
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Shopping Lists</div>
			<div class="text-lg">{data.totalShoppingLists}</div>
		</div>
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Meal Plans</div>
			<div class="text-lg">{data.totalMealPlans}</div>
		</div>
		<div class="border rounded p-3 text-center">
			<div class="text-lg font-bold mb-1">Shared recipes</div>
			<div class="text-lg">{data.totalShareRecipes}</div>
		</div>
	</div>
</div>
