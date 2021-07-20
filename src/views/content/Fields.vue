<script lang="ts" setup>
import { defineAsyncComponent, defineProps } from 'vue'
import contenteditable from 'vue-contenteditable'
import { useItem } from '@/store/items'
import {} from 'ionicons/icons'

const TextField = defineAsyncComponent(() => import('./fields/Text.vue'))
const NumberField = defineAsyncComponent(() => import('./fields/Number.vue'))
const EmailField = defineAsyncComponent(() => import('./fields/Email.vue'))
const BooleanField = defineAsyncComponent(() => import('./fields/Boolean.vue'))

const props = defineProps({
	id: { type: String, required: true },
})
const { fields } = useItem(props.id)

const components = {
	text: TextField,
	number: NumberField,
	email: EmailField,
	toggle: BooleanField,
}
</script>

<template>
	<ion-list class="item-fields-list">
		<ion-list-header>
			<ion-label>Item Fields:</ion-label>
		</ion-list-header>
		<ion-item
			v-for="field in fields"
			:key="field.id"
			class="field-item"
			:class="`field-item-${field.type}`"
		>
			<header>
				<contenteditable
					slot="start"
					tag="h6"
					class="title"
					:contenteditable="true"
					v-model="field.title"
					:noNL="true"
					:noHTML="true"
				/>
				<p class="field-type">{{ field.type }} Field</p>
			</header>
			<component
				:is="components[field.type]"
				:name="field.id"
				v-model="field.value"
				:settings="field.settings"
				class="field-item-input"
				:class="`${field.type}-field-input`"
			/>
		</ion-item>
	</ion-list>
</template>

<style lang="postcss">
.item-fields-list {
}
.field-item {
	&::part(native) {
		@apply mt-3 flex flex-col items-start py-2 border-b border-gray-300 dark:border-gray-700;
		--inner-border-width: 0;
	}
	&.field-item-toggle {
		&::part(native) {
			@apply flex-row items-center justify-between;
		}
		.toggle-field-input {
			@apply ml-auto;
		}
	}

	.title {
		@apply pr-4 my-0 py-1;
	}
	.field-type {
		@apply text-xs capitalize text-gray-600 dark:text-gray-500;
	}

	.field-item-input:not(.toggle-field-input) {
		@apply bg-gray-100 dark:bg-gray-800 px-2 mt-3 rounded;
		@apply font-medium text-gray-800 dark:text-gray-100;
		padding-left: theme('spacing.2') !important;
		padding-right: theme('spacing.2') !important;
	}

	.field-input-error {
		@apply mt-1 text-sm text-yellow-500;
		ion-icon {
			@apply mb-0.5;
		}
		> * {
			@apply align-middle;
		}
	}
}
</style>
