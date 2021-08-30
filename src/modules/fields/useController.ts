import {
	inject,
	InjectionKey,
	onMounted,
	onUnmounted,
	provide,
	Ref,
	WritableComputedRef,
} from 'vue'
import DOCUMENT from '../documents/useDocument'
import { FieldControllerPublicGeneral } from './FieldController'
import {
	createNewFieldController,
	FieldControllerGeneric,
} from './fieldFactory'
import ContentNoteController from './fields/note/ContentNoteController'
import { FieldType } from './types'

interface ControllerRefs<T extends FieldType> {
	name: Ref<string>
	value: Ref<FieldControllerGeneric<T>['value']>
	settings: FieldControllerGeneric<T>['settings']
}

interface useControllerReturn<T extends FieldType> extends ControllerRefs<T> {
	controller: FieldControllerGeneric<T>
}

const FieldControllerKey: InjectionKey<FieldControllerPublicGeneral> =
	Symbol('FieldController')

const getControllerRefs = <T extends FieldType>(
	controller: FieldControllerGeneric<T>,
): ControllerRefs<T> => {
	const name = ref(controller.name),
		value = ref(controller.value),
		settings = reactive(controller.settings)

	const watchers: Array<() => void> = []

	watchers.push(watch(name, v => (controller.name = v)))
	watchers.push(watch(value, v => (controller.value = v), { deep: true }))
	watchers.push(
		watch(settings, v => (controller.settings = v), { deep: true }),
	)

	onUnmounted(() => watchers.forEach(w => w()))
	return { name, value, settings }
}

export function provideController<T extends FieldType>(
	type: T,
	id: string,
): useControllerReturn<T> {
	const controller =
		(DOCUMENT.instance.getController(
			id,
		) as FieldControllerGeneric<T> | null) ?? createNewFieldController(type)
	provide(FieldControllerKey, controller)

	const refs = getControllerRefs(controller)

	return {
		controller,
		name: refs.name,
		value: refs.value,
		settings: refs.settings,
	}
}

export function injectController<T extends FieldType>(
	type: T,
): useControllerReturn<T> {
	const controller =
		inject<FieldControllerGeneric<T>>(FieldControllerKey) ??
		(createNewFieldController(type) as FieldControllerGeneric<T>)

	const refs = getControllerRefs(controller)

	return {
		controller,
		name: refs.name,
		value: refs.value,
		settings: refs.settings,
	}
}

interface UseControllerReturn {
	controller: ContentNoteController
	value: WritableComputedRef<string>
}

export const useNoteController = (id: string): UseControllerReturn => {
	const controller = DOCUMENT.instance.getController(id)

	const createReturnObject = (
		controller: ContentNoteController,
	): UseControllerReturn => ({
		controller,
		value: computed({
			get: () => controller.value,
			set: v => (controller.value = v),
		}),
	})

	// TODO: Implement instantly focusing on fields and notes after they're added
	// onMounted(() => {
	// 	console.log(id, 'mounted')
	// })

	if (controller && controller instanceof ContentNoteController) {
		return createReturnObject(controller)
	} else {
		const controller = createNewFieldController('note')
		return createReturnObject(controller)
	}
}
