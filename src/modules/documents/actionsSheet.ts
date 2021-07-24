import { ActionSheetOptions } from '@/types/ionic'
import { actionSheetController } from '@ionic/vue'
import {
	heartOutline,
	shareSocialOutline,
	trashOutline,
	shapesOutline,
} from 'ionicons/icons'

export default async function displayItemOptionsSheet(): Promise<void> {
	const actionSheetOptions: ActionSheetOptions = {
		header: 'Document actions:',
		cssClass: 'item-action-sheet',
		buttons: [
			{
				text: 'Add to Favorites',
				icon: heartOutline,
				handler: () => {
					console.log('Add to Favorites')
				},
			},
			{
				text: 'Share Document',
				icon: shareSocialOutline,
				handler: () => {
					console.log('Share Document')
				},
			},
			{
				text: 'View Shape',
				icon: shapesOutline,
				handler: () => {
					console.log('View Shape')
				},
			},
			{
				text: 'Delete Document',
				role: 'destructive',
				icon: trashOutline,
				handler: () => {
					console.log('Delete Document')
				},
			},
		],
	}
	const actionSheet = await actionSheetController.create(actionSheetOptions)
	await actionSheet.present()
}
