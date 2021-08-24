import { FieldSettings, FieldType, FieldValue } from './field'
import NumberFieldController from './fields/number/numberFieldController'
import TextFieldController from './fields/text/textFieldController'

const controllersDictionary = {
	text: TextFieldController,
	number: NumberFieldController,
}

type ControllersDictionary = {
	text: TextFieldController
	number: NumberFieldController
}

const getControllerClass = <T extends FieldType>(type: T) =>
	controllersDictionary[type]

export function createNewField<T extends FieldType>(
	type: T,
): ControllersDictionary[T] {
	const controller = new (getControllerClass(
		type,
	))() as ControllersDictionary[T]
	return controller
}
export function createField<T extends FieldType>(
	type: T,
	id: string,
	name?: string,
	settings?: FieldSettings[T],
	value?: FieldValue[T],
): ControllersDictionary[T] {
	const controller = new (getControllerClass(type))(
		id,
		name,
		// @ts-ignore
		settings,
		value,
	) as ControllersDictionary[T]
	return controller
}
