<script lang="ts" setup>
import {} from 'ionicons/icons'
import { defineAsyncComponent, defineProps } from 'vue'
import type { FieldEntry } from '../field'
import contenteditable from 'vue-contenteditable'

const components = {
	text: defineAsyncComponent(() => import('./fields/Text.vue')),
	number: defineAsyncComponent(() => import('./fields/Number.vue')),
	email: defineAsyncComponent(() => import('./fields/Email.vue')),
	toggle: defineAsyncComponent(() => import('./fields/Toggle.vue')),
}

const props = defineProps({
	field: { type: Object as () => FieldEntry, reqired: true },
	settingsOpen: { type: Boolean, default: false },
})

const title = computed<string>({
	get: () => props.field?.title ?? '',
	set: v => props.field?.changeTitle(v),
})

const value = computed({
	get: () => props.field?.value ?? '',
	set: v => props.field?.changeValue(v),
})
</script>

<template>
	<ion-item
		v-if="field"
		class="field-item"
		:class="`field-item-${field.type}`"
	>
		<header>
			<contenteditable
				tag="h6"
				class="title"
				contenteditable
				v-model="title"
				noNL
				noHTML
			/>
			<p class="field-type">{{ field.type }} Field</p>
		</header>
		<component
			:is="components[field.type]"
			:name="field.id"
			v-model="value"
			:settings="field.settings"
			class="field-item-input"
			:class="`${field.type}-field-input`"
		/>
	</ion-item>
</template>

<style lang="postcss">
.field-item {
	&::part(native) {
		@apply pt-3 flex flex-col items-start py-2 border-b border-gray-300 dark:border-gray-700;
		--inner-border-width: 0;
	}
	&.field-item-toggle {
		&::part(native) {
			@apply flex-row justify-between;
		}
		.toggle-field-input {
			@apply ml-auto mt-0.5;
		}
	}

	.title {
		@apply pr-4 my-0 py-1;
	}
	.field-type {
		@apply text-xs capitalize text-gray-600 dark:text-gray-500;
	}

	.field-item-input {
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

	&--sliding {
		&-leave-active {
			@apply transition duration-500 relative;
			transition-property: opacity, transform, margin-top;
			.field-item {
				@apply transition duration-700;
				transition-property: margin-bottom;
			}
		}
		&-leave-to {
			@apply translate-x-20 opacity-0;
			margin-top: 0 !important;
			.field-item {
				margin-bottom: -100% !important;
			}
		}
	}
}
</style>
