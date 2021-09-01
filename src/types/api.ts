import {
	FieldSettings,
	FieldType,
	RawFieldValues,
} from '@/modules/fields/types'

export interface FieldRawData<T extends FieldType> {
	type: T
	id: string
	name: string
	settings: FieldSettings[T]
	value: RawFieldValues[T]
}
export type AnyFieldRawData = FieldRawData<FieldType>

export interface DocumentMeta {
	id: string
	thumbnail: string | null
	title: string
	description: string | null
}

export type DocumentRawContent = Array<AnyFieldRawData | string>

export interface DocumentRawData extends DocumentMeta {
	content: DocumentRawContent
}
