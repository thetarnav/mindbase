import { nanoid } from 'nanoid'

export const parseAPIContentToFields = (
	content: APIDocumentContent,
): FieldsList =>
	content.map(item =>
		typeof item === 'string'
			? {
					id: nanoid(),
					type: 'note',
					name: '',
					settings: {},
					value: item,
			  }
			: item,
	)
