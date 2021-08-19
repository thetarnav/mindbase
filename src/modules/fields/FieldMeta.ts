import { nanoid } from 'nanoid'
import { FieldType } from './field'

export interface FieldMetaData {
	readonly id: string
	readonly type: FieldType
	readonly title: string
	readonly isRequired: boolean

	setTitle: (title: string) => void
}

export default class FieldMeta implements FieldMetaData {
	readonly id: string

	constructor(
		public readonly type: FieldType,
		id?: string,
		private _title: string = '',
		public readonly isRequired = false,
	) {
		this.id = id ?? nanoid()
	}

	get title(): string {
		return this._title
	}

	setTitle(title: string): void {
		this._title = title
	}
}

class PhoneField extends FieldMeta {
	constructor(id?: string, title?: string, isRequired?: boolean) {
		super('phone', id, title, isRequired)
	}
}
