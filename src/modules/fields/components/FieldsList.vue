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
import ContentNote from '../fields/note/ContentNote.vue'

const PickFieldModal = defineAsyncComponent(
	() => import('./PickFieldModal.vue'),
)

const props = defineProps({
	id: { type: String, required: true },
})
const { fields } = DOCUMENT.instance

const openedSettingsID = ref<string | null>(null)
const listRef = ref<ComponentPublicInstance>()

const openPickFieldModal = async () => {
	const modal = await modalController.create({
		component: PickFieldModal,
		componentProps: {
			close: () => modalController.dismiss(),
			addField: (t: any) => DOCUMENT.instance.addField(t),
		},
	})
	modal.present()
}
const removeField = (id: string) => DOCUMENT.instance.removeField(id)

const addContentNote = () => {
	DOCUMENT.instance.addField('note')
}

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
			<template v-for="field in fields" :key="field.id">
				<ContentNote v-if="field.type === 'note'" :id="field.id" />
				<Field
					v-else
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
			</template>
		</transition-group>

		<div class="add-new-group">
			<ion-button @click="openPickFieldModal" color="light" expand="block">
				<ion-icon :icon="addOutline" slot="start" />
				Field
			</ion-button>
			<ion-button @click="addContentNote" color="light" expand="block">
				<ion-icon :icon="addOutline" slot="start" />
				Text
			</ion-button>
		</div>
	</ion-list>
</template>

<style lang="postcss" scoped>
.item-fields-list {
	@apply divide-y divide-gray-200 dark:divide-gray-700 pb-12;
}
.add-new-group {
	@apply my-4 mx-6 flex justify-center space-x-4;
	border-width: 0px !important;
}
</style>
