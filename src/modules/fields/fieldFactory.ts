import { FieldSettings, FieldType, RawFieldValues } from './types'
import NumberFieldController from './fields/number/NumberFieldController'
import TextFieldController from './fields/text/TextFieldController'
import PhoneFieldController from './fields/phone/PhoneFieldController'
import ContentNoteController from './fields/note/ContentNoteController'

const fieldControllersMap = {
	text: TextFieldController,
	number: NumberFieldController,
	phone: PhoneFieldController,
	note: ContentNoteController,
}
export type FieldControllerGeneric<T extends FieldType> = InstanceType<
	typeof fieldControllersMap[T]
>

export type FieldControllerGeneral = FieldControllerGeneric<FieldType>

const componentImport: Record<FieldType, ComponentImport> = {
	text: () => import('./fields/text/TextField.vue') as any,
	number: () => import('./fields/number/NumberField.vue') as any,
	phone: () => import('./fields/phone/PhoneField.vue') as any,
	note: () => import('./fields/note/ContentNote.vue') as any,
}

type ComponentImport = () => Promise<typeof import('*.vue')>

export function createNewFieldController<T extends FieldType>(
	type: T,
): FieldControllerGeneric<T> {
	const controller = new fieldControllersMap[
		type
	]() as FieldControllerGeneric<T>
	return controller
}

export function createFieldController<T extends FieldType>(
	type: T,
	id: string,
	name?: string,
	settings?: FieldSettings[T],
	value?: RawFieldValues[T],
): FieldControllerGeneric<T> {
	const controller = new fieldControllersMap[type](
		id,
		name,
		// @ts-ignore
		settings,
		// @ts-ignore
		value,
	) as FieldControllerGeneric<T>
	return controller
}

export const getFieldComponentImport = (type: FieldType): ComponentImport =>
	componentImport[type]
