<script lang="ts" setup>
import type { FieldSettings } from '@/modules/fields/field'
import {} from 'ionicons/icons'

import { defineEmit, defineProps } from 'vue'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: Boolean, required: true },
	settings: { type: Object as () => FieldSettings['toggle'], required: true },
})
const emit = defineEmit(['update:modelValue'])

const value = computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v),
})
</script>

<template>
	<ion-toggle
		v-model="value"
		class="field-input field-input--toggle"
	></ion-toggle>
</template>

<style lang="postcss"></style>
