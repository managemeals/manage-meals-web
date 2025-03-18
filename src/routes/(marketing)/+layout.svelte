<script lang="ts">
	import Icon from '@iconify/svelte';
	import { env } from '$env/dynamic/public';
</script>

{#if env.PUBLIC_MOCK_INSTANCE === 'yes'}
	<div class="text-white bg-indigo-700 p-1 font-bold">
		DEMO MODE - <span class="text-sm">Create operations are disabled</span>
	</div>
{/if}

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
			<a
				href="/categories"
				class="bg-orange-500 rounded p-3 text-white hover:bg-orange-600 shadow font-semibold"
				>Open App</a
			>
		</div>
	</div>
</nav>

<main>
	<slot />
</main>

<footer class="bg-slate-200 px-3 py-10">
	<div class="container mx-auto flex flex-col lg:flex-row gap-5 justify-between">
		<div class="flex flex-col gap-5">
			<div>
				<h4 class="font-semibold text-lg mb-1">ManageMeals</h4>
				<p>ManageMeals is a simple, easy-to-use platform to manage recipes.</p>
			</div>
			<div>
				<p>
					Made by <a
						href="https://hilmarp.com"
						target="_blank"
						class="hover:underline text-blue-500">Hilmar</a
					>.
				</p>
			</div>
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
					<a href="/terms-and-conditions" class="hover:underline text-blue-500"
						>Terms & Conditions</a
					>
					<a href="/privacy-policy" class="hover:underline text-blue-500">Privacy Policy</a>
				</div>
			</div>
		</div>
	</div>
</footer>
