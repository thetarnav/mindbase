<script lang="ts" setup>
import { defineAsyncComponent, defineProps } from 'vue'
import contenteditable from 'vue-contenteditable'
import { useItem } from '@/modules/documents/items'
import { addOutline, trashOutline, settingsOutline } from 'ionicons/icons'
import { modalController } from '@ionic/vue'

const PickFieldModal = defineAsyncComponent(
	() => import('./PickFieldModal.vue'),
)
const openPickFieldModal = async () => {
	const modal = await modalController.create({
		component: PickFieldModal,
		componentProps: {
			close: () => modalController.dismiss(),
			addField,
		},
	})
	modal.present()
}

const components = {
	text: defineAsyncComponent(() => import('./fields/Text.vue')),
	number: defineAsyncComponent(() => import('./fields/Number.vue')),
	email: defineAsyncComponent(() => import('./fields/Email.vue')),
	toggle: defineAsyncComponent(() => import('./fields/Toggle.vue')),
}

const props = defineProps({
	id: { type: String, required: true },
})
const { fields, addField, removeField } = useItem(props.id)
</script>

<template>
	<ion-list class="item-fields-list">
		<ion-list-header>
			<ion-label>Item Fields:</ion-label>
		</ion-list-header>

		<transition-group name="field-item--sliding" :duration="700">
			<ion-item-sliding v-for="field in fields" :key="field.id">
				<ion-item-options side="start">
					<!-- @ionSwipe="removeField?.(field)" -->
					<ion-item-option color="danger" @click="removeField?.(field)">
						<ion-icon slot="icon-only" :icon="trashOutline" />
					</ion-item-option>
				</ion-item-options>

				<ion-item class="field-item" :class="`field-item-${field.type}`">
					<header>
						<contenteditable
							tag="h6"
							class="title"
							contenteditable
							v-model="field.title"
							noNL
							noHTML
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

				<ion-item-options side="end">
					<ion-item-option>
						<ion-icon slot="icon-only" :icon="settingsOutline" />
					</ion-item-option>
				</ion-item-options>
			</ion-item-sliding>
		</transition-group>

		<ion-button
			@click="openPickFieldModal"
			color="light"
			expand="block"
			class="add-field-btn"
		>
			<ion-icon :icon="addOutline" slot="start" />
			Add new field
		</ion-button>
	</ion-list>
</template>

<style lang="postcss">
.item-fields-list {
	@apply space-y-3;
	/* >ion-item-sliding {
		@apply 
	} */
}
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
.add-field-btn {
	@apply my-6 mx-12;
}
</style>
