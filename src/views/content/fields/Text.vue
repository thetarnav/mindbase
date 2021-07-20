<script lang="ts" setup>
import type { FieldSettings } from '@/modules/field'
import {} from 'ionicons/icons'
import { defineEmit, defineProps } from 'vue'

const props = defineProps({
	name: { type: String, required: true },
	modelValue: { type: String, required: true },
	settings: { type: Object as () => FieldSettings['text'], required: true },
})
const emit = defineEmit(['update:modelValue'])

const value = computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v),
})
</script>

<template>
	<ion-input
		v-if="props.settings.oneLine"
		:name="name"
		type="text"
		v-model="value"
		class="text-field"
	/>
	<ion-textarea
		v-else
		:autoGrow="true"
		:name="name"
		v-model="value"
		class="text-field"
	/>
</template>

<style lang="postcss">
.text-field {
	@apply mt-0;
}
</style>
