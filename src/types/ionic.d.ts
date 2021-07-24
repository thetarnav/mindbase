import { AnimationBuilder } from '@ionic/vue'

export interface ActionSheetButton {
	text?: string
	role?: 'cancel' | 'destructive' | 'selected' | string
	icon?: string
	cssClass?: string | string[]
	handler?: () => boolean | void | Promise<boolean | void>
}

export interface ActionSheetOptions {
	header?: string
	subHeader?: string
	cssClass?: string | string[]
	buttons: (ActionSheetButton | string)[]
	backdropDismiss?: boolean
	translucent?: boolean
	animated?: boolean
	mode?: any
	keyboardClose?: boolean
	id?: string

	enterAnimation?: AnimationBuilder
	leaveAnimation?: AnimationBuilder
}
