<template>
	<ion-page id="search-page">
		<ion-header>
			<ion-toolbar>
				<ion-searchbar />
			</ion-toolbar>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-chip color="primary">
						<ion-icon :icon="pin" />
						<ion-label>Shapes</ion-label>
					</ion-chip>
					<ion-chip color="secondary">
						<ion-icon :icon="heart" />
						<ion-label>Tags</ion-label>
					</ion-chip>
					<ion-button>
						<ion-icon :icon="appsOutline" />
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<h1>Search</h1>
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import { heart, pin, appsOutline } from 'ionicons/icons'
</script>

<style lang="postcss">
#search-page {
	ion-chip {
		@apply flex-shrink-0;
	}
}
</style>
