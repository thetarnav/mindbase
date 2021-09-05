import { DocumentRawContent } from '@/types/api'
import { Content, Editor, EditorOptions } from '@tiptap/vue-3'
import { AnyFieldController, FieldControllerMap } from '../fields/FieldController'
import { editorExtensions } from '../tiptap/editorExtensions'
import { getHTMLFromRawContent } from '../documents/parseContent'
import { createFieldController } from '../fields/fieldFactory'

const getFieldControllersFromRawContent = (
	content: DocumentRawContent,
): FieldControllerMap => {
	const controllers: FieldControllerMap = {}
	content.forEach(i => {
		if (typeof i !== 'string')
			controllers[i.id] = createFieldController(
				i.type,
				i.id,
				i.name,
				i.settings,
				i.value,
			)
	})
	return controllers
}

function createContentEditor(content: DocumentRawContent): ContentEditor
function createContentEditor(
	content: Content,
	controllers: FieldControllerMap,
): ContentEditor
function createContentEditor(
	a: Content | DocumentRawContent,
	b?: FieldControllerMap,
): ContentEditor {
	// a: DocumentRawContent
	if (Array.isArray(a) && b === undefined) {
		const content = a as DocumentRawContent
		const html = getHTMLFromRawContent(content)
		const controllers = getFieldControllersFromRawContent(content)
		return new ContentEditor(html, controllers)
	}
	// a: Content, b: FieldControllerMap
	const content = a as Content
	return new ContentEditor(content, b ?? {})
}

const getEditorOptions = (content: Content): Partial<EditorOptions> => ({
	content,
	editable: true,
	extensions: editorExtensions,
})

export default createContentEditor

export class ContentEditor extends Editor {
	constructor(content: Content, private fieldControllers: FieldControllerMap) {
		super(getEditorOptions(content))
	}

	getFieldController(
		this: ContentEditor,
		fieldID: string,
	): AnyFieldController | undefined {
		return this.fieldControllers[fieldID]
	}
}
