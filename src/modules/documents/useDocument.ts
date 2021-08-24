import { DeepReadonly, readonly, watchEffect } from 'vue'
import { getItemDetails } from '../apiSimulator'
import { FieldEntry, FieldType } from '../fields/field'
import { createField } from '../fields/fieldFactory'
import { AnyFieldController } from '../fields/FieldController'

export interface DocumentMeta {
	id: string
	title: string
	description: string
	thumbnail?: string
}

type DocumentContent = Array<string | AnyFieldController>

interface StateDocExists {
	id: string
	meta: DocumentMeta
	content: DocumentContent
}
interface StateDocNotExists {
	id: null
	meta: null
	content: null
}
type State = StateDocExists | StateDocNotExists

async function getDocumentDetails(id: string): Promise<StateDocExists> {
	try {
		const res = await getItemDetails(id)
		const content = res.fields.map(f =>
			createField(f.type, f.id, f.title, f.settings, f.value),
		)

		return {
			id,
			meta: {
				id,
				title: res.title,
				thumbnail: res.thumbnail,
				description: res.description,
			},
			content,
		}
	} catch (error) {
		return Promise.reject('Get Document Failed: ' + error)
	}
}

const getClearState = (): State => ({
	id: null,
	meta: null,
	content: null,
})

export default class DOCUMENT {
	private static _instance: DOCUMENT
	static fetching = ref(false)
	static exists = ref(false)

	private readonly _state: State
	readonly state: DeepReadonly<State>

	private constructor() {
		this._state = reactive<State>(getClearState())
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
			const state = await getDocumentDetails(id)
			this.instance.setState(state)
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
		this.instance.setState(getClearState())
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

	private setState(newState: Partial<DeepReadonly<State>>): void {
		Object.assign(this._state, newState)
	}

	title = computed<string>({
		set: v => {
			const { meta } = this._state
			if (!meta || meta.title === v) return
			console.log('set Title:', v)
			meta.title = v
		},
		get: () => this._state.meta?.title ?? '',
	})

	description = computed<string>({
		set: v => {
			const { meta } = this._state
			if (!meta || meta.description === v) return
			console.log('set Description:', v)
			meta.description = v
		},
		get: () => this._state.meta?.description ?? '',
	})

	content = computed<DocumentContent>(() => this._state.content ?? [])

	addField(type: FieldType): void {
		console.log('addField', type)
	}
	removeField(field: FieldEntry): void {
		console.log('addField', field)
	}
}

watchEffect(() => {
	DOCUMENT.instance.title.value
	DOCUMENT.instance.description.value
})
