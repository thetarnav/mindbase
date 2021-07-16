<script lang="ts" setup>
import { auth } from '@/modules/firebase'
import router from '@/router'
import { arrowForward } from 'ionicons/icons'
import { debounce } from 'lodash'
import slugify from 'slugify'

const username = ref(''),
	email = ref(''),
	password = ref('')

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
	try {
		const result = await auth.createUserWithEmailAndPassword(
			email.value,
			password.value,
		)
		console.log(result)
		// TODO: Send new user info (uid + username) to the API
		router.push({ name: 'Home' })
	} catch (error) {
		// TODO: Properly handle the error
		console.error(error)
	}
}
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
						type="text"
						:required="true"
						v-model.trim="username"
						@input="slugifyUsername"
					/>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Your email</ion-label>
					<ion-input type="email" :required="true" v-model.trim="email" />
				</ion-item>
				<ion-item>
					<ion-label position="floating">New password</ion-label>
					<ion-input
						type="password"
						:required="true"
						v-model.trim="password"
					/>
				</ion-item>
				<p class="form-alert"></p>
			</div>
			<div class="submit-group">
				<ion-button size="large" type="submit" :disabled="disabledSubmit">
					<ion-icon slot="end" :icon="arrowForward" />
					Sign In
				</ion-button>
				<p>
					Already have an account? <br />
					<router-link :to="{ name: 'Login' }">Log in here!</router-link>
				</p>
			</div>
		</form>
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
