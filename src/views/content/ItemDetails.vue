<script lang="ts" setup>
import { useItem } from '@/store/items'
import {} from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'
import Fields from '@/components/shape/Fields.vue'
import ItemHeader from './ItemHeader.vue'
import { IonContent } from '@ionic/vue'

const exit = () => router.push('/tabs/home')

const route = useRoute(),
	router = useRouter()

const id = String(route.params.itemID)
const { itemExists } = useItem(id)

if (!itemExists) exit()

// const contentComponent = ref<ComponentPublicInstance>()
const headerComponent = ref<InstanceType<typeof ItemHeader>>()

// const setContentOffset = offset
</script>

<template>
	<ion-page id="item-details">
		<ItemHeader :id="id" ref="headerComponent" />
		<ion-content
			v-if="itemExists"
			fullscreen
			:scrollEvents="true"
			@ionScroll="headerComponent?.contentScroll($event)"
		>
			<ion-back-button defaultHref="/tabs/home" slot="fixed" color="light" />
			<Fields :id="id" />
		</ion-content>
	</ion-page>
</template>

<style lang="postcss">
#item-details {
	ion-back-button {
		@apply bottom-6 left-8;
		&::part(native) {
			@apply bg-gray-800 dark:bg-gray-200;
		}
	}

	> ion-content {
		@apply relative z-20;
		&::part(scroll) {
			@apply pb-24;
			/* --offset-top: 300px; */
		}
		&::part(background) {
			@apply bg-transparent pointer-events-none;
		}
	}
}
</style>
