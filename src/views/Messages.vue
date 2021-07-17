<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button>
						<ion-icon :icon="funnelOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>Messages</ion-title>
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
					<ion-title size="large">Messages</ion-title>
				</ion-toolbar>
			</ion-header>

			<!-- <ExploreContainer name="Tab 3 page" /> -->
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
} from '@ionic/vue'
import { funnelOutline, personOutline } from 'ionicons/icons'
</script>
