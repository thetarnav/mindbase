<script lang="ts" setup>
import {} from 'ionicons/icons'
import { defineAsyncComponent } from 'vue'
import type { FieldEntry } from '../field'

const components = {
	text: defineAsyncComponent(() => import('../fields/text/TextField.vue')),
	rich_text: defineAsyncComponent(() => import('./fields/RichText.vue')),
	number: defineAsyncComponent(() => import('./fields/Number.vue')),
	toggle: defineAsyncComponent(() => import('./fields/Toggle.vue')),
	email: defineAsyncComponent(() => import('./fields/Email/index.vue')),
	phone: defineAsyncComponent(() => import('./fields/Phone.vue')),
	date: defineAsyncComponent(() => import('./fields/Date.vue')),
	person: defineAsyncComponent(() => import('./fields/Person.vue')),
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

const settings = computed({
	get: () => props.field?.settings ?? {},
	set: v => props.field?.changeSettings(v),
})
</script>

<template>
	<div
		v-if="field"
		class="field-item--wrapper"
		:class="{ 'field-settings-open': settingsOpen }"
	>
		<div class="field-item--actions">
			<slot name="actions"></slot>
		</div>

		<div class="field-item" :class="`field-item--${field.type}`">
			<header>
				<contenteditable
					tag="h6"
					class="title"
					v-model="title"
					:contenteditable="settingsOpen"
					noNL
					noHTML
				/>
				<!-- <p class="field-type">{{ field.type }} Field</p> -->
			</header>

			<component
				:is="components[field.type]"
				v-model="value"
				v-model:settings="settings"
				:settings-teleport="`[data-teleport='${field.id}']`"
				:name="field.id"
				:settings-open="settingsOpen"
			/>
		</div>
		<footer class="field-item--settings">
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
	</div>
</template>

<style lang="postcss">
.field-item {
	@apply px-4 py-6 flex flex-col items-stretch;

	&--wrapper {
		@apply relative;
	}

	/* background: var(--background); */

	&::part(native) {
		--inner-border-width: 0;
	}

	> header {
		@apply mb-4;
	}

	.title {
		@apply pr-4 my-0 py-1 text-gray-700 dark:text-gray-400;
	}
	.field-type {
		@apply text-xs capitalize text-gray-600 dark:text-gray-500;
	}

	.field-input {
		@apply bg-gray-100 dark:bg-gray-800 px-2 rounded;
		@apply font-medium text-gray-800 dark:text-gray-100;
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
		@apply flex-row justify-between pr-24;
		.field-input {
			@apply ml-auto mt-0.5;
		}
	}
}

.field-item--settings {
	@apply w-full pt-0;
	.settings-content {
		@apply w-full bg-gray-100 dark:bg-gray-800 rounded-b-md;
		ion-item::part(native) {
			--background: transparent;
		}
	}
	ion-label {
		i {
			@apply text-sm text-gray-400;
		}
	}
}

.field-item--actions {
	@apply absolute top-3 right-3 p-1 flex;
	@apply transition-colors rounded;
	> * {
		@apply m-0 transition-opacity;

		&:not(.open-options-btn) {
			@apply opacity-0 pointer-events-none;
		}
		&.open-options-btn {
			@apply opacity-50;
		}
	}
}
.field-settings-open .field-item--actions {
	@apply z-10 bg-gray-100 dark:bg-gray-800 bg-opacity-50;
	> * {
		@apply opacity-100 pointer-events-auto;
	}
}
</style>
