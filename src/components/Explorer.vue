<script lang="ts" setup>
import {} from 'ionicons/icons'
import { getItems } from '@/modules/documents/items'
import ItemMini from '../modules/documents/components/ItemMini.vue'
</script>

<template>
	<div class="explorer-component">
		<ion-list>
			<ion-list-header>
				<ion-label>Your Items</ion-label>
			</ion-list-header>
			<ItemMini
				v-for="{ id, title, thumbnail, description } in getItems"
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
