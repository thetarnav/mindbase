<script lang="ts" setup>
import { ellipsisHorizontal } from 'ionicons/icons'
import { defineAsyncComponent, defineEmit, defineProps } from 'vue'
import type { FieldEntry } from '../field'
import contenteditable from 'vue-contenteditable'
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'

const components = {
	text: defineAsyncComponent(() => import('./fields/Text.vue')),
	number: defineAsyncComponent(() => import('./fields/Number.vue')),
	email: defineAsyncComponent(() => import('./fields/Email.vue')),
	toggle: defineAsyncComponent(() => import('./fields/Toggle.vue')),
	rich: defineAsyncComponent(() => import('./fields/RichText.vue')),
}

const props = defineProps({
	field: { type: Object as () => FieldEntry, reqired: true },
	settingsOpen: { type: Boolean, default: false },
})
const emit = defineEmit(['toggleOptions'])

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
	<div class="field-item--wrapper">
		<ion-button
			fill="clear"
			color="medium"
			class="field-options-btn"
			@click="emit('toggleOptions')"
		>
			<ion-icon slot="icon-only" :icon="ellipsisHorizontal" />
		</ion-button>

		<ion-item
			v-if="field"
			class="field-item"
			:class="{
				[`field-item--${field.type}`]: true,
				'settings-open': settingsOpen,
			}"
		>
			<header slot="start">
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
				:settings-teleport="`[data-teleport='${field.id}']`"
			/>

			<footer slot="helper" class="settings">
				<CollapseTransition>
					<div
						v-show="settingsOpen"
						class="settings-content"
						:data-teleport="field.id"
					>
						<!-- <label>Settings</label> -->
					</div>
				</CollapseTransition>
			</footer>
		</ion-item>
	</div>
</template>

<style lang="postcss">
.field-item {
	&--wrapper {
		@apply relative;

		.field-options-btn {
			@apply absolute z-10 top-2 right-2;
		}
	}

	background: var(--background);

	&::part(native) {
		@apply pt-3 flex flex-col items-start py-2;
		--inner-border-width: 0;
	}

	.title {
		@apply pr-4 my-0 py-1;
	}
	.field-type {
		@apply text-xs capitalize text-gray-600 dark:text-gray-500;
	}

	.field-input {
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

	&--toggle {
		&::part(native) {
			@apply flex-row justify-between pr-16;
		}
		.field-input {
			@apply ml-auto mt-0.5;
		}
	}

	.settings {
		@apply w-full pt-0;
		.settings-content {
			@apply w-full bg-gray-100 dark:bg-gray-800 rounded-b-md;
			ion-item::part(native) {
				--background: transparent;
			}
		}
	}
}
</style>
