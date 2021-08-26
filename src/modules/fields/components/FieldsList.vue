<script lang="ts" setup>
import {
	addOutline,
	ellipsisHorizontal,
	trashOutline,
	reorderTwoOutline,
	closeOutline,
} from 'ionicons/icons'
import { defineAsyncComponent } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { modalController } from '@ionic/vue'
import Field from './Field.vue'
import { itemCollapseTransition } from '@/utils/transitions'
import DOCUMENT from '@/modules/documents/useDocument'

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

const props = defineProps({
	id: { type: String, required: true },
})
const { addField, removeField, fields } = DOCUMENT.instance

const openedSettingsID = ref<string | null>(null)
const listRef = ref<ComponentPublicInstance>()

const toggleSettings = (fieldID: string) => {
	openedSettingsID.value = openedSettingsID.value === fieldID ? null : fieldID
	listRef.value?.$el.closeSlidingItems?.()
}
const closeSettings = (fieldID: string) => {
	if (openedSettingsID.value === fieldID) openedSettingsID.value = null
}

const onClickAway = (fieldID: string, e: TouchEvent) => {
	// Close Settings only if clicked on not-permitted element
	const { path } = e as any
	const foundPremitted = path.some((node: HTMLElement | Document | Window) => {
		if (node === document || node === window || !(node as any)?.classList)
			return false
		const el = node as HTMLElement
		return el.classList.contains('select-alert') ? true : false
	})
	!foundPremitted && closeSettings(fieldID)
}
</script>

<template>
	<ion-list class="item-fields-list" ref="listRef">
		<!-- <ion-list-header>
			<ion-label>Item Fields:</ion-label>
		</ion-list-header> -->

		<transition-group :css="false" @leave="itemCollapseTransition">
			<Field
				v-for="field in fields"
				:key="field.id"
				:id="field.id"
				:type="field.type"
				:settings-open="openedSettingsID === field.id"
				v-touch:hold="() => toggleSettings(field.id)"
				v-click-away="
					// @ts-ignore
					e => onClickAway(field.id, e)
				"
			>
				<template v-slot:actions>
					<ion-button
						fill="clear"
						color="danger"
						@click="removeField(field.id)"
					>
						<ion-icon slot="icon-only" :icon="trashOutline" />
					</ion-button>
					<ion-button fill="clear" color="dark">
						<ion-icon slot="icon-only" :icon="reorderTwoOutline" />
					</ion-button>
					<ion-button
						fill="clear"
						color="dark"
						class="open-options-btn"
						@click="() => toggleSettings(field.id)"
					>
						<ion-icon
							slot="icon-only"
							:icon="
								openedSettingsID === field.id
									? closeOutline
									: ellipsisHorizontal
							"
						/>
					</ion-button>
				</template>
			</Field>
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
	@apply divide-y divide-gray-200 dark:divide-gray-700 pb-12;
}
.add-field-btn {
	@apply my-6 mx-12;
}
</style>
