<script lang="ts" setup>
import type { FieldSettings } from '@/modules/fields/field'
import {} from 'ionicons/icons'
import { defineEmit, defineProps } from 'vue'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: Number, required: true },
	settings: { type: Object as () => FieldSettings['number'], required: true },
})
const emit = defineEmit(['update:modelValue'])

const value = computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v),
})
</script>

<template>
	<ion-input :name="name" type="number" v-model="value" class="number-field" />
</template>

<style lang="postcss">
.number-field {
}
</style>
