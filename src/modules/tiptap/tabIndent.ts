import { Command, Extension } from '@tiptap/core'
import { TextSelection, AllSelection, Transaction } from 'prosemirror-state'
import { isListNode } from './utils'

type IndentOptions = {
	types: string[]
	indentLevels: number
	defaultIndentLevel: number
}

declare module '@tiptap/core' {
	interface Commands {
		indent: {
			/**
			 * Increase the data-indent attribute
			 */
			indent: () => Command
			/**
			 * Decrease the data-indent attribute
			 */
			outdent: (backspace?: boolean) => Command
		}
	}
}

function setNodeIndentMarkup(
	tr: Transaction,
	pos: number,
	delta: number,
	options: IndentOptions,
): Transaction {
	if (!tr.doc) return tr

	const node = tr.doc.nodeAt(pos)
	if (!node) return tr

	const maxIndent = options.indentLevels
	const indent = Math.min((node.attrs.indent || 0) + delta, maxIndent)

	if (indent === node.attrs.indent) return tr

	const nodeAttrs = {
		...node.attrs,
		indent,
	}

	return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
}

function updateIndentLevel(
	tr: Transaction,
	delta: number,
	options: IndentOptions,
): Transaction {
	const { doc, selection } = tr

	if (!doc || !selection) return tr

	if (
		!(selection instanceof TextSelection || selection instanceof AllSelection)
	)
		return tr

	const { from, to } = selection

	doc.nodesBetween(from, to, (node, pos) => {
		const nodeType = node.type

		if (nodeType.name === 'paragraph' || nodeType.name === 'heading') {
			tr = setNodeIndentMarkup(tr, pos, delta, options)
			return false
		}
		if (isListNode(node)) {
			return false
		}
		return true
	})

	return tr
}

export const Indent = Extension.create<IndentOptions>({
	name: 'indent',

	defaultOptions: {
		types: ['heading', 'paragraph'],
		indentLevels: 7,
		defaultIndentLevel: 0,
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					indent: {
						default: this.options.defaultIndentLevel,
						renderHTML: attributes => ({
							'data-indent': attributes.indent,
						}),
						parseHTML: element => {
							const indent = element.getAttribute('data-indent')
							return indent
								? parseInt(indent)
								: this.options.defaultIndentLevel
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			indent:
				() =>
				({ tr, state, dispatch }) => {
					const { selection } = state
					tr = tr.setSelection(selection)
					tr = updateIndentLevel(tr, 1, this.options)

					if (tr.docChanged) {
						// eslint-disable-next-line no-unused-expressions
						dispatch && dispatch(tr)
						return true
					}

					return false
				},
			outdent:
				(backspace = false) =>
				({ tr, state, dispatch }) => {
					const { selection } = state

					if (
						backspace &&
						(selection.$anchor.parentOffset > 0 ||
							selection.from !== selection.to)
					)
						return false

					tr = tr.setSelection(selection)
					tr = updateIndentLevel(tr, -1, this.options)

					if (tr.docChanged) {
						dispatch && dispatch(tr)
						return true
					}

					return false
				},
		}
	},

	addKeyboardShortcuts() {
		return {
			Tab: ({ editor }) => !!editor.commands.indent(),
			'Shift-Tab': ({ editor }) => !!editor.commands.outdent(),
			Backspace: ({ editor }) => !!editor.commands.outdent(true),
		}
	},
})
