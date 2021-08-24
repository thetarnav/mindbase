import { nanoid } from 'nanoid'
import {
	defaultSettings,
	defaultValues,
	FieldSettings,
	FieldType,
	FieldValue,
} from './field'

export type AnyFieldController = FieldPublic<FieldType>

interface FieldPublic<T extends FieldType> {
	readonly type: T
	readonly id: string
	name: string
	settings: FieldSettings[T]
	value: FieldValue[T]
}

export default abstract class FieldController<T extends FieldType>
	implements FieldPublic<T>
{
	constructor(
		public readonly type: T,
		public readonly id: string = nanoid(),
		public _name: string = '',
		public _settings: FieldSettings[T] = defaultSettings[type],
		public _value: FieldValue[T] = defaultValues[type],
	) {}

	get name(): string {
		return this._name
	}
	set name(name: string) {
		this._name = name
	}

	get settings(): FieldSettings[T] {
		return this._settings
	}
	set settings(settings: FieldSettings[T]) {
		Object.assign(this._settings, settings)
	}

	// TODO: getter function returning raw value (for the api)

	get value(): FieldValue[T] {
		return this._value
	}
	set value(v: FieldValue[T]) {
		this._value = v
	}
}
