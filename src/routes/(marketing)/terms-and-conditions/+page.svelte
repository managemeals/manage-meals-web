<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<title>Terms & Conditions - {env.PUBLIC_MAIN_TITLE}</title>
</svelte:head>

<div class="container mx-auto">
	<section class="px-3 py-10">
		<h1 class="text-center font-bold text-2xl mb-5">Terms & Conditions</h1>

		<p class="mb-5">
			Welcome to ManageMeals. By accessing or using our website and services, you agree to be bound
			by these terms and conditions and our Privacy Policy. Please read them carefully.
		</p>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Acceptance of Terms</h3>
			<p>
				By using our services, you accept and agree to be bound by these Terms and Conditions. If
				you do not agree to these terms, you may not use our services.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Description of Services</h3>
			<p>
				ManageMeals provides an online platform for users to create, store, organize, and share
				recipes. Our services may change from time to time without notice.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">User Accounts</h3>
			<p>
				You must create an account to access certain features of our services. You are responsible
				for maintaining the confidentiality of your account credentials and for restricting access
				to your account. You agree to accept responsibility for all activities that occur under your
				account.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">User Content</h3>
			<p>
				Our services allow you to upload, submit, store, send, receive and share content, including
				recipes, photos, and other materials. You accept resposibility for all content posted to
				your account, and agree not to use ManageMeals as a means to store or distribute illegal
				material.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Prohibited Conduct</h3>
			<p>
				You agree not to use our services for any unlawful purpose or to upload or share any content
				that is defamatory, harassing, obscene, or otherwise objectionable. We reserve the right to
				remove any content that violates these terms.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Disclaimers and Limitation of Liability</h3>
			<p>
				Our services are provided on an "as is" and "as available" basis. We disclaim all
				warranties, express or implied, including warranties of merchantability, fitness for a
				particular purpose, and non-infringement. We will not be liable for any indirect,
				incidental, special, or consequential damages arising out of or relating to your use of our
				services.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Termination</h3>
			<p>
				We reserve the right to terminate or suspend your access to our services at any time, with
				or without cause.
			</p>
		</div>

		<div class="mb-3">
			<h3 class="font-semibold mb-1">Changes to Terms</h3>
			<p>
				We may revise these Terms and Conditions from time to time. By continuing to use our
				services after any changes, you accept the revised terms. If you have any questions about
				these Terms and Conditions, please contact us at <a
					href="mailto:support@managemeals.com"
					class="hover:underline text-blue-500">support@managemeals.com</a
				>.
			</p>
		</div>
	</section>
</div>
