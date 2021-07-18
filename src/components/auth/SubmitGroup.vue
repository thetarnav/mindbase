<script lang="ts" setup>
import { arrowForward, logoGoogle } from 'ionicons/icons'
import { defineProps, toRefs } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
	method: { type: Function, required: true },
	disabled: { type: Boolean, default: false },
})
const { method, disabled } = toRefs(props)

const page = useRoute().name
</script>

<template>
	<div class="auth-submit-group">
		<ion-button size="large" :disabled="disabled" @click="method">
			{{ page === 'Login' ? 'Login' : 'Sign In' }}
			<ion-icon slot="end" :icon="arrowForward" />
		</ion-button>
		<div class="auth-submit-group-bottom">
			<ion-button color="light" class="google">
				<ion-icon slot="icon-only" :icon="logoGoogle" />
			</ion-button>
			<p>
				{{
					page === 'Login'
						? "You don't have an account?"
						: 'Already have an account?'
				}}
				<br />
				<router-link :to="{ name: page === 'Login' ? 'SignUp' : 'Login' }">
					{{ page === 'Login' ? 'Sign In here!' : 'Login here!' }}
				</router-link>
			</p>
		</div>
	</div>
</template>

<style lang="postcss">
.auth-submit-group {
	@apply w-full flex flex-col space-y-3;

	&-bottom {
		@apply flex justify-between;
		> .google {
			@apply w-14 h-14;
		}
		> p {
			@apply mt-1 text-sm text-right text-gray-600;
		}
	}
}
</style>
