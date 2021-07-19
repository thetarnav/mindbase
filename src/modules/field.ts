export type FieldType = 'text' | 'number' | 'boolean' | 'email'

export type FieldEntry = Field<FieldType>

interface FieldValue {
	text: string
	number: number
	boolean: boolean
	email: string
}

const defaultValues: FieldValue = {
	text: '',
	number: 0,
	boolean: false,
	email: '',
}

interface FieldSettings {
	text: {
		oneLine: boolean
	}
	number: {
		minmax?: [number, number]
	}
	email: { multiple: boolean }
	boolean: undefined
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
		title: string,
		type: T,
		settings: FieldSettings[T],
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
