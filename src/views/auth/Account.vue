<script lang="ts" setup>
import {} from 'ionicons/icons'
import { logOut, username, email } from '@/modules/auth'
</script>

<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button />
				</ion-buttons>
				<ion-title>Account</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-text color="primary">
				<h3>{{ username || 'no username :(' }}</h3>
			</ion-text>
			<h6>{{ email }}</h6>
			<ion-button @click="logOut"> Sign Out </ion-button>
		</ion-content>
	</ion-page>
</template>

<style lang="postcss"></style>
