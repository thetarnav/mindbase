<script lang="ts" setup>
import type { FieldSettings } from '@/modules/fields/field'
import { alertCircleOutline } from 'ionicons/icons'
import { defineEmit, defineProps } from 'vue'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: String, required: true },
	settings: { type: Object as () => FieldSettings['email'], required: true },
	settingsTeleport: { type: String, required: true },
})
const emit = defineEmit(['update:modelValue', 'update:settings'])

const rgx =
	/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

const error = ref('')

const value = computed({
	get: () => props.modelValue,
	set: v => {
		const notEmail = v.replace(rgx, '').trim(),
			emails = v.match(rgx) ?? []

		const validValue = props.settings.multiple
			? emails.join(' ')
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

const settingsValues = computed({
	get: () => props.settings,
	set: v => emit('update:settings', v),
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
		:disabled="$attrs.disabled"
		:debounce="300"
		:placeholder="
			settings.multiple
				? 'jane@gmail.com john@gmail.com ...'
				: 'example@gmail.com'
		"
		class="field-input field-input--email"
	/>
	<p v-if="error" class="field-input-error">
		<ion-icon :icon="alertCircleOutline"></ion-icon>
		{{ error }}
	</p>
	<teleport :to="settingsTeleport">
		<ion-item class="settings-item">
			<ion-label>Allow multiple emails</ion-label>
			<ion-checkbox slot="end" v-model="settingsValues.multiple" />
		</ion-item>
	</teleport>
</template>

<style lang="postcss">
.email-field {
}
</style>
