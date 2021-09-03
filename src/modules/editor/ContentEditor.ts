import { DocumentRawContent } from '@/types/api'
import { Content, Editor } from '@tiptap/vue-3'
import { FieldControllerMap } from '../fields/FieldController'
import { editorExtensions } from '../tiptap/editorExtensions'
import { getHTMLFromRawContent } from '../documents/parseContent'
import { createFieldController } from '../fields/fieldFactory'

const createEditor = (content: Content): Editor =>
	new Editor({
		content,
		editable: true,
		extensions: editorExtensions,
		onUpdate({ editor }) {
			// emit('update:modelValue', editor.getHTML())
		},
		onFocus() {
			// editorFocus()
			// emit('focus')
		},
		onBlur({ transaction }) {
			// editorClickAway()
			// emit('blur', transaction.doc.textContent)
		},
	})

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
	editor: Editor,
	controllers: FieldControllerMap,
): ContentEditor
function createContentEditor(
	a: Editor | Content | DocumentRawContent,
	b?: FieldControllerMap,
): ContentEditor {
	// a: Editor, b: FieldControllerMap
	if (a instanceof Editor) {
		return new ContentEditor(a, b ?? {})
	}
	// a: DocumentRawContent
	if (Array.isArray(a) && b === undefined) {
		const content = a as DocumentRawContent
		const html = getHTMLFromRawContent(content)
		const editor = createEditor(html)
		const controllers = getFieldControllersFromRawContent(content)
		return new ContentEditor(editor, controllers)
	}
	// a: Content, b: FieldControllerMap
	const content = a as Content
	const editor = createEditor(content)
	return new ContentEditor(editor, b ?? {})
}

export default createContentEditor

export class ContentEditor {
	constructor(
		public readonly editor: Editor | undefined,
		public readonly fieldControllers: FieldControllerMap,
	) {}

	test(): void {
		console.log(this.editor?.getHTML)
	}
}
