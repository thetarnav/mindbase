import { DeepReadonly, reactive, readonly, ToRefs, toRefs } from 'vue'
import FieldMeta from '../fields/FieldMeta'

interface DocumentData {
	id: string
	title: string
	description: string
	thumbnail?: string
}
type DocumentState = {
	meta: DocumentData | null
	fields: Record<string, FieldMeta> | null
}

export default class DOCUMENT {
	private static _instance: DOCUMENT
	private readonly _state: DocumentState

	private constructor() {
		this._state = reactive({
			meta: null,
			fields: null,
		})
	}
	static get instance(): DOCUMENT {
		return DOCUMENT._instance ?? new DOCUMENT()
	}
	mutate<K extends keyof DocumentState>(key: K, val: DocumentState[K]): void {
		this._state[key] = val
	}
	get state(): DeepReadonly<DocumentState> {
		return readonly(this._state)
	}
	get refs(): ToRefs<DeepReadonly<DocumentState>> {
		return toRefs(this.state)
	}

	setState(state: DocumentData): DOCUMENT {
		Object.assign(this._state, state)
		return this
	}
	clearState(): DOCUMENT {
		return this
	}
}
