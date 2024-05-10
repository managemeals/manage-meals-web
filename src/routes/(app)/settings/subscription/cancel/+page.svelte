<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-5">
	<h1 class="text-xl font-bold mb-5">Subscription has been cancelled.</h1>
	<p>
		Your subscription has been cancelled. Your subscription type is now <span
			class="text-orange-500 font-bold">{data.user.subscriptionType}</span
		>.
	</p>
</div>
