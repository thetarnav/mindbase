import { onUnmounted, Ref } from 'vue-demi'
import { AnyFieldController } from './FieldController'
import { FieldControllerGeneric } from './fieldFactory'
import { FieldType } from './types'

type RefValue<T extends FieldType> = Ref<FieldControllerGeneric<T>['value']>
type ReactiveSettings<T extends FieldType> = FieldControllerGeneric<T>['settings']

interface ControllerRefs<T extends FieldType> {
	name: Ref<string>
	value: RefValue<T>
	settings: ReactiveSettings<T>
}

export const useControllerName = <T extends FieldType>(
	controller: AnyFieldController,
): Ref<string> => {
	const c = controller as FieldControllerGeneric<T>
	const name = ref(c.name)
	const stop = watch(name, v => (c.name = v))
	onUnmounted(stop)
	return name
}

export const useControllerValue = <T extends FieldType>(
	controller: AnyFieldController,
): RefValue<T> => {
	const c = controller as FieldControllerGeneric<T>
	const value = ref(c.value)
	const stop = watch(value, v => (c.value = v), { deep: true })
	onUnmounted(stop)
	return value
}

export const useControllerSettings = <T extends FieldType>(
	controller: AnyFieldController,
): ReactiveSettings<T> => {
	const c = controller as FieldControllerGeneric<T>
	const settings = reactive(c.settings)
	const stop = watch(settings, v => (c.settings = v), { deep: true })
	onUnmounted(stop)
	return settings
}

export const useControllerRefs = <T extends FieldType>(
	c: AnyFieldController,
): ControllerRefs<T> => {
	const name = useControllerName(c),
		value = useControllerValue(c),
		settings = useControllerSettings(c)

	return { name, value, settings }
}
