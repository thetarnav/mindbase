import { registerSW } from 'virtual:pwa-register'
import { toastController } from '@ionic/vue'
import { reloadOutline } from 'ionicons/icons'

const updateSW = registerSW({
	onNeedRefresh() {
		openToastOptions()
	},
	// onOfflineReady() {
	//   // show a ready to work offline to user
	// },
})

async function openToastOptions() {
	const toast = await toastController.create({
		header: 'New content available!',
		message: 'New content available, click on reload button to update.',
		position: 'top',
		buttons: [
			{
				side: 'start',
				icon: reloadOutline,
				text: 'Reload',
				handler: () => updateSW(),
			},
			{
				text: 'Cancel',
				role: 'cancel',
			},
		],
	})
	await toast.present()
}
