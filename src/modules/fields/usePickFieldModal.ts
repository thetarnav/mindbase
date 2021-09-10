import { defineAsyncComponent } from 'vue'
import { modalController } from '@ionic/vue'

const PickFieldModal = defineAsyncComponent(
	() => import('@/modules/fields/components/PickFieldModal.vue'),
)

const openPickFieldModal = (): Promise<FieldType> =>
	new Promise<FieldType>((resolve, reject) => {
		modalController
			.create({
				component: PickFieldModal,
				componentProps: {
					close: () => {
						modalController.dismiss()
						reject()
					},
					pickField: (t: FieldType) => resolve(t),
				},
			})
			.then((modal: any) => modal.present())
	})
export default openPickFieldModal
