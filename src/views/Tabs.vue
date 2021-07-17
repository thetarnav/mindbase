<script lang="ts" setup>
import { toggleBadge } from '@/modules/recaptcha'
import {
	notificationsOutline,
	homeOutline,
	libraryOutline,
	searchOutline,
} from 'ionicons/icons'
import { onMounted } from 'vue'

onMounted(() => {
	toggleBadge(false)
})
</script>

<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="home" href="/tabs/home">
					<ion-icon :icon="homeOutline" />
					<ion-label>Home</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="library" href="/tabs/library">
					<ion-icon :icon="libraryOutline" />
					<ion-label>Library</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="messages" href="/tabs/messages">
					<ion-icon :icon="notificationsOutline" />
					<ion-label>Messages</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="search" href="/tabs/search">
					<ion-icon :icon="searchOutline" />
					<ion-label>Search</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>
