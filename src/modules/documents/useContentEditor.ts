import { JSONContent, useEditor } from '@tiptap/vue-3'
// import { generateHTML } from '@tiptap/core'
import { editorExtensions } from '../tiptap/editorExtensions'

/*
const json = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Text',
        },
      ],
    },
  ],
}
*/

export default function useContentEditor(content: JSONContent[]) {
	const editor = useEditor({
		content: {
			type: 'doc',
			content,
		},
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

	return {
		editor,
	}
}
