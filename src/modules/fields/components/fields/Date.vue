<script lang="ts">
/* eslint-disable vue/no-mutating-props */
export default {
	inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import type { FieldSettings, FieldValue } from '@/modules/fields/field'
import { defineEmit, defineProps } from 'vue'
import { IonSelect, IonSelectOption } from '@ionic/vue'
import { DatePicker } from 'v-calendar'

const props = defineProps({
	modelValue: {
		type: Object as () => FieldValue['date'],
		required: true,
	},
	settings: { type: Object as () => FieldSettings['date'], required: true },
	settingsTeleport: { type: String, required: true },
	settingsOpen: { type: Boolean, required: true },
})

interface Emits {
	(name: 'update:modelValue', payload: FieldValue['date']): void
	(name: 'update:settings', payload: FieldSettings['date']): void
}
const rawEmit = defineEmit(['update:modelValue', 'update:settings'])
const emit = rawEmit as Emits

const value = computed({
	get: () => props.modelValue,
	set: v => {
		emit('update:modelValue', v)
	},
})

const masks = {
	input: 'YYYY-MM-DD',
}

interface ModeInfo {
	label: string
	placeholder: string
}
const modes: Record<FieldSettings['date']['mode'], ModeInfo> = {
	time: { label: 'Time Only', placeholder: 'H:MM AM' },
	date: { label: 'Date Only', placeholder: 'YYYY-MM-DD' },
	dateTime: { label: 'Date & Time', placeholder: 'MM/DD/YYYY H:MM PM' },
}
</script>

<template>
	<!-- RANGE -->
	<DatePicker
		v-if="settings.range"
		is-range
		:mode="settings.mode"
		v-model="value"
		:update-on-input="true"
		:masks="masks"
		class="input-row range"
		:class="settings.mode"
	>
		<template v-slot="{ inputValue, inputEvents }">
			<div class="input-group">
				<label>From</label>
				<input
					class="field-input field-input--date"
					:value="inputValue.start"
					v-on="inputEvents.start"
					:placeholder="modes[settings.mode].placeholder"
				/>
			</div>
			<div class="input-group">
				<label>To</label>
				<input
					class="field-input field-input--date"
					:value="inputValue.end"
					v-on="inputEvents.end"
					:placeholder="modes[settings.mode].placeholder"
				/>
			</div>
		</template>
	</DatePicker>

	<!-- SINGLE -->
	<DatePicker
		v-else
		:mode="settings.mode"
		v-model="value"
		:update-on-input="true"
		:masks="masks"
		class="input-row"
		:class="settings.mode"
	>
		<template v-slot="{ inputValue, inputEvents }">
			<input
				class="field-input field-input--date"
				:value="inputValue"
				v-on="inputEvents"
				:placeholder="modes[settings.mode].placeholder"
			/>
		</template>
	</DatePicker>

	<!-- SETTINGS -->
	<teleport :to="settingsTeleport">
		<ion-item>
			<ion-label>Range Input <i>(From Start to End)</i></ion-label>
			<ion-checkbox slot="end" v-model="settings.range" />
		</ion-item>
		<!-- <ion-item>
         <ion-label>Multiple Entries</ion-label>
         <ion-checkbox slot="end" v-model="settings.multiple" />
      </ion-item> -->
		<ion-item>
			<ion-label>Pick Input Type</ion-label>
			<ion-select v-model="settings.mode">
				<ion-select-option
					v-for="({ label }, mode) in modes"
					:key="mode"
					:value="mode"
					>{{ label }}</ion-select-option
				>
			</ion-select>
		</ion-item>
	</teleport>
</template>

<style lang="postcss" scoped>
.input-row {
	&.range {
		@apply grid grid-cols-2 gap-x-3;
	}
}

.input-group {
	@apply flex flex-col w-auto flex-shrink;
	label {
		@apply ml-2 text-sm text-gray-600 dark:text-gray-400;
	}
}
.field-input--date {
	@apply py-2 px-4 h-12 text-lg;
}

.date,
.time {
	.field-input--date {
		@apply w-44;
	}
}
.range.dateTime .field-input--date {
	@apply text-base px-2;
}
</style>
