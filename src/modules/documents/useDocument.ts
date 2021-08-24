import { DeepReadonly, readonly, watchEffect } from 'vue'
import { getItemDetails } from '../apiSimulator'
import { FieldEntry, FieldType } from '../fields/field'
import FieldController, { FieldGeneral } from '../fields/FieldMeta'

export interface DocumentMeta {
	id: string
	title: string
	description: string
	thumbnail?: string
}

type DocumentContent = Array<string | FieldGeneral>

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
		return {
			id,
			meta: {
				id,
				title: res.title,
				thumbnail: res.thumbnail,
				description: res.description,
			},
			content: [],
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

		let success: boolean
		try {
			const state = await getDocumentDetails(id)
			this.instance.setState(state)
			success = true
		} catch (error) {
			console.log(error)
			success = false
		}

		this.fetching.value = false
		this.exists.value = success
		return success
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

	content = computed<DocumentContent>(() => {
		return []
	})

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

// const exampleContent = [
// 	"<p>To jest zwykły text</p>",
// 	{
// 		id: "F83hRsYv90",
// 		type: "text",
// 		name: "Tytuł książki",
// 		settings: {
// 			required: true,
// 			multiline: true,
// 			rich: false
// 		},
// 		value: 'Harry Potter\nI kamień filozoficzny'
// 	},
// 	`<p>Text może być <b>dowolnie formtowany</b></p><br/>
// 	<h3>I rozciągać się na kilka linii</h3>`,
// 	{
// 		id: "3v3Ux43DF4g",
// 		type: "number",
// 		name: "Ilość kartek",
// 		settings: {
// 			required: false,
// 			min: 0,
// 			max: 1000
// 		},
// 		value: 562
// 	}
// ]
