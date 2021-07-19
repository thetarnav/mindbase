<script lang="ts" setup>
import {
	notificationsOutline,
	homeOutline,
	libraryOutline,
	searchOutline,
	addOutline,
} from 'ionicons/icons'
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

				<ion-tab-button tab="add-item" class="add-btn-tab">
					<ion-icon :icon="addOutline" />
				</ion-tab-button>

				<ion-tab-button
					tab="messages"
					href="/tabs/messages"
					:translucent="true"
				>
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

<style lang="postcss">
ion-tab-bar {
	.add-btn-tab {
		ion-icon {
			@apply bg-gray-200 dark:bg-gray-100 text-gray-900 rounded-full w-10 h-10;
		}
	}
}
</style>
