import { nanoid } from 'nanoid'
import { defaultPhoneSettings } from './fields/phone/phoneSetup'

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
	note: '',
	text: '',
	number: 0,
	phone: [],
}

export const getNewFieldData = <T extends FieldType>(
	type: T,
): FieldData<T> => ({
	id: nanoid(),
	type,
	name: '',
	settings: defaultSettings[type],
	value: defaultValues[type],
})
