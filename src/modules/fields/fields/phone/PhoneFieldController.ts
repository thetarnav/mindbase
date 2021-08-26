import FieldController from '../../FieldController'

export type PhoneFieldValue = {
	label?: string
	number: string
}[]

export type PhoneFieldValueClient = PhoneItem[]

interface PhoneItem {
	id: number
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
		let lastID = 0
		const localValue: PhoneFieldValueClient = value.map(v => ({
			label: v.label ?? '',
			number: v.number,
			id: lastID++,
			code: 'US',
			compact: v.number,
		}))

		super('phone', id, name, settings, localValue)
	}
}
