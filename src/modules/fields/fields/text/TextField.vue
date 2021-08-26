<script lang="ts" setup>
import {} from 'ionicons/icons'
import { injectController } from '../../injectController'

const props = defineProps({
	settingsTeleport: { type: String, required: true },
	settingsOpen: { type: Boolean, required: true },
})

const { value, settings } = injectController('text')
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
