<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Home</ion-title>
				<ion-buttons slot="end">
					<ion-button :router-link="{ name: 'Account' }">
						<ion-icon :icon="personOutline" />
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Library</ion-title>
				</ion-toolbar>
			</ion-header>
			<Explorer category="recent" />
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import { personOutline } from 'ionicons/icons'
import Explorer from '@/components/Explorer.vue'
</script>

<style lang="postcss">
h1 {
}
</style>
