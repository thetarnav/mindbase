import { Extension } from '@tiptap/vue-3'
import { isEqual } from 'lodash'
import { Fragment } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

function requiredNodes(node: Fragment<any>): string[] {
	const requiredNodes: string[] = []
	node.descendants(child => {
		child.type.name === 'field' && requiredNodes.push(child.attrs.id)
	})
	return requiredNodes
}

const plugin = new Plugin({
	key: new PluginKey('eventHandler'),
	filterTransaction: (transaction, state) => {
		// Avoid endless recursion when simulating the effects of the transaction
		if (transaction.getMeta('filteringRequiredNodeDeletion') === true) return true
		transaction.setMeta('filteringRequiredNodeDeletion', true)

		// Simulate the transaction
		const newState = state.apply(transaction)

		// Check that the same required nodes are still present in any order
		return isEqual(
			requiredNodes(state.doc.content).sort(),
			requiredNodes(newState.doc.content).sort(),
		)
	},
})

const RequiredNodes = Extension.create({
	addProseMirrorPlugins() {
		return [plugin]
	},
})

export default RequiredNodes
