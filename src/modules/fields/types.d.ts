import { NumberFieldSettings } from './fields/number/numberFieldController'
import { TextFieldSettings } from './fields/text/textFieldController'

export type FieldType = 'text' | 'number'
// | 'toggle'
// | 'email'
// | 'rich_text'
// | 'phone'
// | 'date'
// | 'person'

export interface FieldValue {
	text: string
	// rich_text: string
	number: number
	// toggle: boolean
	// email: string
	// phone:
	// 	| string
	// 	| {
	// 			label: string
	// 			number: string
	// 	  }[]
	// date: Date | { start: Date; end: Date }
	// person: string
}

export interface FieldSettings {
	text: TextFieldSettings
	number: NumberFieldSettings
}
