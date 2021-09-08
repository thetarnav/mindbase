import { fetchDocumentData } from '@/modules/apiSimulator'
import { defineStore } from 'pinia'
import useContent from './content'

const useDocument = defineStore('document', {
	state: () => ({
		fetchState: <'pending' | 'success' | 'failure' | null>null,
		mata: <DocumentMeta | null>null,
	}),
	getters: {
		title(state): string {
			return state.mata?.title ?? ''
		},
		description(state): string {
			return state.mata?.description ?? ''
		},
	},
	actions: {
		setTitle(v: string) {
			if (typeof v === 'string' && this.mata) this.mata.title = v
		},
		setDescription(v: string) {
			if (typeof v === 'string' && this.mata) this.mata.description = v
		},
		async fetch(docID: DocumentID): Promise<boolean> {
			this.fetchState = 'pending'

			try {
				const data = await fetchDocumentData(docID)

				// set own state
				this.fetchState = 'success'
				this.mata = data

				// set content in the content store
				const content = useContent()
				content.setContent(data.content)
			} catch (error) {
				console.log(error)
				this.fetchState = 'failure'
			}

			return this.fetchState === 'success'
		},
		clear(): void {
			// clear own state
			this.mata = null
			if (this.fetchState !== 'pending') this.fetchState = null

			// clear content
			const content = useContent()
			content.$reset()
		},
	},
})
export default useDocument
