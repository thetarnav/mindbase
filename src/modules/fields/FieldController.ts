import { nanoid } from 'nanoid'
import { InjectionKey } from 'vue'
import { FieldSettings, FieldType, FieldValue } from './types'

export type AnyFieldController = FieldControllerPublic<FieldType>

export interface FieldControllerPublic<T extends FieldType> {
	readonly type: T
	readonly id: string
	name: string
	settings: FieldSettings[T]
	value: FieldValue[T]
}

export type FieldControllerGeneral = FieldControllerPublic<FieldType>

export const FieldControllerKey: InjectionKey<FieldControllerGeneral> =
	Symbol('FieldController')

export default abstract class FieldController<T extends FieldType>
	implements FieldControllerPublic<T>
{
	constructor(
		public readonly type: T,
		public readonly id: string = nanoid(),
		public _name: string = '',
		public _settings: FieldSettings[T],
		public _value: FieldValue[T],
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
