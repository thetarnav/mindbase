import { nanoid } from 'nanoid'
import { defaultPhoneSettings } from './fields/phone/phoneSetup'
import { defaultValue as defaultNoteValue } from './fields/note/contentNoteSetup'

const componentImport: Record<FieldType, ComponentImport> = {
	text: () => import('./fields/text/TextField.vue') as any,
	number: () => import('./fields/number/NumberField.vue') as any,
	phone: () => import('./fields/phone/PhoneField.vue') as any,
	note: () => import('./fields/note/ContentNote.vue') as any,
}

type ComponentImport = () => Promise<typeof import('*.vue')>

export const getFieldComponentImport = (type: FieldType): ComponentImport =>
	componentImport[type]

const defaultSettings: FieldSettings = {
	note: {},
	text: {
		multiline: false,
		rich: false,
	},
	number: {
		minmax: [null, null],
	},
	phone: defaultPhoneSettings,
}

const defaultValues: APIFieldValues = {
	note: defaultNoteValue,
	text: '',
	number: 0,
	phone: [],
}

export const getNewFieldData = <T extends FieldType>(
	type: T,
	value?: FieldData<T>['value'],
): FieldData<T> => ({
	id: nanoid(),
	type,
	name: '',
	settings: defaultSettings[type],
	value: value ?? defaultValues[type],
})
