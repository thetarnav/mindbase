<script lang="ts" setup>
import { getItems } from '@/modules/apiSimulator'
import { DocumentMeta } from '@/modules/documents/useDocument'
import {} from 'ionicons/icons'
import { onMounted } from 'vue-demi'
// import { getItems } from '@/modules/documents/items'
import ItemMini from '../modules/documents/components/ItemMini.vue'

const props = defineProps({
	category: { type: String, required: true },
})
const itemsCategory: 'all' | 'recent' =
	props.category === 'recent' ? 'recent' : 'all'

const items = ref<DocumentMeta[]>([])

onMounted(async () => {
	items.value = await getItems(itemsCategory)
})
</script>

<template>
	<div class="explorer-component">
		<ion-list>
			<ion-list-header>
				<ion-label>Your Items</ion-label>
			</ion-list-header>
			<ItemMini
				v-for="{ id, title, thumbnail, description } in items"
				:key="id"
				:title="title"
				:img="thumbnail"
				:id="id"
				:desc="description"
			/>
		</ion-list>
	</div>
</template>

<style lang="postcss">
.explorer-component {
}
</style>
