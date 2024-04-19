<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav class="bg-slate-100 px-3 py-5">
	<div
		class="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
	>
		<div>
			<a href="/" class="flex justify-center items-center gap-4 group">
				<div class="transition-transform translate-y-0 group-hover:lg:-translate-y-1">
					<Icon icon="ph:cooking-pot" color="#f97316" width="3rem" />
				</div>
				<div class="text-xl md:text-3xl font-bold">
					Manage<span class="text-orange-500">Meals</span>
				</div>
			</a>
		</div>
		<div class="flex gap-5">
			{#if data && data.user}
				<a href="/categories" class="hover:underline">Open App</a>
			{:else}
				<a href="/auth/login" class="hover:underline">Login</a>
				<a href="/auth/register" class="hover:underline">Register</a>
			{/if}
		</div>
	</div>
</nav>

<main>
	<slot />
</main>

<footer class="bg-slate-200 px-3 py-10">
	<div class="container mx-auto flex flex-col lg:flex-row gap-5 justify-between">
		<div>
			<h4 class="font-semibold text-lg mb-1">ManageMeals</h4>
			<p>ManageMeals is a simple, easy-to-use platform to manage recipes.</p>
		</div>
		<div class="flex flex-col md:flex-row gap-10">
			<div class="flex flex-col gap-1">
				<div>
					<h5 class="font-semibold mb-1">Contact</h5>
					<div class="flex flex-col gap-1">
						<a href="mailto:hello@managemeals.com" class="hover:underline text-blue-500"
							>hello@managemeals.com</a
						>
					</div>
				</div>
				<div>
					<h5 class="font-semibold mb-1">Support</h5>
					<div class="flex flex-col gap-1">
						<a href="mailto:support@managemeals.com" class="hover:underline text-blue-500"
							>support@managemeals.com</a
						>
					</div>
				</div>
			</div>
			<div>
				<h5 class="font-semibold mb-1">Links</h5>
				<div class="flex flex-col gap-1">
					<a href="/auth/login" class="hover:underline text-blue-500">Login</a>
					<a href="/auth/register" class="hover:underline text-blue-500">Register</a>
				</div>
			</div>
		</div>
	</div>
</footer>
