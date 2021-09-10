import useContent from '@/store/content'
import { Ref, toRef } from 'vue-demi'
import { biSyncSetSource } from '@/utils/reactivity'

export interface PhoneItem {
	label: string
	number: string
	compact: string
	code: string
}
export type LocalPhoneFieldValue = PhoneItem[]

export const defaultValue: PhoneFieldValue = []

export const setRawPhoneValue = (
	localValue: LocalPhoneFieldValue,
): PhoneFieldValue =>
	localValue.map(p => ({
		label: p.label,
		number: p.compact,
	}))

export const getLocalPhoneValue = (
	value: PhoneFieldValue,
): LocalPhoneFieldValue =>
	value.map(v => ({
		label: v.label ?? '',
		number: v.number,
		code: 'US',
		compact: v.number,
	}))

export const useReactivePhoneValue = (
	id: FieldID,
): Ref<LocalPhoneFieldValue> => {
	const content = useContent()
	const field = content.getField<'phone'>(id)
	const rawValue = field ? toRef(field, 'value') : ref(defaultValue)
	return biSyncSetSource(rawValue, getLocalPhoneValue, setRawPhoneValue)
}
