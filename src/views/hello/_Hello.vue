<script lang="ts" setup>
import { googleSignIn } from '@/modules/auth'
import { logoGoogle, mail } from 'ionicons/icons'

const slideOpts = {
	speed: 400,
	spaceBetween: 64,
}
</script>
<template>
	<ion-page id="hello-page">
		<ion-slides class="slider" pager="true" :options="slideOpts">
			<ion-slide>
				<h1>Slide 1</h1>
			</ion-slide>
			<ion-slide>
				<h1>Slide 2</h1>
			</ion-slide>
			<ion-slide>
				<h1>Slide 3</h1>
			</ion-slide>
		</ion-slides>
		<div class="buttons">
			<ion-button size="large" @click="googleSignIn">
				<ion-icon slot="start" :icon="logoGoogle" />
				Google Sign-In
			</ion-button>
			<ion-button
				size="large"
				color="medium"
				:router-link="{ name: 'SignUp' }"
			>
				<ion-icon slot="start" :icon="mail" />
				Sign in with Email
			</ion-button>
			<p>
				Already have an account? <br />
				<router-link :to="{ name: 'Login' }">Log in here!</router-link>
			</p>
		</div>
	</ion-page>
</template>

<style lang="postcss">
#hello-page {
	@apply justify-center items-center space-y-10;
	.slider {
		@apply h-80 w-64 pb-10;
	}
	.swiper-slide {
		@apply bg-gray-100 dark:bg-opacity-10 rounded-lg;
	}
	.swiper-pagination {
		@apply bottom-0;
	}
	.buttons {
		@apply flex flex-col items-stretch space-y-2;
		.button {
			@apply normal-case;
		}
		> p {
			@apply text-sm text-right text-gray-600;
		}
	}
}
</style>
