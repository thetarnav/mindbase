import { FieldType } from '../fields/types'

export interface ContentMeta {
	id: string
	type: FieldType
}

export type FieldsList = ContentMeta[]
