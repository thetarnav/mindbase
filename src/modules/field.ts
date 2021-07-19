type FieldType = 'text' | 'number' | 'boolean' | 'email'

interface FieldValue {
	text: string
	number: number
	boolean: boolean
	email: string
}

interface FieldSettings {
	text: {
		oneLine: boolean
	}
	number: {
		min?: number
		max?: number
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
	defaultValue?: T

	constructor(
		id: string,
		title: string,
		type: T,
		value: FieldValue[T],
		settings: FieldSettings[T],
		isRequired: boolean,
		defaultValue?: T,
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
