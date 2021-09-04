<script lang="ts" setup>
import {} from 'ionicons/icons'
import ItemHeader from '../modules/documents/components/ItemHeader.vue'
import { IonContent } from '@ionic/vue'
import DOCUMENT from '@/modules/documents/useDocument'
import { onMounted } from 'vue-demi'
import DocumentContent from '@/modules/ItemContent/components/DocumentContent.vue'

const props = defineProps({
	id: { type: String, required: true },
})

const showContent = computed(
	() => DOCUMENT.exists.value && !DOCUMENT.fetching.value,
)

const headerComponent = ref<InstanceType<typeof ItemHeader>>()

onMounted(() => {
	console.log('doc mounted', headerComponent.value?.$el)
})
</script>

<template>
	<ItemHeader ref="headerComponent" />
	<ion-content
		fullscreen
		:scrollEvents="true"
		@ionScroll="headerComponent?.contentScroll($event)"
		v-if="showContent"
	>
		<DocumentContent :id="id" />
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
