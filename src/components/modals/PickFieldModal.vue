<script lang="ts" setup>
import type { FieldType } from '@/modules/field'
import {} from 'ionicons/icons'
import { defineProps } from 'vue-demi'

const props = defineProps({
	close: { type: Function, required: true },
	addField: { type: Function, default: undefined },
})

const addField = (type: FieldType) => {
	props.addField?.(type)
	props.close()
}

interface FieldCard {
	name: string
	desc: string
}
const fieldTypes: Record<FieldType, FieldCard> = {
	text: {
		name: 'Simple Text Field',
		desc: 'Note the names, descriptions, car models... in a simple plain-text form.',
	},
	number: {
		name: 'Number Field',
		desc: 'For all your numerical values, like: length, size, number pages in a book, etc.',
	},
	toggle: {
		name: 'True or False Toggle',
		desc: 'Store on/off states in your item, e.g: Is this product in store?',
	},
	email: {
		name: 'Email',
		desc: "Store people's emails. Single or multiple in the same field.",
	},
}
</script>

<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>Pick a field type:</ion-title>
			<ion-buttons slot="end">
				<ion-button @click="close">Close</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding" :fullscreen="true">
		<ion-list class="field-thumbnails">
			<ion-item
				v-for="({ name, desc }, field) in fieldTypes"
				:key="field"
				button
				detail
				class="field-thumbnail"
				@click="addField(field)"
			>
				<div class="field-thumbnail--content">
					<h5>{{ name }}</h5>
					<p>{{ desc }}</p>
				</div>
			</ion-item>
		</ion-list>
	</ion-content>
</template>

<style lang="postcss">
.field-thumbnails {
	@apply space-y-4 bg-transparent;
}
.field-thumbnail {
	&::part(native) {
		@apply bg-gray-100 dark:bg-gray-800 rounded-md;
		--inner-border-width: 0;
	}
	&--content {
		@apply pb-4;
		@apply flex flex-col;
		p {
			@apply text-sm text-gray-700 dark:text-gray-400;
		}
	}
}
</style>
