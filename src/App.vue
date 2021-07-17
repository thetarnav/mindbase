<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { setupRecaptcha } from './modules/recaptcha'
import router from './router'
// router.push('/')
setupRecaptcha.call(this)
</script>
