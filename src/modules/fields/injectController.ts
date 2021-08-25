import { inject } from 'vue'
import { FieldControllerKey, FieldControllerPublic } from './FieldController'
import { createNewFieldController } from './fieldFactory'
import { FieldType } from './types'

export default function injectController<T extends FieldType>(type: T) {
	const controller =
		inject<FieldControllerPublic<T>>(FieldControllerKey) ??
		(createNewFieldController(type) as FieldControllerPublic<T>)

	const value = computed({
		set: v => (controller.value = v),
		get: () => controller.value,
	})
	const settings = computed({
		set: v => (controller.settings = v),
		get: () => controller.settings,
	})

	return {
		controller,
		value,
		settings,
	}
}
