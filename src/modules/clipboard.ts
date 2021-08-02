import clipboardCopy from 'copy-to-clipboard-ultralight'
import { toastController } from '@ionic/vue'

const openToast = async (text: string) => {
	const toast = await toastController.create({
		message: `Copied "${text}" to clipboard.`,
		duration: 2000,
	})
	return toast.present()
}

type Copyable = string | string[] | Record<string, string>

interface RefCopyable {
	value: Copyable
	[key: string]: any
}

export default function copy(source: Copyable | RefCopyable): void {
	const copyable: Copyable =
		typeof source === 'object' && 'value' in source ? source.value : source
	let textValue: string

	if (typeof copyable === 'string') textValue = copyable
	else if (Array.isArray(copyable)) textValue = copyable.join(' ')
	else textValue = Object.values(copyable).join(' ')

	if (!textValue) return

	clipboardCopy(textValue)
	openToast(textValue)
}
