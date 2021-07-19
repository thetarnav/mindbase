<script lang="ts">
import { getItemDetails, useItem } from '@/store/items'
import {} from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'
import contenteditable from 'vue-contenteditable'
import { defineComponent, watch } from 'vue'

export default defineComponent({
	components: { contenteditable },
	setup() {
		const exit = () => router.push('/tabs/home')

		const route = useRoute(),
			router = useRouter()

		const id = String(route.params.itemID)
		const { title, itemExists, description } = useItem(id)

		if (!itemExists) exit()
		// 	details = getItemDetails(id)
		// if (!details) {
		// 	exit()
		// 	return {
		// 		details,
		// 		id,
		// 	}
		// }

		// watch(
		// 	() => details.title,
		// 	title => {
		// 		console.log(title)
		// 	},
		// )
		// return {
		// 	details,
		// 	id,
		// }

		return {
			title,
			itemExists,
			id,
			description,
		}
	},
})
</script>

<template>
	<ion-page id="item-details">
		<ion-content v-if="itemExists" :fullscreen="true" class="ion-padding">
			<ion-text>
				<contenteditable
					tag="h2"
					:contenteditable="true"
					v-model="title"
					:noNL="true"
					:noHTML="true"
				/>
				<contenteditable
					tag="p"
					class="text-gray-600 dark:text-gray-400"
					:contenteditable="true"
					v-model="description"
					:noNL="true"
					:noHTML="true"
				/>
				<p>ID: {{ id }}</p>
			</ion-text>
			<ion-back-button defaultHref="/tabs/home" slot="fixed" />
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
}
</style>
