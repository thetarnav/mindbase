import { nanoid } from 'nanoid'
import { watchEffect } from 'vue'
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
	public name: string
	public value: ClientFieldValues[T]
	public settings: FieldSettings[T]

	constructor(
		public readonly type: T,
		public readonly id: string = nanoid(),
		name = '',
		settings: FieldSettings[T],
		value: ClientFieldValues[T],
	) {
		this.name = name
		this.value = value as any
		this.settings = settings as any

		watchEffect(() => {
			console.log('new name:', this.name)
		})
		watchEffect(() => {
			console.log('new value:', this.value)
		})
		watchEffect(() => {
			console.log('new settings:', this.settings)
		})
	}

	getRawValue(): RawFieldValues[T] {
		return this.value
	}
}
