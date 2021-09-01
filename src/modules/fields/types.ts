import { NumberFieldSettings } from './fields/number/NumberFieldController'
import { TextFieldSettings } from './fields/text/TextFieldController'
import {
	PhoneFieldSettings,
	PhoneFieldValue,
	PhoneFieldValueClient,
} from './fields/phone/PhoneFieldController'

export type FieldType = 'text' | 'number' | 'phone'
// | 'toggle'
// | 'email'
// | 'rich_text'
// | 'date'
// | 'person'

export interface RawFieldValues {
	text: string
	number: number
	phone: PhoneFieldValue
	// rich_text: string
	// toggle: boolean
	// email: string
	// date: Date | { start: Date; end: Date }
	// person: string
}

export interface ClientFieldValues extends RawFieldValues {
	phone: PhoneFieldValueClient
}

export interface FieldSettings {
	text: TextFieldSettings
	number: NumberFieldSettings
	phone: PhoneFieldSettings
}
