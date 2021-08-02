<script lang="ts">
/* eslint-disable vue/no-mutating-props */
export default {
	inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import type { FieldSettings, FieldValue } from '../../field'
import { defineEmit, defineProps } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import { capitalize } from '@/utils/functions'
import copy from '@/modules/clipboard'

const props = defineProps({
	modelValue: { type: String, required: true },
	settingsTeleport: { type: String, required: true },
	settingsOpen: { type: Boolean, required: true },
})

interface Emits {
	(name: 'update:modelValue', payload: FieldValue['person']): void
	(name: 'update:settings', payload: FieldSettings['person']): void
}
const rawEmit = defineEmit(['update:modelValue', 'update:settings'])
const emit = rawEmit as Emits

interface Person {
	first: string
	middle: string
	last: string
}
const value: Person = reactive({
	first: '',
	middle: '',
	last: '',
})
{
	// Initialize value from modelValue prop
	const [first, last, middle] = props.modelValue.split(' ')
	value.first = first ?? ''
	value.last = last ?? ''
	value.middle = middle ? middle.replaceAll(/\(*\)*/g, '') : ''
}

const parseString = (s: string) => capitalize(s).substring(0, 30)
debouncedWatch(
	value,
	v => {
		const first = parseString(v.first),
			last = parseString(v.last),
			middle = v.middle ? `(${parseString(v.middle)})` : '',
			fullName = `${first} ${last} ${middle}`
		emit('update:modelValue', fullName.trim())
	},
	{ debounce: 500 },
)

const inputGroup = ref<HTMLElement>()
const showInputs = computed(
	() =>
		props.settingsOpen ||
		(!value.first && !value.middle && !value.last) ||
		Boolean(inputGroup.value?.querySelector(':focus')),
)
</script>

<template>
	<CollapseTransition>
		<p
			v-show="!showInputs"
			class="display-name"
			v-touch="() => copy(modelValue)"
		>
			{{ modelValue }}
		</p>
	</CollapseTransition>
	<CollapseTransition>
		<div v-show="showInputs" class="input-group" ref="inputGroup">
			<ion-item>
				<ion-label position="floating">First name</ion-label>
				<ion-input v-model="value.first" name="name" type="text" />
			</ion-item>
			<ion-item>
				<ion-label position="floating">Middle name</ion-label>
				<ion-input v-model="value.middle" name="middle name" type="text" />
			</ion-item>
			<ion-item class="last">
				<ion-label position="floating">Last name</ion-label>
				<ion-input v-model="value.last" name="last name" type="text" />
			</ion-item>
		</div>
	</CollapseTransition>
</template>

<style lang="postcss" scoped>
.input-group {
	@apply grid grid-cols-2 gap-3;

	> ion-item {
		--padding-top: 0px;
		--padding-bottom: 0px;
		--padding-end: theme('spacing.3');
		--padding-start: theme('spacing.3');
		--background: theme('colors.gray.800');
		&::part(native) {
			@apply h-16 rounded-md;
		}

		ion-label {
			@apply text-gray-600 dark:text-gray-400;
		}
		&.last {
			@apply col-span-2;
		}

		ion-note {
			@apply hidden;
		}
	}
}

.display-name {
	@apply self-start;
	@apply text-xl text-gray-900 dark:text-gray-100 font-medium select-none;
}
</style>
