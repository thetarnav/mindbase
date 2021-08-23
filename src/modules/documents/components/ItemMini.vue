<script lang="ts" setup>
import {} from 'ionicons/icons'
import { defineProps, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import DOC from '../useDocument'

const props = defineProps({
	title: { type: String, default: 'Item Without a Title' },
	img: { type: String as () => string | undefined, default: undefined },
	id: { type: String, required: true },
	desc: { type: String, default: undefined },
})
const { title, img } = toRefs(props),
	router = useRouter()

const openDetails = () => {
	DOC.fetch(props.id)
	router.push({ name: 'Item', params: { itemID: props.id } })
}
</script>

<template>
	<ion-item class="item-mini" button detail @click="openDetails">
		<ion-thumbnail slot="start">
			<ion-img :src="img" :alt="title"></ion-img>
		</ion-thumbnail>
		<div class="details">
			<h5 class="title">{{ title }}</h5>
			<p v-if="desc" class="desc">{{ desc }}</p>
		</div>
	</ion-item>
</template>

<style lang="postcss">
.item-mini {
	@apply mb-2;
	.title {
		@add-mixin limit-lines 2;
	}
	.desc {
		@add-mixin limit-lines 2;
		@apply text-sm leading-tight text-gray-600 dark:text-gray-400;
	}
}
</style>
