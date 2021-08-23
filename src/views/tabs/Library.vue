<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button>
						<ion-icon :icon="funnelOutline" />
					</ion-button>
					<ion-button>
						<ion-icon :icon="pricetagsOutline"></ion-icon>
					</ion-button>
				</ion-buttons>
				<ion-title>Library</ion-title>
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
			<Explorer category="all" />
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import { personOutline, pricetagsOutline, funnelOutline } from 'ionicons/icons'
import Explorer from '@/components/Explorer.vue'
</script>
