<script lang="ts" setup>
import {
   addOutline,
   ellipsisHorizontal,
   trashOutline,
   reorderTwoOutline,
   closeOutline,
} from 'ionicons/icons'
import { defineAsyncComponent, defineProps } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { modalController } from '@ionic/vue'
import { useItem } from '@/modules/documents/items'
import Field from './Field.vue'

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
const { fields, addField, removeField } = useItem(props.id)

const openedSettingsID = ref<string | null>(null)
const listRef = ref<ComponentPublicInstance>()

const toggleSettings = (fieldID: string) => {
   openedSettingsID.value = openedSettingsID.value === fieldID ? null : fieldID
   listRef.value?.$el.closeSlidingItems?.()
}
const closeSettings = (fieldID: string) => {
   if (openedSettingsID.value === fieldID) openedSettingsID.value = null
}
</script>

<template>
   <ion-list class="item-fields-list" ref="listRef">
      <ion-list-header>
         <ion-label>Item Fields:</ion-label>
      </ion-list-header>

      <transition-group name="field-item--sliding" :duration="700">
         <Field
            v-for="field in fields"
            :key="field.id"
            :field="field"
            :settings-open="openedSettingsID === field.id"
            v-touch:hold="() => toggleSettings(field.id)"
            v-click-away="() => closeSettings(field.id)"
         >
            <template v-slot:actions>
               <ion-button
                  fill="clear"
                  color="danger"
                  @click="removeField?.(field)"
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
   @apply divide-y divide-gray-200;
}
.add-field-btn {
   @apply my-6 mx-12;
}

.field-item--sliding {
   &-leave-active {
      @apply transition duration-700 ease-in-out relative;
      transition-property: opacity, transform, margin-top;
      .field-item {
         @apply transition duration-1000 ease-in-out;
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
</style>
