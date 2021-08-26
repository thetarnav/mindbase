import { DeepReadonly, readonly, watchEffect } from 'vue'
import { getItemDetails } from '../apiSimulator'
import { FieldType } from '../fields/types'
import { createFieldController } from '../fields/fieldFactory'
import { AnyFieldController } from '../fields/FieldController'

export interface DocumentMeta {
	id: string
	title: string
	description: string
	thumbnail?: string
}

interface ContentMeta {
	id: string
	type: FieldType
}

interface ReactiveDocState {
	meta: DocumentMeta | null
	fields: ContentMeta[]
}

type NonNullDocState = OmitNullable<ReactiveDocState>

interface DocumentDetails extends NonNullDocState {
	controllers: Record<string, AnyFieldController>
}

async function getDocumentDetails(id: string): Promise<DocumentDetails> {
	try {
		const res = await getItemDetails(id)
		const contentList = res.fields.map(i => ({
			id: i.id,
			type: i.type,
		}))
		const controllers: Record<string, AnyFieldController> = {}

		res.fields.forEach(i => {
			controllers[i.id] = createFieldController(
				i.type,
				i.id,
				i.name,
				i.settings,
				i.value,
			)
		})

		return {
			meta: {
				id,
				title: res.title,
				thumbnail: res.thumbnail,
				description: res.description,
			},
			fields: contentList,
			controllers,
		}
	} catch (error) {
		return Promise.reject('Get Document Failed: ' + error)
	}
}

const getClearState = (): ReactiveDocState => ({
	meta: null,
	fields: [],
})

export default class DOCUMENT {
	private static _instance: DOCUMENT
	static fetching = ref(false)
	static exists = ref(false)

	private readonly _state: ReactiveDocState
	private _controllers: Record<string, AnyFieldController>
	readonly state: DeepReadonly<ReactiveDocState>

	private constructor() {
		this._state = reactive<ReactiveDocState>(getClearState())
		this.state = readonly(this._state)
		this._controllers = {}
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
			this.instance.setControllers(state.controllers)
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
		this.instance.setControllers(null)
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

	private setControllers(
		controllers: Record<string, AnyFieldController> | null,
	): void {
		this._controllers = controllers ?? {}
	}

	getController(id: string): AnyFieldController | null {
		return this._controllers[id] || null
	}

	fields = computed<ContentMeta[]>(() => this._state.fields)

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

	// content = computed<DocumentContent>(() => this._state.content ?? [])

	addField(type: FieldType): void {
		console.log('addField', type)
	}
	removeField(id: string): void {
		console.log('remove field', id)
	}
}

watchEffect(() => {
	DOCUMENT.instance.title.value
	DOCUMENT.instance.description.value
})
