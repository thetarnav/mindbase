<script lang="ts" setup>
import type { FieldSettings } from '@/modules/fields/types'
import {} from 'ionicons/icons'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: Boolean, required: true },
	settings: { type: Object as () => FieldSettings['toggle'], required: true },
})
const emit = defineEmits(['update:modelValue'])

const value = computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v),
})
</script>

<template>
	<ion-toggle
		v-model="value"
		:disabled="$attrs.settingsOpen"
		class="field-input field-input--toggle"
	></ion-toggle>
</template>

<style lang="postcss"></style>
