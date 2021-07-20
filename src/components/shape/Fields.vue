<script lang="ts" setup>
import { defineAsyncComponent, defineProps } from 'vue'
import contenteditable from 'vue-contenteditable'
import { useItem } from '@/store/items'
import { addOutline } from 'ionicons/icons'
import { modalController } from '@ionic/vue'

const PickFieldModal = defineAsyncComponent(
	() => import('@/components/modals/PickFieldModal.vue'),
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
	text: defineAsyncComponent(() => import('@/components/fields/Text.vue')),
	number: defineAsyncComponent(() => import('@/components/fields/Number.vue')),
	email: defineAsyncComponent(() => import('@/components/fields/Email.vue')),
	toggle: defineAsyncComponent(() => import('@/components/fields/Toggle.vue')),
}

const props = defineProps({
	id: { type: String, required: true },
})
const { fields, addField } = useItem(props.id)
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
}
.field-item {
	&::part(native) {
		@apply mt-3 flex flex-col items-start py-2 border-b border-gray-300 dark:border-gray-700;
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
}
.add-field-btn {
	@apply my-6 mx-12;
}
</style>
