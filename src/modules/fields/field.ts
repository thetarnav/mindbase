export type FieldType = 'text' | 'number' | 'toggle' | 'email' | 'rich'

export type FieldEntry = Field<FieldType>

interface FieldValue {
	text: string
	number: number
	toggle: boolean
	email: string
	rich: string
}

const defaultValues: FieldValue = {
	text: '',
	number: 0,
	toggle: false,
	email: '',
	rich: 'Content of your Rich Text Field.',
}

export interface FieldSettings {
	text: {
		multiline: boolean
	}
	number: {
		minmax?: [number, number]
	}
	email: { multiple: boolean }
	toggle: Record<string, never>
	rich: Record<string, never>
}

const defaultSettings = {
	text: {
		multiline: true,
	},
	number: {
		minmax: undefined,
	},
	email: {
		multiple: false,
	},
	toggle: {},
	rich: {},
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
		title = 'Title of new field.',
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

	changeTitle(title: string): void {
		this.title = title
	}

	changeValue(value: FieldValue[T]): void {
		this.value = value
	}
}
