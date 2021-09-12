<script lang="ts" setup>
import {} from 'ionicons/icons'
import { IonContent } from '@ionic/vue'
import ItemHeader from '../modules/documents/components/ItemHeader.vue'
import DocumentContent from '@/modules/ItemContent/components/DocumentContent.vue'
import useDocument from '@/store/document'

defineProps({
	id: { type: String, required: true },
})

const document = useDocument()

const headerComponent = ref<InstanceType<typeof ItemHeader>>()
</script>

<template>
	<ItemHeader ref="headerComponent" />
	<ion-content
		fullscreen
		:scrollEvents="true"
		@ionScroll="headerComponent?.contentScroll($event)"
		v-if="document.fetchState === 'success'"
	>
		<DocumentContent />
	</ion-content>
</template>

<style lang="postcss" scoped>
ion-content {
	@apply relative z-20;
	/* &::part(scroll) { */
	/* @apply pb-24; */
	/* --offset-top: 300px; */
	/* } */
	&::part(background) {
		@apply bg-transparent pointer-events-none;
	}
}
</style>
