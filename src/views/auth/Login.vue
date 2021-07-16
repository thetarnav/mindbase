<script lang="ts" setup>
import { login } from '@/router/authGuard'
import { arrowForward } from 'ionicons/icons'
</script>
<template>
	<ion-page id="login-page">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button />
				</ion-buttons>
				<ion-title>Login</ion-title>
			</ion-toolbar>
		</ion-header>
		<div class="container">
			<header class="header">
				<h1>Welcome back!</h1>
				<p>Login to your account to enter dashboard.</p>
			</header>
			<div class="inputs">
				<ion-item>
					<ion-label position="floating">Enter your email</ion-label>
					<ion-input type="email" />
				</ion-item>
				<ion-item>
					<ion-label position="floating">Password</ion-label>
					<ion-input type="password" />
				</ion-item>
				<p>Forgotten? hmm?</p>
			</div>
			<div class="submit-group">
				<ion-button size="large" @click="login">
					<ion-icon slot="end" :icon="arrowForward" />
					Login
				</ion-button>
				<p>
					You don't have an account? <br />
					<router-link :to="{ name: 'SignUp' }">Sign Up here!</router-link>
				</p>
			</div>
		</div>
	</ion-page>
</template>

<style lang="postcss">
#login-page {
	@apply bg-white dark:bg-gray-900;
	.container {
		@apply w-72 m-auto flex flex-col space-y-6;
	}
	.inputs {
		@apply space-y-3;
		> p {
			@apply text-sm text-gray-600;
		}
		ion-item::part(native) {
			@apply rounded bg-gray-100 dark:bg-opacity-10;
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
