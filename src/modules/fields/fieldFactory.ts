import { FieldSettings, FieldType, FieldValue } from './field'
import NumberFieldController from './fields/number/numberFieldController'
import TextFieldController from './fields/text/textFieldController'

const fieldControllersMap = {
	text: TextFieldController,
	number: NumberFieldController,
}
type FieldControllerGeneric<T extends FieldType> = InstanceType<
	typeof fieldControllersMap[T]
>

const componentPaths: Record<FieldType, string> = {
	text: './fields/text/TextField.vue',
	number: './fields/number/Number.vue',
}

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
	value?: FieldValue[T],
): FieldControllerGeneric<T> {
	const controller = new fieldControllersMap[type](
		id,
		name,
		// @ts-ignore
		settings,
		value,
	) as FieldControllerGeneric<T>
	return controller
}

export const getFieldComponentPath = (type: FieldType): string =>
	componentPaths[type]
