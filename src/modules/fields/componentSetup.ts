/* eslint-disable @typescript-eslint/prefer-as-const */
import { ComponentObjectPropsOptions, WritableComputedRef } from 'vue'
import useContent from '@/store/content'

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
	set?: (v: V) => void
	get?: () => V
}

export const useFieldValue = <
	T extends FieldType,
	V extends FieldData<T>['value'],
>(
	options: UseValueOptions<T, V>,
): WritableComputedRef<V> => {
	const { fieldID, set, get } = options
	const content = useContent()

	const value = computed<V>({
		set: v => set?.(v) ?? content.setValue<T>(fieldID, v),
		get: () => get?.() ?? (content.getValue<T>(fieldID) as V),
	})
	return value
}

interface UseSettingsOptions<T extends FieldType> {
	fieldID: FieldID
	set?: (s: FieldData<T>['settings']) => void
	get?: () => FieldData<T>['settings']
}

export const useFieldSettings = <T extends FieldType>(
	options: UseSettingsOptions<T>,
): WritableComputedRef<FieldData<T>['settings']> => {
	const { fieldID, set, get } = options
	const content = useContent()

	const settings = computed({
		set: s => set?.(s) ?? content.setSettings(fieldID, s),
		get: () => get?.() ?? content.getSettings(fieldID) ?? {},
	})
	return settings
}
