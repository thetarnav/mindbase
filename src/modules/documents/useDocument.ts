import { DeepReadonly, readonly } from 'vue'
import { getItemDetails } from '../apiSimulator'
import { FieldEntry, FieldType } from '../fields/field'
import Field, { FieldGeneral } from '../fields/FieldMeta'

export interface DocumentMeta {
	id: string
	title: string
	description: string
	thumbnail?: string
}

type DocumentContent = Array<string | FieldGeneral>

interface DocumentDetails extends DocumentMeta {
	content: DocumentContent
}

type State =
	| {
			exists: true
			id: string
			document: DocumentDetails
	  }
	| {
			exists: false
			id: null
			document: null
	  }

async function getDocumentDetails(id: string): Promise<DocumentDetails | null> {
	const res = await getItemDetails(id)
	if (!res) return null

	return {
		id: res.id,
		title: res.title,
		thumbnail: res.thumbnail,
		description: res.description,
		content: [],
	}
}

const initialState: State = { exists: false, id: null, document: null }

export default class DOCUMENT {
	private static _instance: DOCUMENT
	static fetching = ref(false)

	private readonly _state: State

	private constructor() {
		this._state = reactive(initialState)
	}
	static get instance(): DOCUMENT {
		return DOCUMENT._instance ?? new DOCUMENT()
	}

	static async fetch(id: string): Promise<boolean> {
		this.fetching.value = true
		const details = await getDocumentDetails(id)
		this.fetching.value = false
		details &&
			Object.assign(this.instance._state, {
				exists: true,
				id: details.id,
				document: details,
			})
		return Boolean(details)
	}
	static clear(): void {
		Object.assign(this.instance._state, initialState)
	}

	get state(): DeepReadonly<State> {
		return readonly(this._state)
	}

	title = computed<string>({
		set: v => {
			const { document } = this._state
			if (!document || document.title === v) return
			console.log('set Title:', v)
			document.title = v
		},
		get: () => this._state.document?.title ?? '',
	})

	description = computed<string>({
		set: v => {
			const { document } = this._state
			if (!document || document.description === v) return
			console.log('set Description:', v)
			document.description = v
		},
		get: () => this._state.document?.description ?? '',
	})

	addField(type: FieldType): void {
		console.log('addField', type)
	}
	removeField(field: FieldEntry): void {
		console.log('addField', field)
	}
}

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
