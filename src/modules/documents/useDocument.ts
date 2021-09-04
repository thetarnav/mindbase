import { DeepReadonly, readonly, UnwrapRef, watchEffect } from 'vue'
import { getItemDetails } from '../apiSimulator'
import { FieldType } from '../fields/types'
import {
	createFieldController,
	createNewFieldController,
} from '../fields/fieldFactory'
import { AnyFieldController } from '../fields/FieldController'
import { debounce } from 'lodash'
import { DocumentMeta, DocumentRawContent } from '@/types/api'
import { getHTMLFromRawContent } from './parseContent'
import createContentEditor, { ContentEditor } from '../editor/ContentEditor'
import { Editor } from '@tiptap/vue-3'

interface ContentMeta {
	id: string
	type: FieldType
}

interface ReactiveDocState {
	meta: DocumentMeta | null
	content: DocumentRawContent
}

type DocumentDetails = OmitNullable<ReactiveDocState>
// editor: ContentEditor | null

type Change = 'title' | 'description' | 'content' | string // id of the modified field's controller

async function getDocumentDetails(id: string): Promise<DocumentDetails> {
	try {
		const res = await getItemDetails(id)
		return {
			meta: {
				id,
				title: res.title,
				thumbnail: res.thumbnail,
				description: res.description,
			},
			content: res.content,
		}
	} catch (error) {
		return Promise.reject('Get Document Failed: ' + error)
	}
}

const getClearState = (): ReactiveDocState => ({
	meta: null,
	content: [],
})

const emitChanges = async (docID: string, changes: Set<Change>) => {
	console.log('DOCUMENT', docID, 'changed')

	if (changes.has('content')) {
		// emits every field
	} else {
		// emits only modified fields
	}

	if (changes.has('title')) {
		// emits new title
	}
	if (changes.has('description')) {
		// emits new description
	}
}

export default class DOCUMENT {
	private static _instance: DOCUMENT
	static fetching = ref(false)
	static exists = ref(false)

	private readonly _state: ReactiveDocState
	readonly state: DeepReadonly<ReactiveDocState>
	private _editorController: ContentEditor | null = null
	private changes: Set<Change> = new Set()

	private constructor() {
		this._state = reactive(getClearState()) as ReactiveDocState
		this.state = readonly(this._state)
	}
	static get instance(): DOCUMENT {
		if (!DOCUMENT._instance) DOCUMENT._instance = new DOCUMENT()
		return DOCUMENT._instance
	}

	static async fetch(id: string): Promise<boolean> {
		this.exists.value = false
		this.fetching.value = true

		let succeeded: boolean
		try {
			const details = await getDocumentDetails(id)
			this.instance.setState(details)
			this.instance.createEditor(details.content)
			succeeded = true
		} catch (error) {
			console.log(error)
			succeeded = false
		}

		this.fetching.value = false
		this.exists.value = succeeded
		return succeeded
	}
	static clear(): void {
		this.instance.clearState()
		this.exists.value = false

		// clear again if called during fetching
		// so that the fetched state will be cleared immediately
		if (this.fetching.value) {
			const stop = watch(this.fetching, () => {
				this.clear()
				stop()
			})
			return
		}
		this.fetching.value = false
	}

	private setState(newState: Partial<DeepReadonly<ReactiveDocState>>): void {
		Object.assign(this._state, newState)
	}
	private clearState(): void {
		Object.assign(this._state, getClearState())
	}

	createEditor(content: DocumentRawContent): ContentEditor | null {
		this._editorController = createContentEditor(content)
		return this._editorController
	}

	getController(id: string): AnyFieldController | null {
		return null
	}
	get contentEditor(): ContentEditor | null {
		return this._editorController
	}

	title = computed<string>({
		set: v => {
			const { meta } = this._state
			if (!meta || meta.title === v) return
			console.log('set Title:', v)
			meta.title = v
			this.addChange('title')
		},
		get: () => this._state.meta?.title ?? '',
	})

	description = computed<string>({
		set: v => {
			const { meta } = this._state
			if (!meta || meta.description === v) return
			console.log('set Description:', v)
			meta.description = v
			this.addChange('descriprion')
		},
		get: () => this._state.meta?.description ?? '',
	})

	addField(this: DOCUMENT, type: FieldType): void {
		console.log('add field', type)
		// const controller = createNewFieldController(type)
		// const id = controller.id

		// this._state.content.push({
		// 	id,
		// 	type,
		// })
		// this._controllers[id] = controller
		// this.addChange('content')
	}

	removeField(this: DOCUMENT, id: string): void {
		console.log('remove field', id)
		// delete this._controllers[id]
		// removeFromArray(this._state.content, f => f.id === id)
		// this.addChange('content')
	}

	fieldChanged(controller: AnyFieldController): void {
		this.addChange(controller.id)
	}

	fieldsReorder(newOrder: ContentMeta[]): void {
		// fieldsReorder(from: number, to: number): void {
		// this._state.content = newOrder
		// reorderArray(this._state.fields, from, to)
		// TODO: figure out a way to emit reorder change without touching the `this._state.fields` as it's reactive and sucks
		// console.table(this._state.content)
		// this.addChange('content')
	}

	private addChange(change: Change) {
		this.changes.add(change)
		this.emitChanges()
	}

	private emitChanges = debounce(
		() => {
			// this._state.id && emitChanges(this._state.id, this.changes)
			// this.changes.clear()
		},
		4000,
		{ maxWait: 10000 },
	)
}

watchEffect(() => {
	DOCUMENT.instance.title.value
	DOCUMENT.instance.description.value
})
