import { parseAPIContentToFields } from '@/modules/api/content'
import { defineStore } from 'pinia'

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
			return (this.fields = fields)
		},
	},
})
export default useContent
