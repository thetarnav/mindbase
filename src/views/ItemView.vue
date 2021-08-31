<script lang="ts" setup>
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import DOCUMENT from '@/modules/documents/useDocument'
import Document from '@/components/Document.vue'
import { useIonRouter } from '@ionic/vue'

const route = useRoute(),
	router = useIonRouter()

const id = String(route.params.itemID)

const itemExists = computed(() => DOCUMENT.exists.value)

// Go back to home if fetched document doesn't exists
if (!DOCUMENT.exists.value && !DOCUMENT.fetching.value)
	router.replace('/tabs/home')

// Clear the document instance state, as it's not gonna be used anymore
onBeforeRouteLeave(() => {
	DOCUMENT.clear()
})
</script>

<template>
	<ion-page id="item-details">
		<Document v-if="itemExists" :id="id" />
	</ion-page>
</template>

<style lang="postcss"></style>
