import { Decoration, DecorationSet } from 'prosemirror-view'
import { Node } from 'prosemirror-model'
import { email as rgx } from '@/utils/regex'

export default function (doc: Node): DecorationSet {
	const decorations: Decoration[] = []

	doc.descendants((node, position) => {
		if (!node.text) return

		Array.from(node.text.matchAll(rgx)).forEach(match => {
			const email = match[0]
			const index = match.index || 0
			const from = position + index
			const to = from + email.length
			const decoration = Decoration.inline(from, to, {
				class: 'email',
			})

			decorations.push(decoration)
		})
	})

	return DecorationSet.create(doc, decorations)
}
