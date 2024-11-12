<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { format } from 'date-fns';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Users - Admin - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="p-5">
	<div class="flex items-center gap-3 mb-5">
		<h1 class="text-2xl font-bold">Users</h1>
		<div class="text-sm text-gray-500">{data.users.length} users</div>
	</div>

	<div class="relative overflow-auto">
		<table class="w-full text-left">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-3 py-2">Name</th>
					<th class="px-3 py-2">Email</th>
					<th class="px-3 py-2">Subscription</th>
					<th class="px-3 py-2">Admin</th>
					<th class="px-3 py-2">Created At</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr class="border-b last:border-b-0 hover:bg-gray-50">
						<td class="px-3 py-2">{user.name}</td>
						<td class="px-3 py-2">{user.email}</td>
						<td class="px-3 py-2">{user.subscriptionType}</td>
						<td class="px-3 py-2">
							{#if user.isAdmin}
								<span class="text-amber-500">Yes</span>
							{:else}
								<span>No</span>
							{/if}
						</td>
						<td class="px-3 py-2" title={user.createdAt}>{format(user.createdAt, 'd MMM yyyy')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
