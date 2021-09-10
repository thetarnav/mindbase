type DocumentID = string
type FieldID = string

type FieldType = 'text' | 'number' | 'phone' | 'note'
// | 'toggle'
// | 'email'
// | 'rich_text'
// | 'date'
// | 'person'
type APIFieldType = Exclude<FieldType, 'note'>

type PhoneFieldValue = {
	label: string
	number: string
}[]

interface APIFieldValues {
	text: string
	number: number
	phone: PhoneFieldValue
	note: string
	// rich_text: string
	// toggle: boolean
	// email: string
	// date: Date | { start: Date; end: Date }
	// person: string
}

interface TextFieldSettings {
	multiline: boolean
	rich: boolean
}

interface NumberFieldSettings {
	minmax: [number, number] | [null, null]
}

interface PhoneFieldSettings {
	multiple: boolean
}

interface FieldSettings {
	text: TextFieldSettings
	number: NumberFieldSettings
	phone: PhoneFieldSettings
	note: Record<any, any>
}
