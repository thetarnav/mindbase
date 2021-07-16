<script lang="ts" setup>
import {
	IonIcon,
	IonLabel,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonRouterOutlet,
	IonPage,
} from '@ionic/vue'
import { calendar, personCircle } from 'ionicons/icons'
</script>

<template>
	<IonPage>
		<IonTabs>
			<IonTabBar slot="bottom">
				<IonTabButton tab="schedule" href="/tabs/schedule">
					<IonIcon :icon="calendar"></IonIcon>
					<IonLabel>Schedule</IonLabel>
					<IonBadge>6</IonBadge>
				</IonTabButton>

				<IonTabButton tab="speakers" href="/tabs/speakers">
					<IonIcon :icon="personCircle"></IonIcon>
					<IonLabel>Speakers</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs>
	</IonPage>
</template>
