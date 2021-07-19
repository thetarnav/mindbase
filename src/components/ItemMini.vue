<script lang="ts" setup>
import {} from 'ionicons/icons'
import { defineProps, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
	title: { type: String, default: 'Item Without a Title' },
	img: { type: String as () => string | undefined, default: undefined },
	id: { type: String, required: true },
})
const { title, img, id } = toRefs(props),
	router = useRouter()

const openDetails = () =>
	router.push({ name: 'Item', params: { itemID: id.value } })
</script>

<template>
	<ion-item class="item-mini" @click="openDetails">
		<ion-thumbnail slot="start">
			<ion-img :src="img"></ion-img>
		</ion-thumbnail>
		<div class="details">
			<h5>{{ title }}</h5>
			<p>description...</p>
		</div>
	</ion-item>
</template>

<style lang="postcss">
.item-mini {
}
</style>
