<script lang="ts">
	import { PUBLIC_MOCK_INSTANCE } from '$env/static/public';
	import Icon from '@iconify/svelte';
</script>

{#if PUBLIC_MOCK_INSTANCE === 'yes'}
	<div class="text-white bg-indigo-700 p-1 font-bold fixed top-0 left-0 right-0">
		DEMO MODE - <span class="text-sm">Create operations are disabled</span>
	</div>
{/if}

<div class="flex justify-center items-center h-screen bg-slate-100 px-2">
	<div class="basis-full 2xl:basis-1/2 xl:basis-3/4">
		<div class="flex justify-center items-center pb-10">
			<a href="/" class="flex justify-center items-center gap-4 group">
				<div class="transition-transform translate-y-0 group-hover:-translate-y-1">
					<Icon icon="ph:cooking-pot" color="#f97316" width="3rem" />
				</div>
				<div class="text-3xl font-bold">
					Manage<span class="text-orange-500">Meals</span>
				</div></a
			>
		</div>
		<div class="shadow-lg p-5 rounded border bg-white">
			<slot />
		</div>
	</div>
</div>
