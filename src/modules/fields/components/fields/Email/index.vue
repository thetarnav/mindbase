<script lang="ts" setup>
import { watch } from 'vue'
import type { FieldSettings } from '@/modules/fields/field'
import { alertCircleOutline } from 'ionicons/icons'
import EmailSingle from './EmailSingle.vue'
import EmailMultiple from './EmailMultiple.vue'
import { debounce } from 'lodash'
import { email as rgx } from '@/utils/regex'

const props = defineProps({
	modelValue: { type: String, required: true },
	settings: { type: Object as () => FieldSettings['email'], required: true },
	settingsTeleport: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue', 'update:settings'])

const value = ref(props.modelValue),
	error = ref('')

const settingsValues = computed({
	get: () => props.settings,
	set: v => emit('update:settings', v),
})

const emitEmailValue = (v: string, forceUpdate = false) => {
	const notEmail = v.replace(rgx, '').trim(),
		emails = v.match(rgx) ?? [],
		validValue = props.settings.multiple ? emails.join(' ') : emails[0] ?? ''

	// force update -> emit valid value regardless if there aren't any input mistakes
	if (forceUpdate) emit('update:modelValue', validValue)

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
}
watch(
	value,
	debounce((v: string) => emitEmailValue(v), 300),
)
watch(
	() => settingsValues.value.multiple,
	() => emitEmailValue(value.value, true),
)
</script>

<template>
	<EmailMultiple
		v-if="settings.multiple"
		v-model.trim="value"
		v-bind="$attrs"
		:disabled="Boolean($attrs.settingsOpen)"
	/>
	<EmailSingle v-else v-model.trim="value" v-bind="$attrs" />
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

<style lang="postcss"></style>
