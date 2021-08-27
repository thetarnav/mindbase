import { cloneDeep } from 'lodash'
import { nanoid } from 'nanoid'
import {
	ClientFieldValues,
	FieldSettings,
	FieldType,
	RawFieldValues,
} from './types'

export type AnyFieldController = FieldControllerPublic<FieldType>

export interface FieldControllerPublic<T extends FieldType> {
	readonly type: T
	getRawValue: () => RawFieldValues[T]
}

export type FieldControllerPublicGeneral = FieldControllerPublic<FieldType>
export default abstract class FieldController<T extends FieldType>
	implements FieldControllerPublic<T>
{
	constructor(
		public readonly type: T,
		public readonly id: string = nanoid(),
		private _name = '',
		private _settings: FieldSettings[T],
		private _value: ClientFieldValues[T],
	) {}

	get name(): string {
		return this._name
	}
	set name(v: string) {
		console.log('new name', v)
		this._name = v
	}

	get value(): ClientFieldValues[T] {
		return cloneDeep(this._value)
	}
	set value(v: ClientFieldValues[T]) {
		console.log('new value', v)
		this._value = v
	}

	get settings(): FieldSettings[T] {
		return cloneDeep(this._settings)
	}
	set settings(v: FieldSettings[T]) {
		console.log('new settings', v)
		this._settings = v
	}

	getRawValue(): RawFieldValues[T] {
		return this._value
	}
}
