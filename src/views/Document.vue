<script lang="ts" setup>
import {} from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'
import Fields from '@/modules/fields/components/FieldsList.vue'
import ItemHeader from '../modules/documents/components/ItemHeader.vue'
import { IonContent } from '@ionic/vue'
import DOCUMENT from '@/modules/documents/useDocument'

const route = useRoute(),
	router = useRouter()

const id = String(route.params.itemID)
const docState = DOCUMENT.instance.state

// Go back to home if fetched document doesn't exists
!docState.exists && !DOCUMENT.fetching.value && router.push('/tabs/home')

// const contentComponent = ref<ComponentPublicInstance>()
const headerComponent = ref<InstanceType<typeof ItemHeader>>()
</script>

<template>
	<ion-page id="item-details">
		<ItemHeader :id="id" ref="headerComponent" />
		<ion-content
			fullscreen
			:scrollEvents="true"
			@ionScroll="headerComponent?.contentScroll($event)"
		>
			<!-- <ion-back-button defaultHref="/tabs/home" slot="fixed" color="light" /> -->
			<Fields :id="id" />
		</ion-content>
	</ion-page>
</template>

<style lang="postcss">
#item-details {
	/* ion-back-button {
		@apply bottom-6 left-8;
		&::part(native) {
			@apply bg-gray-800 dark:bg-gray-200;
		}
	} */

	> ion-content {
		@apply relative z-20;
		&::part(scroll) {
			/* @apply pb-24; */
			/* --offset-top: 300px; */
		}
		&::part(background) {
			@apply bg-transparent pointer-events-none;
		}
	}
}
</style>
