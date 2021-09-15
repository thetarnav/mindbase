import { parseAPIContentToFields } from '@/modules/api/content'
import {
	arraySplit,
	removeFromArray,
	removeFromArrayCopy,
	reorderArray,
	reorderArrayCopy,
} from '@/utils/functions'
import { copyArray, copyObject } from '@/utils/fp'
import { defineStore } from 'pinia'
import { getNewFieldData } from '@/modules/fields/fieldFactory'
import { generateJSON } from '@tiptap/vue-3'
import {
	generateNoteHTML,
	generateNoteJSON,
} from '@/modules/fields/fields/note/contentNoteSetup'
import { chunk } from 'lodash'

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
		getFieldIndex: state => (fieldID: FieldID) =>
			state.fields.findIndex(({ id }) => id === fieldID),
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
			return removeFromArray(this.fields, field => field.id === fieldID)
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
			const field = this.removeField(fieldID)
			const noteIndex = this.getFieldIndex(noteID)
			const note = this.getField<'note'>(noteID)
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
			this.fields.splice(noteIndex, 1, noteAbove, field, noteBelow)
			// merge neighboring notes
			this.mergeNeighborNotes()
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

function removeLastEmptyP(string: string): string {
	const rgx = new RegExp(
		/(<p[^>]*>(<br[/\\]?>)*<\/p>)(?!.*(<p[^>]*>(<br[/\\]?>)*<\/p>))/gi,
	)

	console.log(rgx.lastIndex)

	console.log(rgx.lastIndex)

	return string
}
