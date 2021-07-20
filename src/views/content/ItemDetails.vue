<script lang="ts" setup>
import { useItem } from '@/store/items'
import {} from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'
import contenteditable from 'vue-contenteditable'
import Fields from '@/components/shape/Fields.vue'

const exit = () => router.push('/tabs/home')

const route = useRoute(),
	router = useRouter()

const id = String(route.params.itemID)
const { title, itemExists, description } = useItem(id)

if (!itemExists) exit()
</script>

<template>
	<ion-page id="item-details">
		<ion-content v-if="itemExists" :fullscreen="true">
			<ion-back-button defaultHref="/tabs/home" slot="fixed" color="light" />
			<header class="item-header ion-padding">
				<contenteditable
					tag="h2"
					:contenteditable="true"
					v-model="title"
					:noNL="true"
					:noHTML="true"
				/>
				<contenteditable
					tag="p"
					class="desc"
					:contenteditable="true"
					v-model="description"
					:noNL="true"
					:noHTML="true"
				/>
				<p>ID: {{ id }}</p>
			</header>
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
	.item-header {
		@apply pb-4 border-b border-gray-500;

		.desc {
			@apply my-4 text-gray-600 dark:text-gray-400;
		}
	}
	> ion-content::part(scroll) {
		@apply pb-24;
	}
}
</style>
