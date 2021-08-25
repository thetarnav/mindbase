<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import type { FieldSettings } from '@/modules/fields/types'
import { watch } from 'vue'
import Slider from '@vueform/slider'
import injectController from '../../injectController'

const props = defineProps({
	settingsTeleport: { type: String, required: true },
	settingsOpen: { type: Boolean, required: true },
})

const { controller, value, settings } = injectController('number')

const isSliderEnabled = computed(
	() => !settings.value.minmax.some(v => v === null),
)

const min = ref(String(settings.value.minmax[0] ?? ''))
const max = ref(String(settings.value.minmax[1] ?? ''))

watch(min, () => MinMaxChanged('min'))
watch(max, () => MinMaxChanged('max'))

function MinMaxChanged(editing: 'min' | 'max') {
	// Both min and max must be filled to emit update
	if ([min.value, max.value].includes(''))
		return emitSettings({ minmax: [null, null] })

	const minmax: [number, number] = [Number(min.value), Number(max.value)]
	// prevent NaN values
	if (isNaN(minmax[0]) || isNaN(minmax[1]))
		return emitSettings({ minmax: [null, null] })

	// keep "min" smaller than "max"
	if (editing === 'min' && minmax[0] >= minmax[1]) {
		minmax[1] = minmax[0] + 1
		max.value = String(minmax[1])
	} else if (editing === 'max' && minmax[0] >= minmax[1]) {
		minmax[0] = minmax[1] - 1
		min.value = String(minmax[0])
	}

	emitSettings({ minmax })
}

const emitSettings = (newSettings: FieldSettings['number']) => {
	settings.value = newSettings
}
</script>

<template>
	<Slider
		v-if="isSliderEnabled"
		v-model="value"
		:disabled="settingsOpen"
		:min="settings.minmax[0]"
		:max="settings.minmax[1]"
		class="field-input--number-slider"
		:classes="{
			target:
				'relative box-border user-select-none touch-none tap-highlight-transparent touch-callout-none disabled:cursor-not-allowed',
			focused: 'slider-focused',
			tooltipFocus: 'slider-tooltip-focus',
			tooltipDrag: 'slider-tooltip-drag',
			ltr: 'slider-ltr',
			horizontal: 'slider-horizontal h-1.5',
			vertical: 'slider-vertical w-1.5 h-80',
			textDirectionLtr: 'slider-txt-ltr',
			base: 'w-full h-full relative z-1 bg-gray-300 rounded disabled:opacity-50',
			connects: 'w-full h-full relative overflow-hidden z-0 rounded',
			connect:
				'absolute z-1 top-0 right-0 transform-origin-0 transform-style-flat h-full w-full bg-gray-500 cursor-pointer tap:duration-300 tap:transition-transform disabled:cursor-not-allowed',
			origin:
				'slider-origin absolute z-1 top-0 right-0 transform-origin-0 transform-style-flat h-1/10 w-1/10 h:h-0 tap:duration-300 tap:transition-transform',
			handle:
				'absolute rounded-full bg-white border-0 shadow-slider cursor-[grab] focus:outline-none h:w-4 h:h-4 h:-top-1.5 h:-right-2 disabled:cursor-not-allowed focus:ring focus:ring-gray-500 focus:ring-opacity-30',
			touchArea: 'h-full w-full',
			tooltip:
				'absolute block text-sm font-semibold whitespace-nowrap py-1 px-1.5 min-w-5 text-center text-white rounded border border-gray-500 bg-gray-500 transform h:-translate-x-1/2 h:left-1/2 h:bottom-6 h:arrow-bottom tt-focus:hidden tt-focused:block tt-drag:hidden tt-dragging:block',
			tooltipHidden: 'slider-tooltip-hidden',
			active: 'slider-active shadow-slider-active cursor-grabbing',
			draggable: 'cursor-ew-resize',
			tap: 'slider-state-tap',
			drag: 'slider-state-drag',
		}"
	/>
	<ion-input
		v-else
		type="number"
		v-model="value"
		:disabled="settingsOpen"
		class="field-input field-input--number"
	/>

	<teleport :to="settingsTeleport">
		<ion-item class="settings-item">
			<ion-label>Min</ion-label>
			<ion-input slot="end" type="number" v-model="min" />
		</ion-item>
		<ion-item class="settings-item">
			<ion-label>Max</ion-label>
			<ion-input slot="end" type="number" v-model="max" />
		</ion-item>
	</teleport>
</template>

<style lang="postcss">
.field-input--number-slider {
	@apply mt-12 mb-4;
}
</style>
