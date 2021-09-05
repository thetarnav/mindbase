import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Field from '@/modules/fields/components/Field.vue'

export default Node.create({
	name: 'field',
	group: 'block',
	draggable: true,
	atom: true,
	addAttributes: () => ({
		id: {
			default: '',
		},
		type: {
			default: '',
		},
	}),
	parseHTML: () => [
		{
			tag: 'field',
		},
	],
	renderHTML({ HTMLAttributes }) {
		return ['field', mergeAttributes(HTMLAttributes)]
	},
	addNodeView() {
		return VueNodeViewRenderer(Field)
	},
})
