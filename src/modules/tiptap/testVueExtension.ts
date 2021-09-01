import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Field from '@/modules/fields/components/TestField.vue'

export default Node.create({
	name: 'field',

	group: 'block',

	atom: true,

	addAttributes() {
		return {
			count: {
				default: 0,
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'field',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['field', mergeAttributes(HTMLAttributes)]
	},

	addNodeView() {
		return VueNodeViewRenderer(Field)
	},
})
