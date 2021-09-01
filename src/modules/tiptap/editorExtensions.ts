import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import { Indent } from './tabIndent'
import VueComponent from '@/modules/tiptap/testVueExtension'

export const editorExtensions = [
	StarterKit.configure({
		heading: {
			levels: [1, 2, 3],
		},
	}),
	Typography,
	Indent,
	VueComponent,
]
