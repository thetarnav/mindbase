<script lang="ts" setup>
import type { FieldSettings } from '@/modules/field'
import { alertCircleOutline } from 'ionicons/icons'
import { defineEmit, defineProps } from 'vue'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: String, required: true },
	settings: { type: Object as () => FieldSettings['email'], required: true },
})
const emit = defineEmit(['update:modelValue'])

const rgx =
	/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

const error = ref('')

const value = computed({
	get: () => props.modelValue,
	set: v => {
		const notEmail = v.replace(rgx, '').trim(),
			emails = v.match(rgx) ?? []

		const validValue = props.settings.multiple
			? emails.join('')
			: emails[0] ?? ''

		// Check for input mistakes
		if (
			!props.settings.multiple &&
			(emails.length > 1 || (emails.length > 0 && notEmail))
		)
			return (error.value = 'This field accepts only one email address.')
		if (notEmail)
			return (error.value = `"${notEmail}" is not a valid email address.`)

		emit('update:modelValue', validValue)
		error.value = ''
	},
})
</script>

<template>
	<ion-input
		:name="name"
		type="email"
		autocomplete="email"
		autocorrect="on"
		:pattern="rgx"
		v-model.trim="value"
		:debounce="300"
		class="number-field"
	/>
	<p v-if="error" class="field-input-error">
		<ion-icon :icon="alertCircleOutline"></ion-icon>
		{{ error }}
	</p>
</template>

<style lang="postcss">
.number-field {
	@apply mt-0;
}
</style>
