<script lang="ts" setup>
import {} from 'ionicons/icons'
import {
	fieldPropValues,
	useFieldSettings,
	useFieldValue,
} from '@/modules/fields/componentSetup'

const props = defineProps(fieldPropValues)
const value = useFieldValue<'text', string>({
	fieldID: props.fieldId,
	defaultValue: '',
})
const settings = useFieldSettings<'text'>({
	fieldID: props.fieldId,
	defaultValue: {
		multiline: false,
		rich: false,
	},
})
</script>

<template>
	<ion-input
		v-if="!settings.multiline"
		type="text"
		v-model="value"
		:disabled="settingsOpen"
		placeholder="Type the content of your text field."
		class="field-input"
	/>
	<ion-textarea
		v-else
		:autoGrow="true"
		v-model="value"
		:disabled="settingsOpen"
		placeholder="Type the content of your text field."
		class="field-input"
	/>
	<teleport :to="settingsTeleport">
		<ion-item class="settings-item">
			<ion-label>Multiline</ion-label>
			<ion-checkbox slot="end" v-model="settings.multiline" />
		</ion-item>
		<ion-item class="settings-item">
			<ion-label>Text Formatting</ion-label>
			<ion-checkbox slot="end" v-model="settings.rich" />
		</ion-item>
	</teleport>
</template>

<style lang="postcss"></style>
