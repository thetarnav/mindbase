import { parseAPIContentToFields } from '@/modules/api/content'
import {
	arraySplit,
	removeFromArray,
	reorderArray,
	removeFromArrayCopy,
} from '@/utils/functions'
import { copyArray, copyObject } from '@/utils/fp'
import { defineStore } from 'pinia'
import { getNewFieldData } from '@/modules/fields/fieldFactory'
import {
	generateNoteHTML,
	generateNoteJSON,
} from '@/modules/fields/fields/note/contentNoteSetup'

/**
 * Manages state of the currently viewed document's content.
 */
const useContent = defineStore('content', {
	state: () => ({
		fields: <FieldsList>[],
	}),
	getters: {
		getField(state) {
			return <T extends FieldType>(fieldID: FieldID) =>
				getField<T>(state.fields, fieldID)
		},
		getFieldIndex: state => (fieldID: FieldID) =>
			fieldIndex(state.fields, fieldID),
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
		removeField(fieldID: FieldID): AnyFieldData | undefined {
			const { fields, field } = removeField(this.fields, fieldID)
			this.fields = fields
			return field
		},
		mergeNeighborNotes(): void {
			this.fields = getMergedNeighborNotes(this.fields)
		},
		reorderField(
			fieldID: FieldID,
			dropFieldID: FieldID,
			side: 'above' | 'below',
		): void {
			const from = this.getFieldIndex(fieldID)
			let to = this.getFieldIndex(dropFieldID)
			if (from === -1 || to === -1) return
			side === 'below' && to++
			reorderArray(this.fields, from, to)
			this.mergeNeighborNotes()
		},
		moveFieldIntoNote(fieldID: FieldID, noteID: FieldID, splitIndex: number) {
			// make a copy of fields list & remove dragged field
			const { fields, field } = removeField(this.fields, fieldID)
			const note = getField<'note'>(fields, noteID)
			if (!field || !note) return

			// get json content of the drop target note & split it in two
			const noteContent = generateNoteJSON(note.value).content ?? [],
				contentSplit = arraySplit(noteContent, splitIndex)
			// create two note fields
			const noteAbove = getNewFieldData(
				'note',
				generateNoteHTML(contentSplit[0]),
			)
			const noteBelow = getNewFieldData(
				'note',
				generateNoteHTML(contentSplit[1]),
			)

			// swap old note with new ones and dragged field in the middle
			replaceField(fields, noteID, noteAbove, field, noteBelow)
			// merge neighboring notes
			this.fields = getMergedNeighborNotes(fields)
		},
	},
})
export default useContent

function getField<T extends FieldType>(
	fields: AnyFieldData[],
	fieldID: FieldID,
): FieldData<T> | undefined
function getField<T extends FieldType>(
	fields: AnyFieldData[],
	index: number,
): FieldData<T> | undefined
function getField<T extends FieldType>(
	fields: AnyFieldData[],
	key: FieldID | number,
): FieldData<T> | undefined {
	const field =
		typeof key === 'number'
			? fields[key]
			: fields.find(field => field.id === key)
	return field as FieldData<T> | undefined
}

const removeField = <T extends FieldType>(
	fields: readonly AnyFieldData[],
	fieldID: FieldID,
): { field: FieldData<T> | undefined; fields: FieldsList } => {
	const result = removeFromArrayCopy(fields, f => f.id === fieldID)
	return {
		fields: result.array,
		field: result.deleted as FieldData<T> | undefined,
	}
}

const fieldIndex = (
	fields: readonly AnyFieldData[],
	fieldID: FieldID,
): number => fields.findIndex(f => f.id === fieldID)

/** Modifies the fields! */
const replaceField = (
	fields: FieldsList,
	replacing: FieldID,
	...newFields: FieldsList
): void => {
	const index = fieldIndex(fields, replacing)
	fields.splice(index, 1, ...newFields)
}

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
