import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { Indent } from './tabIndent'
import FieldNode from '@/modules/tiptap/FieldNode'
import RequiredNodes from './RequiredNodes'

export const editorExtensions = [
	StarterKit.configure({
		heading: {
			levels: [1, 2, 3],
		},
	}),
	Typography,
	Indent,
	FieldNode,
	RequiredNodes,
]
