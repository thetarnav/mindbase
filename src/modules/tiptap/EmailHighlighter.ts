import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import findEmails from './findEmails'

export default Extension.create({
	name: 'emailHighlighter',

	addProseMirrorPlugins() {
		return [
			new Plugin({
				state: {
					init(_, { doc }) {
						return findEmails(doc)
					},
					apply(transaction, oldState) {
						return transaction.docChanged
							? findEmails(transaction.doc)
							: oldState
					},
				},
				props: {
					decorations(state) {
						return this.getState(state)
					},
				},
			}),
		]
	},
})
