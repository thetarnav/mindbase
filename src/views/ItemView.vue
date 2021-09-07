<script lang="ts" setup>
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import Document from '@/components/Document.vue'
import { useIonRouter } from '@ionic/vue'
import useDocument from '@/store/document'
import { watchEffect } from 'vue-demi'

const route = useRoute(),
	router = useIonRouter(),
	document = useDocument()

const id = String(route.params.itemID)

// Go back to home if fetched document doesn't exists
watchEffect(() => {
	if (document.fetchState === 'failure') router.replace('/tabs/home')
})

// Clear the document instance state, as it's not gonna be used anymore
onBeforeRouteLeave(() => {
	document.clear()
})
</script>

<template>
	<ion-page id="item-details">
		<Document v-if="document.fetchState === 'success'" :id="id" />
	</ion-page>
</template>

<style lang="postcss"></style>
