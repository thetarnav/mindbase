<script lang="ts" setup>
import { arrowForward } from 'ionicons/icons'
</script>
<template>
	<ion-page id="sign-up-page">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button />
				</ion-buttons>
				<ion-title>Sign In</ion-title>
			</ion-toolbar>
		</ion-header>
		<div class="container">
			<header class="header">
				<h1>Begin your journey!</h1>
				<p>
					But first you'll have to create an account. Sorry, these are the
					rules.
				</p>
			</header>
			<div class="inputs">
				<ion-item>
					<ion-label position="floating">Unique username</ion-label>
					<ion-input type="text" />
				</ion-item>
				<ion-item>
					<ion-label position="floating">Your email</ion-label>
					<ion-input type="email" />
				</ion-item>
				<ion-item>
					<ion-label position="floating">New password</ion-label>
					<ion-input type="password" />
				</ion-item>
			</div>
			<div class="submit-group">
				<ion-button size="large">
					<ion-icon slot="end" :icon="arrowForward" />
					Sign In
				</ion-button>
				<p>
					Already have an account? <br />
					<router-link :to="{ name: 'Login' }">Log in here!</router-link>
				</p>
			</div>
		</div>
	</ion-page>
</template>

<style lang="postcss">
#sign-up-page {
	@apply bg-blue-50 dark:bg-blue-900;
	.container {
		@apply w-72 m-auto flex flex-col space-y-6;
	}
	.inputs {
		@apply space-y-3;
		ion-item::part(native) {
			@apply rounded bg-blue-100 dark:bg-opacity-10;
		}
	}
	.submit-group {
		@apply w-full flex flex-col space-y-3;
		> p {
			@apply text-sm text-right text-gray-600;
		}
	}
}
</style>
