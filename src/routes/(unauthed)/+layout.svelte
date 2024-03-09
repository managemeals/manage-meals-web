<script lang="ts">
	import SkilletIcon from '~icons/material-symbols/skillet-outline-rounded';
</script>

<div class="flex justify-center items-center h-screen bg-slate-100 px-2">
	<div class="2xl:basis-1/2 xl:basis-3/4">
		<div class="flex justify-center items-center pb-10">
			<a href="/" class="flex justify-center items-center gap-4">
				<SkilletIcon style="font-size: 2.4rem; color: #f97316;" />
				<div class="text-2xl font-bold">
					Manage<span class="text-orange-500">Meals</span>
				</div></a
			>
		</div>
		<div class="shadow-lg p-5 rounded border bg-white">
			<slot />
		</div>
	</div>
</div>
