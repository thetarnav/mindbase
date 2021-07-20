<script lang="ts" setup>
import { defineAsyncComponent, defineProps } from 'vue'
import contenteditable from 'vue-contenteditable'
import { useItem } from '@/store/items'
import {} from 'ionicons/icons'

const TextField = defineAsyncComponent(() => import('./fields/Text.vue'))
const NumberField = defineAsyncComponent(() => import('./fields/Number.vue'))
const EmailField = defineAsyncComponent(() => import('./fields/Email.vue'))

const props = defineProps({
	id: { type: String, required: true },
})
const { fields } = useItem(props.id)

const components = {
	text: TextField,
	number: NumberField,
	email: EmailField,
}
</script>

<template>
	<ion-list class="item-fields-list">
		<ion-list-header>
			<ion-label>Item Fields:</ion-label>
		</ion-list-header>
		<ion-item v-for="field in fields" :key="field.id">
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
			<!-- <ion-label slot="start">
			</ion-label> -->
			<component
				v-if="
					field.type === 'text' ||
					field.type === 'number' ||
					field.type === 'email'
				"
				:is="components[field.type]"
				:name="field.id"
				v-model="field.value"
				:settings="field.settings"
			/>
			<ion-text v-else>
				<p>{{ field.value }}</p>
			</ion-text>
		</ion-item>
	</ion-list>
</template>

<style lang="postcss">
.item-fields-list {
	.title {
		@apply mt-3 pr-4 mb-1;
	}
	.field-type {
		@apply text-xs capitalize text-gray-600;
	}
	ion-item::part(native) {
		@apply flex flex-col items-start py-2 border-b border-gray-300 dark:border-gray-700;
		--inner-border-width: 0;
	}
}
</style>
