<template>
	<ion-page id="login-page">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="/hello" />
				</ion-buttons>
				<ion-title>Login</ion-title>
			</ion-toolbar>
		</ion-header>
		<form class="container" @submit.prevent="login">
			<header class="header">
				<h1>Welcome back!</h1>
				<p>Login to your account to enter dashboard.</p>
			</header>
			<div class="inputs">
				<ion-item>
					<ion-label position="floating">Enter your email</ion-label>
					<ion-input
						name="email"
						autocomplete="email"
						type="email"
						:required="true"
						v-model="email"
					/>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Password</ion-label>
					<ion-input
						name="password"
						autocomplete="password"
						type="password"
						:required="true"
						v-model="password"
					/>
				</ion-item>
				<ion-text v-if="message" color="warning">
					<p class="mt-4">{{ message }}</p>
				</ion-text>
				<p>Forgotten? hmm?</p>
			</div>
			<SubmitGroup :disabled="disabledSubmit" />
		</form>
	</ion-page>
</template>

<script lang="ts" setup>
import { emailLogin } from '@/modules/auth'
import runRecaptcha from '@/modules/recaptcha'
import SubmitGroup from './components/SubmitGroup.vue'

const email = ref(''),
	password = ref(''),
	message = ref('')

// Disable submit if fields are empty
const disabledSubmit = computed<boolean>(() =>
	[email.value, password.value].includes(''),
)

const login = async () => {
	runRecaptcha('login')
	const result = await emailLogin(email.value, password.value)
	message.value = (result as any) ?? ''
}
</script>

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
}
</style>
