<script lang="ts" setup>
import {
	addOutline,
	ellipsisHorizontal,
	trashOutline,
	reorderTwoOutline,
	closeOutline,
} from 'ionicons/icons'
import type { ComponentPublicInstance, Ref } from 'vue'
import { IonList } from '@ionic/vue'
import { itemCollapseTransition } from '@/utils/transitions'
import { isElementInPath } from '@/utils/dom'
import useReorderList from '../useReorderList'
import Field from '@/modules/fields/components/Field.vue'
import ContentNote from '@/modules/fields/fields/note/ContentNote.vue'
import usePickFieldModal from '@/modules/fields/usePickFieldModal'
import useContent from '@/store/content'
import { storeToRefs } from 'pinia'
import { getNewFieldData } from '@/modules/fields/fieldFactory'

const props = defineProps({
	id: { type: String, required: true },
})
const content = useContent()
const { fields } = storeToRefs(content)

const openedSettingsID = ref<string | null>(null)
const listRef = ref<ComponentPublicInstance>()

const openPickFieldModal = async () => {
	try {
		const type = await usePickFieldModal()
		const newField = getNewFieldData(type)
		content.addField(newField)
	} catch (error) {}
}
const removeField = (id: string) => {
	content.removeField(id)
}

const addContentNote = () => {
	// DOCUMENT.instance.addField('note')
}

const toggleSettings = (fieldID: string) => {
	openedSettingsID.value = openedSettingsID.value === fieldID ? null : fieldID
	// listRef.value?.$el.closeSlidingItems?.()
}
const closeSettings = (fieldID: string) => {
	if (openedSettingsID.value === fieldID) openedSettingsID.value = null
}

const onClickAway = (fieldID: string, e: Event) => {
	// Close Settings only if clicked on not-permitted element
	isElementInPath(e, '.select-alert') || closeSettings(fieldID)
}

useReorderList(listRef as Ref<ComponentPublicInstance>)
</script>

<template>
	<ion-list class="item-fields-list" ref="listRef">
		<transition-group :css="false" @leave="itemCollapseTransition">
			<template v-for="field in fields" :key="field.id">
				<ContentNote
					v-if="field.type === 'note'"
					class="content-note-component"
					:data-field-id="field.id"
					:id="field.id"
				/>
				<Field
					v-else
					class="content-field-component"
					:data-field-id="field.id"
					:id="field.id"
					:type="field.type"
					:settings-open="openedSettingsID === field.id"
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
						<ion-button fill="clear" color="dark" class="reorder-handle">
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
