<script lang="ts">
export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import { Indent } from '@/modules/tiptap/tabIndent'
import RichTextFixedMenu from './RichTextFixedMenu.vue'

const props = defineProps({
	modelValue: { type: String, required: true },
	disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
	(e: 'focus'): void
	(e: 'blur', textContent: string): void
}>()

const editor = useEditor({
	content: props.modelValue,
	editable: !props.disabled,
	extensions: [
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		Typography,
		Document,
		Paragraph,
		Indent,
	],
	onUpdate({ editor }) {
		emit('update:modelValue', editor.getHTML())
	},
	onFocus() {
		editorFocus()
		emit('focus')
	},
	onBlur({ transaction }) {
		editorClickAway()
		emit('blur', transaction.doc.textContent)
	},
})

watch(
	() => props.disabled,
	() => editor.value?.setEditable(!props.disabled),
)

const editorFocused = ref(false),
	fixedMenuFocused = ref(false)

const editorClickAway = () =>
	setTimeout(() => (editorFocused.value = false), 15)
const editorFocus = () => (editorFocused.value = true)
</script>

<template>
	<EditorContent :editor="editor" class="editor" @click="editorFocus" />
	<RichTextFixedMenu
		:editor="editor"
		:show="editorFocused || fixedMenuFocused"
		v-model="fixedMenuFocused"
	/>
</template>

<style lang="postcss" scoped>
.editor {
	>>> .ProseMirror {
		@apply min-h-[2rem];

		&:focus-visible {
			@apply outline-none;
		}

		ul {
			@apply ml-4 lg:ml-8;
			li p {
				@apply relative;
				&::before {
					content: '>';
					@apply absolute right-full mr-2;
				}
			}
		}

		ol {
			@apply ml-4 lg:ml-8;
			counter-reset: ol;
			li p {
				position: relative;
				&::before {
					counter-increment: ol;
					content: counter(ol) '.';
					@apply absolute right-full mr-1;
				}
			}
		}

		[data-indent='1'] {
			@apply ml-4 lg:ml-8;
		}
		[data-indent='2'] {
			@apply ml-8 lg:ml-16;
		}
		[data-indent='3'] {
			@apply ml-12 lg:ml-24;
		}
		[data-indent='4'] {
			@apply ml-16 lg:ml-32;
		}
		[data-indent='5'] {
			@apply ml-20 lg:ml-40;
		}
		[data-indent='6'] {
			@apply ml-24 lg:ml-48;
		}
		[data-indent='7'] {
			@apply ml-28 lg:ml-56;
		}
	}
}
</style>
