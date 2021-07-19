<script lang="ts" setup>
import { useItem } from '@/store/items'
import {} from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'
import contenteditable from 'vue-contenteditable'

const exit = () => router.push('/tabs/home')

const route = useRoute(),
	router = useRouter()

const id = String(route.params.itemID)
const { title, itemExists, description } = useItem(id)

if (!itemExists) exit()
</script>

<template>
	<ion-page id="item-details">
		<ion-content v-if="itemExists" :fullscreen="true" class="ion-padding">
			<ion-back-button defaultHref="/tabs/home" slot="fixed" />
			<header class="item-header">
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
		</ion-content>
	</ion-page>
</template>

<style lang="postcss">
#item-details {
	ion-back-button {
		@apply bottom-6 left-8;
		&::part(native) {
			@apply bg-gray-200 dark:bg-gray-800;
		}
	}
	.item-header {
		@apply pb-4 mb-4 border-b border-gray-500;

		.desc {
			@apply my-4 text-gray-600 dark:text-gray-400;
		}
	}
}
</style>
