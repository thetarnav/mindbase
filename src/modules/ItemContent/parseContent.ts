import { DocumentRawContent } from '@/types/api'
import { nanoid } from 'nanoid'
import { AnyFieldController } from '../fields/FieldController'
import { createFieldController } from '../fields/fieldFactory'
import { FieldsList } from './types'

declare global {
	interface Array<T> {
		at(i: number): T
	}
}

const correctContent = (content: DocumentRawContent): DocumentRawContent => {
	const correct: DocumentRawContent = []
	content.forEach((item, i) => {
		// Is TEXT
		if (typeof item === 'string') {
			if (typeof correct.at(-1) === 'string')
				correct.splice(-1, 1, correct.at(-1) + item)
			else correct.push(item)
		}
		// Is FIELD
		else {
			if (typeof correct.at(-1) === 'string') correct.push(item)
			else correct.push('', item)
		}
	})
	return correct
}

export const getFieldsFromRawContent = (
	content: DocumentRawContent,
): {
	fields: FieldsList
	controllers: Record<string, AnyFieldController>
} => {
	content = correctContent(content)
	const fields: FieldsList = []
	const controllers: Record<string, AnyFieldController> = {}

	content.forEach(item => {
		if (typeof item === 'string') {
			const id = nanoid()
			fields.push({
				id,
				type: 'note',
			})
			controllers[id] = createFieldController('note', id)
		} else {
			fields.push({
				id: item.id,
				type: item.type,
			})
			controllers[item.id] = createFieldController(
				item.type,
				item.id,
				item.name,
				item.settings,
				item.value,
			)
		}
	})
	return {
		fields,
		controllers,
	}
}
