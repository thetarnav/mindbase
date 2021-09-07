const componentImport: Record<FieldType, ComponentImport> = {
	text: () => import('./fields/text/TextField.vue') as any,
	number: () => import('./fields/number/NumberField.vue') as any,
	phone: () => import('./fields/phone/PhoneField.vue') as any,
	note: () => import('./fields/note/ContentNote.vue') as any,
}

type ComponentImport = () => Promise<typeof import('*.vue')>

export const getFieldComponentImport = (type: FieldType): ComponentImport =>
	componentImport[type]
