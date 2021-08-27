import FieldController from '../../FieldController'

export type PhoneFieldValue = {
	label?: string
	number: string
}[]

export type PhoneFieldValueClient = PhoneItem[]

interface PhoneItem {
	label: string
	number: string
	compact: string
	code: string
}

export interface PhoneFieldSettings {
	multiple: boolean
}

const defaultSettings: PhoneFieldSettings = {
	multiple: false,
}

export default class PhoneFieldController extends FieldController<'phone'> {
	constructor(
		id?: string,
		name?: string,
		settings = defaultSettings,
		value: PhoneFieldValue = [],
	) {
		// Parse raw value from api to form wanted by the local component
		const localValue: PhoneFieldValueClient = value.map(v => ({
			label: v.label ?? '',
			number: v.number,
			code: 'US',
			compact: v.number,
		}))

		super('phone', id, name, settings, localValue)
	}
}
