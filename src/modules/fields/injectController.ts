import { inject, InjectionKey, provide } from 'vue'
import DOCUMENT from '../documents/useDocument'
import { FieldControllerPublicGeneral } from './FieldController'
import {
	createNewFieldController,
	FieldControllerGeneric,
} from './fieldFactory'
import { FieldType } from './types'

interface InjectControllerReturn<T extends FieldType> {
	controller: FieldControllerGeneric<T>
	value: FieldControllerGeneric<T>['value']
	settings: FieldControllerGeneric<T>['settings']
}

const FieldControllerKey: InjectionKey<FieldControllerPublicGeneral> =
	Symbol('FieldController')

export function provideController<T extends FieldType>(
	type: T,
	id: string,
): FieldControllerGeneric<T> | null {
	const controller = DOCUMENT.instance.getController(id)
	provide(FieldControllerKey, controller)

	return controller as FieldControllerGeneric<T>
}

export function injectController<T extends FieldType>(
	type: T,
): InjectControllerReturn<T> {
	const controller =
		inject<FieldControllerGeneric<T>>(FieldControllerKey) ??
		(createNewFieldController(type) as FieldControllerGeneric<T>)

	return {
		controller,
		value: controller.value,
		settings: controller.settings,
	}
}
