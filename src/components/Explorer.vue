<script lang="ts" setup>
import {} from 'ionicons/icons'
import { getItems } from '@/store/items'
import ItemMini from './ItemMini.vue'
</script>

<template>
	<div class="explorer-component">
		<ion-list>
			<ion-list-header>
				<ion-label>Your Items</ion-label>
			</ion-list-header>
			<ItemMini
				v-for="item in getItems"
				:key="item.id"
				:title="item.title"
				:img="item.thumbnail"
			/>
		</ion-list>
	</div>
</template>

<style lang="postcss">
.explorer-component {
}
</style>
