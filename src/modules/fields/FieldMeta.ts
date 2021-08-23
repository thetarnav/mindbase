import { nanoid } from 'nanoid'
import { defaultSettings, FieldSettings, FieldType } from './field'

export type FieldGeneral = FieldPublic<FieldType>

interface FieldPublic<T extends FieldType> {
	readonly type: T
	readonly id: string
	title: string
	settings: FieldSettings[T]
}

export default abstract class Field<T extends FieldType>
	implements FieldPublic<T>
{
	constructor(
		public readonly type: T,
		public readonly id: string = nanoid(),
		private _title: string = '',
		private _settings: FieldSettings[T] = defaultSettings[type],
	) {}

	get title(): string {
		return this._title
	}
	set title(title: string) {
		this._title = title
	}

	get settings(): FieldSettings[T] {
		return this._settings
	}
	set settings(settings: FieldSettings[T]) {
		Object.assign(this._settings, settings)
	}
}

class PhoneField extends Field<'phone'> {
	constructor(id?: string, title?: string) {
		super('phone', id, title)
	}
}
