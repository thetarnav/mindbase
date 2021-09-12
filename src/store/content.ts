import { parseAPIContentToFields } from '@/modules/api/content'
import { removeFromArray } from '@/utils/functions'
import { copyArray, copyObject } from '@/utils/fp'
import { defineStore } from 'pinia'

/**
 * Manages state of the currently viewed document's content.
 */
const useContent = defineStore('content', {
	state: () => ({
		fields: <FieldsList>[],
	}),
	getters: {
		getField(state) {
			return <T extends FieldType>(fieldID: FieldID) => {
				const field = state.fields.find(field => field.id === fieldID)
				return field as FieldData<T> | undefined
			}
		},
		getName() {
			return (fieldID: FieldID) => this.getField(fieldID)?.name ?? ''
		},
		getValue() {
			return <T extends FieldType>(fieldID: FieldID) => {
				const field = this.getField<T>(fieldID)
				return field?.value as FieldData<T>['value'] | undefined
			}
		},
		getSettings() {
			return <T extends FieldType>(fieldID: FieldID) =>
				this.getField<T>(fieldID)?.settings
		},
		getReactiveSettings() {
			return <T extends FieldType>(
				fieldID: FieldID,
				defaultValue: FieldSettings[T],
			): FieldSettings[T] => {
				const field = this.getField<T>(fieldID)
				return reactive(field?.settings ?? defaultValue) as FieldSettings[T]
			}
		},
	},
	actions: {
		setName(fieldID: FieldID, name: string): void {
			const field = this.getField(fieldID)
			if (field) field.name = name
		},
		setValue<T extends FieldType>(
			fieldID: FieldID,
			value: FieldData<T>['value'],
		) {
			const field = this.getField<T>(fieldID)
			if (field) field.value = value
		},
		setSettings<T extends FieldType>(
			fieldID: FieldID,
			settings: FieldData<T>['settings'],
		) {
			const field = this.getField<T>(fieldID)
			if (field) field.settings = settings
		},
		setContent(content: APIDocumentContent): FieldsList {
			let fields = parseAPIContentToFields(content)
			if (!Array.isArray(fields)) fields = []
			else fields = getMergedNeighborNotes(fields)
			return (this.fields = fields)
		},
		addField(newField: AnyFieldData) {
			this.fields.push(newField)
		},
		removeField(fieldID: FieldID) {
			removeFromArray(this.fields, field => field.id === fieldID)
		},
		mergeNeighborNotes(): void {
			this.fields = getMergedNeighborNotes(this.fields)
		},
	},
})
export default useContent

function getMergedNeighborNotes(list: readonly AnyFieldData[]): FieldsList {
	const listCopy = copyArray(list)

	let prev: AnyFieldData | undefined
	list.forEach(field => {
		if (prev?.type === field.type && field.type === 'note') {
			const prevCopy = copyObject(prev)
			// @ts-ignore
			prevCopy.value += field.value
			listCopy.splice(listCopy.indexOf(prev), 2, prevCopy)
			prev = prevCopy
		} else {
			prev = field
		}
	})
	return listCopy
}
