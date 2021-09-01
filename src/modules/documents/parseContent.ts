import { DocumentRawContent } from '@/types/api'
import { generateHTML, JSONContent } from '@tiptap/vue-3'
import { AnyFieldController } from '../fields/FieldController'
import { editorExtensions } from '../tiptap/editorExtensions'

export const parseHTML = (doc: JSONContent): string =>
	generateHTML(doc, editorExtensions)

/**
 * @param input Raw Document content from the API
 * @returns HTML ready to be used by the tiptap editor
 */
export const getHTMLFromRawContent = (input: DocumentRawContent): string =>
	input
		.map(item =>
			typeof item === 'string'
				? item
				: `<field id="${item.id}" type="${item.type}"></field>`,
		)
		.join('')

/**
 * @param input Editor JSON output | JSON Content
 * @param controllers Map of documents field controllers
 * @returns Raw Document Content for API
 */
export const getRawContentFromHTML = (
	input: JSONContent | JSONContent[],
	controllers: Record<string, AnyFieldController>,
): DocumentRawContent => {
	const list: JSONContent[] = Array.isArray(input)
		? input
		: input.content ?? []
	const result: DocumentRawContent = []
	list.forEach(node => {
		if (node.type !== 'field') result.push(parseHTML(node))
		else {
			const { id } = node.attrs || {},
				controller = controllers[id]
			if (!controller) return
			result.push(controller.getData())
		}
	})
	return result
}
