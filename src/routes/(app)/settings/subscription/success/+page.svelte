<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="p-5">
	<h1 class="text-2xl font-bold mb-5">Subscription has been set up</h1>
	<p>
		Thanks for subscribing. Your subscription type is now <span class="text-orange-500 font-bold"
			>{data.user.subscriptionType}</span
		>.
	</p>
</div>
