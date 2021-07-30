<script lang="ts" setup>
import type { FieldSettings } from '@/modules/fields/field'
import {} from 'ionicons/icons'
import { defineEmit, defineProps } from 'vue'

const props = defineProps({
   name: { type: String, required: true },
   modelValue: { type: String, required: true },
   settings: { type: Object as () => FieldSettings['text'], required: true },
   settingsTeleport: { type: String, required: true },
   settingsOpen: { type: Boolean, required: true },
})
const emit = defineEmit(['update:modelValue', 'update:settings'])

const value = computed({
   get: () => props.modelValue,
   set: v => emit('update:modelValue', v),
})

const settingsValues = computed({
   get: () => props.settings,
   set: v => emit('update:settings', v),
})
</script>

<template>
   <ion-input
      v-if="!props.settings.multiline"
      :name="name"
      type="text"
      v-model="value"
      :disabled="settingsOpen"
      placeholder="Type the content of your text field."
      class="field-input"
   />
   <ion-textarea
      v-else
      :autoGrow="true"
      :name="name"
      v-model="value"
      :disabled="settingsOpen"
      placeholder="Type the content of your text field."
      class="field-input"
   />
   <teleport :to="settingsTeleport">
      <ion-item class="settings-item">
         <ion-label>Multiline</ion-label>
         <ion-checkbox slot="end" v-model="settingsValues.multiline" />
      </ion-item>
   </teleport>
</template>

<style lang="postcss">
.settings-item {
   /* @apply flex items-center space-x-4; */
}
</style>
