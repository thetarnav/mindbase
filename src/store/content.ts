import { parseAPIContentToFields } from '@/modules/api/content'
import { defineStore } from 'pinia'

const useContent = defineStore('content', {
	state: () => ({
		content: <FieldsList>[],
	}),
	actions: {
		setContent(content: APIDocumentContent): FieldsList {
			let fields = parseAPIContentToFields(content)
			if (!Array.isArray(fields)) fields = []
			return (this.content = fields)
		},
		clearContent(): void {
			this.content = []
		},
	},
})
export default useContent
