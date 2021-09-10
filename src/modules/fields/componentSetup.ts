/* eslint-disable @typescript-eslint/prefer-as-const */
import {
	ComponentObjectPropsOptions,
	Ref,
	UnwrapRef,
	WritableComputedRef,
} from 'vue'
import useContent from '@/store/content'
import { cloneDeep, isEqual } from 'lodash'

const inferPropsType = <T extends ComponentObjectPropsOptions>(map: T) => map

const _fieldPropValue = {
	fieldId: { type: String, required: true as true },
	settingsTeleport: { type: String, required: true as true },
	settingsOpen: { type: Boolean, required: true as true },
}
export const fieldPropValues = inferPropsType(_fieldPropValue)

interface UseValueOptions<
	T extends FieldType,
	V extends FieldData<T>['value'],
> {
	fieldID: FieldID
	defaultValue: FieldData<T>['value']
	set?: (v: V) => FieldData<T>['value']
	get?: (v: FieldData<T>['value']) => V
}

export const useFieldValue = <
	T extends FieldType,
	V extends FieldData<T>['value'],
>(
	options: UseValueOptions<T, V>,
): WritableComputedRef<V> => {
	const { fieldID, set, get, defaultValue } = options
	const content = useContent()

	const value = computed<V>({
		set: v => {
			const raw = set ? set(v) : (v as FieldData<T>['value'])
			content.setValue(fieldID, raw)
		},
		get: () => {
			const raw = content.getValue<T>(fieldID) ?? defaultValue
			return get ? get(raw) : (raw as V)
		},
	})

	return value
}

interface UseSettingsOptions<T extends FieldType> {
	fieldID: FieldID
	defaultValue: FieldData<T>['settings']
}

export const useFieldSettings = <T extends FieldType>(
	options: UseSettingsOptions<T>,
): FieldData<T>['settings'] => {
	const { fieldID, defaultValue } = options
	const content = useContent()
	return content.getReactiveSettings(fieldID, defaultValue)
}
