<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<title>Privacy Policy - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="container mx-auto">
	<section class="px-3 py-10">
		<h1 class="text-center font-bold text-2xl mb-5">Privacy Policy</h1>

		<p class="mb-5">
			At ManageMeals, we are committed to protecting your privacy. This Privacy Policy explains how
			we collect, use, and disclose information about you when you use our recipe manager web
			application.
		</p>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Information We Collect</h3>
			<p class="mb-1">
				<span class="font-semibold">Personal Information</span>: When you create an account with us,
				we collect personal information such as your name, email address, and any other information
				you choose to provide.
			</p>
			<p class="mb-1">
				<span class="font-semibold">Usage Information</span>: We automatically collect information
				about how you use our application, such as the recipes you view, save, or share, and your
				interactions with our features.
			</p>
			<p>
				<span class="font-semibold">Device Information</span>: We may collect information about the
				device you use to access our application, including the type of device, operating system,
				and unique device identifiers.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">How We Use Your Information</h3>
			<p class="mb-1">We use the information we collect to:</p>
			<ul class="list-disc list-inside">
				<li>Provide, maintain, and improve our recipe manager application</li>
				<li>Personalize your experience and deliver relevant content and recommendations</li>
				<li>Communicate with you about your account, updates, and promotional offers</li>
				<li>Analyze usage trends and gather statistical data to improve our application</li>
				<li>Prevent fraud, enforce our policies, and comply with legal obligations</li>
			</ul>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Information Sharing and Disclosure</h3>
			<p class="mb-1">
				We do not sell, trade, or rent your personal information to third parties. However, we may
				share your information with trusted third-party service providers who assist us in operating
				our application, conducting business activities, or providing services on our behalf.
			</p>
			<p>
				We may also disclose your information if required by law, to protect our rights or the
				rights of others, or in connection with a merger, acquisition, or sale of our assets.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Data Security</h3>
			<p>
				We implement reasonable security measures to protect your personal information from
				unauthorized access, use, or disclosure. However, no method of transmission over the
				Internet or electronic storage is 100% secure.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Your Choices and Rights</h3>
			<p>
				You can review, update, or delete your personal information by logging into your account.
				You may also opt-out of receiving promotional communications from us by following the
				unsubscribe instructions provided in those communications.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Changes to This Privacy Policy</h3>
			<p>
				We may update this Privacy Policy from time to time to reflect changes in our practices or
				for other operational, legal, or regulatory reasons. We will notify you of any material
				changes by posting the updated Privacy Policy on our website.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Contact</h3>
			<p>
				If you have any questions about the Privacy Policy, please contact us at <a
					href="mailto:support@managemeals.com"
					class="hover:underline text-blue-500">support@managemeals.com</a
				>.
			</p>
		</div>
	</section>
</div>
