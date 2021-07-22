export type FieldType = 'text' | 'number' | 'toggle' | 'email'

export type FieldEntry = Field<FieldType>

interface FieldValue {
	text: string
	number: number
	toggle: boolean
	email: string
}

const defaultValues: FieldValue = {
	text: '',
	number: 0,
	toggle: false,
	email: '',
}

export interface FieldSettings {
	text: {
		oneLine: boolean
	}
	number: {
		minmax?: [number, number]
	}
	email: { multiple: boolean }
	toggle: undefined
}

const defaultSettings = {
	text: {
		oneLine: true,
	},
	number: {
		minmax: undefined,
	},
	email: {
		multiple: false,
	},
	toggle: undefined,
}

export default class Field<T extends FieldType> {
	/**
	 * unique field name - shared between shape and item
	 */
	id: string
	type: T
	title: string
	value: FieldValue[T]
	settings: FieldSettings[T]
	isRequired: boolean
	defaultValue: FieldValue[T]

	constructor(
		id: string,
		type: T,
		title = "New field's title",
		settings: FieldSettings[T] = defaultSettings[type],
		value: FieldValue[T] = defaultValues[type],
		isRequired = false,
		defaultValue = defaultValues[type],
	) {
		this.id = id
		this.type = type
		this.title = title
		this.value = value
		this.settings = settings
		this.isRequired = isRequired
		this.defaultValue = defaultValue
	}
}
