<script lang="ts" setup>
import {} from 'ionicons/icons'
import { defineProps, toRefs } from 'vue-demi'

const props = defineProps({
	title: { type: String, default: 'Item Without a Title' },
	img: { type: String as () => string | undefined, default: undefined },
})
const { title, img } = toRefs(props)
</script>

<template>
	<ion-item class="item-mini">
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
