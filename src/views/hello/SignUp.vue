<template>
	<ion-page id="sign-up-page">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="/hello" />
				</ion-buttons>
				<ion-title>Sign In</ion-title>
			</ion-toolbar>
		</ion-header>
		<form class="container" @submit.prevent="formSubmit">
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
					<ion-input
						name="username"
						type="text"
						:minlength="3"
						:required="true"
						v-model.trim="username"
						@input="slugifyUsername"
					/>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Your email</ion-label>
					<ion-input
						name="email"
						type="email"
						:required="true"
						v-model.trim="email"
					/>
				</ion-item>
				<ion-item>
					<ion-label position="floating">New password</ion-label>
					<ion-input
						name="password"
						type="password"
						:required="true"
						v-model.trim="password"
					/>
				</ion-item>
				<ion-text v-if="message" color="warning">
					<p class="mt-4">{{ message }}</p>
				</ion-text>
			</div>
			<SubmitGroup :disabled="disabledSubmit" />
		</form>
	</ion-page>
</template>

<script lang="ts" setup>
import { emailSignIn } from '@/modules/auth'
import runRecaptcha from '@/modules/recaptcha'
import { debounce } from 'lodash'
import slugify from 'slugify'
import SubmitGroup from './components/SubmitGroup.vue'

const username = ref(''),
	email = ref(''),
	password = ref(''),
	message = ref('')

// Disable submit if fields are empty
const disabledSubmit = computed<boolean>(() =>
	[username.value, email.value, password.value].includes(''),
)

// Username input will be lazy slugified to work in URL
const slugifyUsername = debounce(
	() => (username.value = slugify(username.value)),
	100,
	{ maxWait: 250 },
)

const formSubmit = async () => {
	runRecaptcha('sign-in')
	const result = await emailSignIn(email.value, password.value, username.value)
	message.value = (result as any) ?? ''
}
</script>

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
}
</style>
