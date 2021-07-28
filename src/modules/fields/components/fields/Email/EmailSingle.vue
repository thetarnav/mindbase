<script lang="ts" setup>
import {} from 'ionicons/icons'
import { defineEmit, defineProps } from 'vue'

const props = defineProps({
	modelValue: { type: String, required: true },
})
const emit = defineEmit(['update:modelValue'])

const value = computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v),
})
</script>

<template>
	<ion-input
		:name="$attrs.name"
		type="email"
		autocomplete="email"
		autocorrect="on"
		v-model.trim="value"
		:disabled="$attrs.disabled"
		placeholder="example@gmail.com"
		class="field-input field-input--email"
	/>
</template>

<style lang="postcss"></style>
